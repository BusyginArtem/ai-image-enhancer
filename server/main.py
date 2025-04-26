"""Module providing a set of functions to work with os system."""
import os
from io import BytesIO
import shutil
import uuid

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

import requests

app = FastAPI()

LAMA_CLEANER_URL = os.getenv("LAMA_CLEANER_URL", "http://lama-cleaner:8080")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://ai-image-enhancer-ashen.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = "/app"
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")


os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def root():
    """Test the server."""
    return {"message": "Hello World"}


@app.post("/inpaint/upload")
def upload_image(file: UploadFile = File(...)):
    """Uploading the image to the server."""

    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is required")

    file_extension = os.path.splitext(file.filename)[1].lower()
    allowed_extensions = {".png", ".jpg", ".jpeg"}

    if file_extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    try:
        filename = file.filename if file.filename else "default_filename"
        unique_filename = f"{filename}-{uuid.uuid4()}"
        file_path = os.path.join(UPLOAD_FOLDER, os.path.basename(unique_filename))

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return {"filename": unique_filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}") from e


@app.post("/inpaint/process")
async def process_image(
    image_unique_name: str = Form(...),
    mask: UploadFile = File(...),
):
    """Processes the image using Lama Cleaner."""
    try:
        # Ensure the image file exists
        image_path = os.path.join(UPLOAD_FOLDER, image_unique_name)

        if not os.path.exists(image_path):
            raise HTTPException(status_code=404, detail="Image file not found.")

        # Read mask into memory instead of saving to disk
        mask_data = await mask.read()
        mask_buffer = BytesIO(mask_data)

        files = {}
        with open(image_path, "rb") as image_file:
            files["image"] = (os.path.basename(image_path), image_file, "image/png")
        files["mask"] = (mask.filename, mask_buffer, "image/png")

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

        response = requests.post(f"{LAMA_CLEANER_URL}/inpaint", files=files, data=data, timeout=30)

        mask_buffer.close()
        os.remove(image_path)

        if response.status_code == 200:
            return Response(content=response.content, media_type="image/png")

        raise HTTPException(status_code=500, detail=f"Processing failed: {response.text}")
    except Exception as e:
        if os.path.exists(image_path):
            os.remove(image_path)
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}") from e
