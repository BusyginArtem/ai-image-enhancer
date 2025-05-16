"""Module providing a set of functions to work with os system."""
import os
from io import BytesIO
import shutil
import uuid

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

import httpx

app = FastAPI()

LAMA_CLEANER_URL = os.getenv("LAMA_CLEANER_URL", "http://lama-cleaner:8080")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://ai-image-enhancer-ashen.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# BASE_DIR = "/app"
# UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
print(f"Creating UPLOAD_FOLDER: {UPLOAD_FOLDER}")
ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg"}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def root():
    """Test the server."""
    return {"message": "Hello World"}


# @app.post("/inpaint/upload")
# def upload_image(file: UploadFile = File(...)):
#     """Uploading the image to the server."""

#     if not file.filename:
#         raise HTTPException(status_code=400, detail="Filename is required")

#     [file_name, file_extension] = os.path.splitext(file.filename)
#     allowed_extensions = {".png", ".jpg", ".jpeg"}

#     if file_extension.lower() not in allowed_extensions:
#         raise HTTPException(status_code=400, detail="Unsupported file type")

#     try:
#         unique_filename = f"{file_name}-{uuid.uuid4()}{file_extension}"
#         file_path = os.path.join(UPLOAD_FOLDER, os.path.basename(unique_filename))

#         with open(file_path, "wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)
#         return {"filename": unique_filename}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}") from e

def _validate_upload_file(file: UploadFile):
    """Validates the uploaded file's name and extension."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is required")
    _, file_extension = os.path.splitext(file.filename)
    if file_extension.lower() not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported file type")


def _generate_unique_filename(filename: str) -> str:
    """Generates a unique filename for the uploaded file."""
    file_name, file_extension = os.path.splitext(filename)
    return f"{file_name}-{uuid.uuid4()}{file_extension}"


def _save_uploaded_file(file: UploadFile, file_path: str):
    """Saves the uploaded file to the specified path."""
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}") from e


@app.post("/inpaint/upload")
def upload_image(file: UploadFile = File(...)):
    """Uploading the image to the server."""
    _validate_upload_file(file)

    if file.filename is None:
        raise HTTPException(status_code=400, detail="Filename is required")

    unique_filename = _generate_unique_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, os.path.basename(unique_filename))
    _save_uploaded_file(file, file_path)
    return {"filename": unique_filename}


# @app.post("/inpaint/process")
# async def process_image(
#     image_unique_name: str = Form(...),
#     mask: UploadFile = File(...),
# ):
#     """Processes the image using Lama Cleaner."""
#     try:
#         # Ensure the image file exists
#         image_path = os.path.normpath(os.path.join(UPLOAD_FOLDER, image_unique_name))

#         # Ensure the path is within the UPLOAD_FOLDER
#         if not image_path.startswith(os.path.abspath(UPLOAD_FOLDER)):
#             raise HTTPException(status_code=400, detail="Invalid file path.")

#         if not os.path.exists(image_path):
#             raise HTTPException(status_code=404, detail="Image file not found.")

#         # Read mask into memory instead of saving to disk
#         mask_data = await mask.read()
#         mask_buffer = BytesIO(mask_data)

#         files = {}
#         image_file = open(image_path, "rb")
#         files["image"] = (os.path.basename(image_path), image_file, "image/png")
#         files["mask"] = (mask.filename, mask_buffer, "image/png")

#         data = {
#             "ldmSteps": "25",
#             "ldmSampler": "plms",
#             "zitsWireframe": "true",
#             "hdStrategy": "Crop",
#             "hdStrategyCropMargin": "196",
#             "hdStrategyCropTrigerSize": "800",
#             "hdStrategyResizeLimit": "2048",
#             "prompt": "",
#             "croperX": "-91",
#             "croperY": "-66",
#             "croperHeight": "512",
#             "croperWidth": "512",
#             "useCroper": "false",
#             "sdMaskBlur": "5",
#             "sdStrength": "0.75",
#             "sdSteps": "50",
#             "sdGuidanceScale": "7.5",
#             "sdSampler": "uni_pc",
#             "sdSeed": "-1",
#             "negativePrompt": "",
#             "sdMatchHistograms": "false",
#             "sdScale": "1",
#             "cv2Radius": "5",
#             "cv2Flag": "INPAINT_NS",
#             "paintByExampleSteps": "50",
#             "paintByExampleGuidanceScale": "7.5",
#             "paintByExampleSeed": "-1",
#             "paintByExampleMaskBlur": "5",
#             "paintByExampleMatchHistograms": "false",
#             "p2pSteps": "50",
#             "p2pImageGuidanceScale": "1.5",
#             "p2pGuidanceScale": "7.5",
#             "controlnet_conditioning_scale": "0.4",
#             "controlnet_method": "control_v11p_sd15_canny",
#         }

#         # response = requests.post(f"{LAMA_CLEANER_URL}/inpaint", files=files, data=data, timeout=30)

#         async with httpx.AsyncClient() as client:
#             response = await client.post(f"{LAMA_CLEANER_URL}/inpaint", files=files, data=data, timeout=30)

#         image_file.close()
#         mask_buffer.close()

#         if os.path.exists(image_path):
#             os.remove(image_path)

#         if response.status_code == 200:
#             return Response(content=response.content, media_type="image/png")
#         raise HTTPException(status_code=500, detail=f"Processing failed: {response.text}")
#     except HTTPException as http_exc:
#         raise http_exc
#     except Exception as e:
#         if 'image_file' in locals():
#             image_file.close()
#         if 'mask_buffer' in locals():
#             mask_buffer.close()

#         if os.path.exists(image_path):
#             os.remove(image_path)
#         raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}") from e

async def _validate_image(image_unique_name: str) -> str:
    """Ensures the image file exists and the path is valid."""
    image_path = os.path.normpath(os.path.join(UPLOAD_FOLDER, image_unique_name))
    if not image_path.startswith(os.path.abspath(UPLOAD_FOLDER)):
        raise HTTPException(status_code=400, detail="Invalid file path.")
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image file not found.")
    return image_path


async def _read_mask_data(mask: UploadFile) -> BytesIO:
    """Reads the mask file data into a buffer."""
    mask_data = await mask.read()
    return BytesIO(mask_data)


def _prepare_api_payload(image_path: str, mask: UploadFile, mask_buffer: BytesIO) -> tuple[dict, dict]:
    """Prepares the files and data payload for the Lama Cleaner API."""
    image_file = open(image_path, "rb")  # pylint: disable=consider-using-with
    files = {
        "image": (os.path.basename(image_path), image_file, "image/png"),
        "mask": (mask.filename, mask_buffer, "image/png")
    }

    data = {
        "ldmSteps": "25",
        "ldmSampler": "plms",
        "zitsWireframe": "true",
        "hdStrategy": "Crop",
        "hdStrategyCropMargin": "196",
        "hdStrategyCropTrigerSize": "800",
        "hdStrategyResizeLimit": "2048",
        "prompt": "",
        "croperX": "-91",
        "croperY": "-66",
        "croperHeight": "512",
        "croperWidth": "512",
        "useCroper": "false",
        "sdMaskBlur": "5",
        "sdStrength": "0.75",
        "sdSteps": "50",
        "sdGuidanceScale": "7.5",
        "sdSampler": "uni_pc",
        "sdSeed": "-1",
        "negativePrompt": "",
        "sdMatchHistograms": "false",
        "sdScale": "1",
        "cv2Radius": "5",
        "cv2Flag": "INPAINT_NS",
        "paintByExampleSteps": "50",
        "paintByExampleGuidanceScale": "7.5",
        "paintByExampleSeed": "-1",
        "paintByExampleMaskBlur": "5",
        "paintByExampleMatchHistograms": "false",
        "p2pSteps": "50",
        "p2pImageGuidanceScale": "1.5",
        "p2pGuidanceScale": "7.5",
        "controlnet_conditioning_scale": "0.4",
        "controlnet_method": "control_v11p_sd15_canny",
    }

    return files, data


async def _send_to_lama_cleaner(files: dict, data: dict) -> Response:
    """Sends the image and mask to the Lama Cleaner API and returns the response."""
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{LAMA_CLEANER_URL}/inpaint", files=files, data=data, timeout=30)

        if response.status_code == 200:
            return Response(content=response.content, media_type="image/png")
        raise HTTPException(status_code=500, detail=f"Processing failed: {response.text}")


def _cleanup_files(image_path: str, image_file=None, mask_buffer=None):
    """Closes opened files and removes the local image file."""
    if image_file:
        image_file.close()
    if mask_buffer:
        mask_buffer.close()
    if os.path.exists(image_path):
        os.remove(image_path)


@app.post("/inpaint/process")
async def process_image(
    image_unique_name: str = Form(...),
    mask: UploadFile = File(...),
):
    """Processes the image using Lama Cleaner."""
    image_path = None
    image_file = None
    mask_buffer = None
    try:
        image_path = await _validate_image(image_unique_name)
        mask_buffer = await _read_mask_data(mask)
        files, data = _prepare_api_payload(image_path, mask, mask_buffer)
        image_file = files["image"][1]  # Get the opened image file object
        response = await _send_to_lama_cleaner(files, data)

        return response
    except HTTPException as http_exc:
        print(f"[http_exc]: {http_exc}")
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}") from e
    finally:
        _cleanup_files(image_path or "", image_file, mask_buffer)
