import litserve as ls
from pathlib import Path
import os
import numpy as np
import nibabel as nib
import pydicom
import zipfile
import base64
from io import BytesIO
from totalsegmentator.python_api import totalsegmentator
from enums import DLModelEndpoint

class TotalSegmentorAPI(ls.LitAPI):
    def setup(self, device: str):
        # setup is called once at startup. Add task options here if needed
        self.tasks = [
            "total", "total_mr", "body", "vertebrae_body", "appendicular_bones",
            "tissue_types", "tissue_types_mr", "face", "face_mr"
        ]

    def decode_request(self, request: dict) -> tuple:
        # Decode the request to extract dicom folder and task information
        dicom_folder = Path(request["folder_path"])
        task = request.get("task", "total")
        fast = request.get("fast", True)
        output_nifti_path = dicom_folder / "generated_nifti.nii"
        statistics = request.get("statistics", True)

        # Ensure task is valid
        if task not in self.tasks:
            raise ValueError(f"Invalid task '{task}'. Available tasks: {self.tasks}")

        return dicom_folder, output_nifti_path, task, fast, statistics

    def dicom_to_nifti(self, dicom_folder: Path, output_nifti_path: Path) -> Path:
        """
        Converts a folder of DICOM files to a NIfTI file.

        Parameters:
        - dicom_folder: Path of the DICOM folder.
        - output_nifti_path: Path where the output NIfTI file will be saved.

        Returns:
        - Path to the generated NIfTI file.
        """
        print("Creating Niffti File...")
        def safe_read_dicom(file_path: Path):
            try:
                return pydicom.dcmread(file_path, force=True)
            except Exception as e:
                print(f"Error reading file {file_path}: {e}")
                return None

        dicom_files = [f for f in os.listdir(dicom_folder) if f.lower().endswith(('.dcm', '.ima'))]
        dicom_files.sort()

        # Read DICOM files
        slices = [safe_read_dicom(dicom_folder / f) for f in dicom_files]
        slices = [s for s in slices if s is not None]
        
        if not slices:
            raise ValueError("No valid DICOM files found.")
        
        # Extract pixel data
        pixel_arrays = [s.pixel_array for s in slices]
        volume = np.stack(pixel_arrays, axis=-1)
        
        # Get metadata for affine transformation
        first_slice = slices[0]
        pixel_spacing = getattr(first_slice, 'PixelSpacing', [1, 1])
        slice_thickness = getattr(first_slice, 'SliceThickness', 1)
        
        affine = np.eye(4)
        affine[0, 0] = pixel_spacing[1]
        affine[1, 1] = pixel_spacing[0]
        affine[2, 2] = slice_thickness
        
        if hasattr(first_slice, 'ImageOrientationPatient'):
            row_cosine = np.array(first_slice.ImageOrientationPatient[:3])
            col_cosine = np.array(first_slice.ImageOrientationPatient[3:])
            slice_cosine = np.cross(row_cosine, col_cosine)
            affine[:3, 0] = row_cosine * pixel_spacing[1]
            affine[:3, 1] = col_cosine * pixel_spacing[0]
            affine[:3, 2] = slice_cosine * slice_thickness
            
            if hasattr(first_slice, 'ImagePositionPatient'):
                affine[:3, 3] = first_slice.ImagePositionPatient
        
        # Create NIfTI image and save it
        nifti_img = nib.Nifti1Image(volume, affine)
        nib.save(nifti_img, output_nifti_path)
        print('output_nifti_path: ', output_nifti_path)
        return output_nifti_path

    def run_totalsegmentor(self, input_nifti_file: Path, output_folder: Path, task: str, fast: bool, statistics: bool):
        """
        Runs TotalSegmentator on the input NIfTI file.

        Parameters:
        - input_nifti_file: Path to the input NIfTI file.
        - output_folder: Path where output segmentation will be saved.
        - task: Task option for TotalSegmentator.
        - fast: Boolean flag for faster processing.
        - statistics: Boolean flag for whether statistics are included.
        """
        totalsegmentator(
            input=str(input_nifti_file.resolve()),
            output=str(output_folder.resolve()),
            task=task,
            force_split=True,
            fast=fast,
            nr_thr_resamp=1,
            nr_thr_saving=1,
            preview=True,
            statistics=statistics,
            quiet=False,
            device='gpu'
        )

    def zip_output_folder(self, folder: Path) -> str:
        """
        Zips the output folder and returns the base64-encoded string of the zipped content.

        Parameters:
        - folder: Path to the folder to be zipped.

        Returns:
        - Base64-encoded string of the zipped folder content.
        """
        if not folder.exists():
            return None
        
        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for root, _, files in os.walk(folder):
                for file in files:
                    file_path = Path(root) / file
                    zip_file.write(file_path, arcname=file_path.relative_to(folder))
        
        # Get the base64-encoded string
        zip_buffer.seek(0)
        encoded_zip = base64.b64encode(zip_buffer.read()).decode('utf-8')
        return encoded_zip

    def predict(self, payload: tuple) -> dict:
        dicom_folder, output_nifti_path, task, fast, statistics = payload
        
        # Convert DICOM folder to NIfTI
        nifti_path = self.dicom_to_nifti(dicom_folder, output_nifti_path)

        # Define output path for TotalSegmentator
        output_folder = dicom_folder / "output"

        # Run TotalSegmentator
        self.run_totalsegmentor(nifti_path, output_folder, task, fast, statistics)

        # Zip and encode the output folder
        encoded_zip = self.zip_output_folder(output_folder)
        return {"output": encoded_zip}

    def encode_response(self, output: dict) -> dict:
        # Return base64-encoded zipped segmentation results
        return {"output": output["output"]}

if __name__ == "__main__":
    port, api_path = DLModelEndpoint.ABDOMINAL_ORGANS_SEGMENTATION.strip().split(":")[-1].split("/")
    server = ls.LitServer(TotalSegmentorAPI(), accelerator='cuda', devices=1, max_batch_size=1, api_path="/{api_path}")
    server.run(port=port)
