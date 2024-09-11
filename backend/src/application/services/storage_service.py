from fastapi import UploadFile
from core import ResultWithData, DIContainer

@DIContainer.register_singleton()
class StorageService:
    """Service class for interating with storage cloud services AWS S3"""

    async def upload_file(self, file: UploadFile, bucket_name: str, object_name: str) -> ResultWithData[str]:
        """
        Asynchronously upload a file to an S3 bucket.
        Args:
            file (UploadFile): The file to upload.
            bucket_name (str): The name of the bucket to upload to.
            object_name (str): The name of the object in the bucket.
        Returns:
            Result: The result of the operation with the file URL.
        """
        try:
            # TODO: Implement the AWS S3 upload functionality
            #s3_client = boto3.client("s3")
            #s3_client.upload_file(file_path, bucket_name, object_name)

            # For now, just write the file to the file system
            file_path = f"temp/{object_name}"
            
            with open(file_path, "rb") as buffer:
                file_content = await file.read()
                buffer.write(file_content)
            
            return ResultWithData[str].succeed(file_path)
        except Exception as e:
            return ResultWithData.fail(str(e))
