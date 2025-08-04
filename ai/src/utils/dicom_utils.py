from PIL import Image
import numpy as np
import pydicom
import pydicom.uid

from pathlib import Path

def dicom_to_png(file_path: Path, save_folder_path: Path = None, calc_pixel_spacing: bool = False) -> str | None:
    """
    Convert a DICOM file to a PNG file and save it to the output directory.

    Args:
        file_path (Path): Path to the DICOM file.
        save_folder_path (Path, optional): Path to save the PNG file. Defaults to None.

    Returns:
        str: Path to the PNG file if successful, None otherwise.
    """

    # Read the raw byte content of the DICOM file
    with open(file_path, "rb") as f:
        dicom_bytes = f.read()

    # Remove MIME headers if present
    cleaned_dicom_bytes = remove_mime_headers(dicom_bytes)

    # Save cleaned DICOM content to a temporary file
    temp_file_path = file_path.parent / f"temp_{file_path.name}"

    with open(temp_file_path, "wb") as temp_file:
        temp_file.write(cleaned_dicom_bytes)

    # Read the DICOM file
    dicom = pydicom.dcmread(temp_file_path, force=True)
        
    # Ensure the DICOM file has pixel data
    if "PixelData" not in dicom:
        temp_file_path.unlink()  # Remove temporary file
        return None

    # Get the pixel array from the DICOM file
    pixel_array = dicom.pixel_array

    # Normalize the pixel array values to 0-255
    image_2d = pixel_array.astype(float)
    image_2d_scaled = (np.maximum(image_2d, 0) / image_2d.max()) * 255.0
    image_2d_scaled = np.uint8(image_2d_scaled)

    # Convert the numpy array to a PIL Image
    image = Image.fromarray(image_2d_scaled)

    # Define the output file path
    if save_folder_path:
        save_folder_path.mkdir(parents=True, exist_ok=True)  # Ensure the save directory exists
        output_file_path = save_folder_path / file_path.with_suffix(".png").name
    else:
        output_file_path = file_path.with_suffix(".png")

    # Save the image as PNG
    image.save(output_file_path)

    # Clean up temporary file
    temp_file_path.unlink()

    if calc_pixel_spacing:
        spacing = getattr(dicom, "PixelSpacing" , [0.5,0.5]) #mm
        return str(output_file_path), spacing

    return str(output_file_path)

def remove_mime_headers(dicom_bytes: bytes) -> bytes:
    """
    Remove MIME headers if present from a DICOM file.
    Args:
        dicom_bytes (bytes): The raw byte content of the DICOM file.
    Returns:
        bytes: The cleaned DICOM content.
    """
    # Check for MIME headers (e.g., "Content-Type: application/dicom")
    if dicom_bytes.startswith(b"--") or b"Content-Type" in dicom_bytes:
        # Find the first occurrence of two consecutive newlines, indicating end of headers
        header_end_index = dicom_bytes.find(b"\r\n\r\n")
        if header_end_index == -1:
            header_end_index = dicom_bytes.find(b"\n\n")
        
        # Remove headers if found
        if header_end_index != -1:
            return dicom_bytes[header_end_index + 4:]
    
    # No headers found; return original bytes
    return dicom_bytes
