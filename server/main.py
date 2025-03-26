from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
# from starlette.responses import FileResponse

import shutil
import os
import requests

app = FastAPI()

LAMA_CLEANER_URL = os.getenv("LAMA_CLEANER_URL", "http://lama-cleaner:8080/inpaint")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development. Restrict this in production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = "/app"
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
OUTPUT_FOLDER = os.path.join(BASE_DIR, "outputs")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# class CORPStaticFiles(StaticFiles):
#     async def get_response(self, path: str, scope):
#         response = await super().get_response(path, scope)
#         response.headers["Cross-Origin-Resource-Policy"] = "cross-origin"
#         return response

print(f"OUTPUT_FOLDER resolved to: {os.path.abspath(OUTPUT_FOLDER)}")
app.mount("/outputs", StaticFiles(directory=OUTPUT_FOLDER), name="outputs")
        
@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """Uploading the image to the server."""
    try:        
        file_path = os.path.join(UPLOAD_FOLDER, os.path.basename(file.filename))

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return {"filename": file.filename, "path": str(file_path)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")

@app.post("/process")
async def process_image(
    image_path: str = Form(...),
    mask: UploadFile = File(...),
    ldmSteps: int = Form(25),
    ldmSampler: str = Form("plms"),
    zitsWireframe: bool = Form(True),
    hdStrategy: str = Form("Crop"),
    hdStrategyCropMargin: int = Form(196),
    hdStrategyCropTrigerSize: int = Form(800),
    hdStrategyResizeLimit: int = Form(2048),
    prompt: str = Form(""),
    negativePrompt: str = Form(""),
    croperX: int = Form(-91),
    croperY: int = Form(-66),
    croperHeight: int = Form(512),
    croperWidth: int = Form(512),
    useCroper: bool = Form(False),
    sdMaskBlur: int = Form(5),
    sdStrength: float = Form(0.75),
    sdSteps: int = Form(50),
    sdGuidanceScale: float = Form(7.5),
    sdSampler: str = Form("uni_pc"),
    sdSeed: int = Form(-1),
    sdMatchHistograms: bool = Form(False),
    sdScale: float = Form(1),
    cv2Radius: int = Form(5),
    cv2Flag: str = Form("INPAINT_NS"),
    paintByExampleSteps: int = Form(50),
    paintByExampleGuidanceScale: float = Form(7.5),
    paintByExampleSeed: int = Form(-1),
    paintByExampleMaskBlur: int = Form(5),
    paintByExampleMatchHistograms: bool = Form(False),
    p2pSteps: int = Form(50),
    p2pImageGuidanceScale: float = Form(1.5),
    p2pGuidanceScale: float = Form(7.5),
    controlnet_conditioning_scale: float = Form(0.4),
    controlnet_method: str = Form("control_v11p_sd15_canny"),
):
    """Processes the image using Lama Cleaner."""
    try:
        # Ensure the image file exists
        if not os.path.exists(image_path):
            raise HTTPException(status_code=404, detail="Image file not found.")

        mask_path = os.path.join(UPLOAD_FOLDER, os.path.basename(mask.filename))
        with open(mask_path, "wb") as buffer:
            shutil.copyfileobj(mask.file, buffer)

        files = {
            "image": (os.path.basename(image_path), open(image_path, "rb"), "image/png"),
            "mask": (mask.filename, open(mask_path, "rb"), "image/png"),
        }
        
        data = {
            "ldmSteps": str(ldmSteps),
            "ldmSampler": ldmSampler,
            "zitsWireframe": str(zitsWireframe).lower(),
            "hdStrategy": hdStrategy,
            "hdStrategyCropMargin": str(hdStrategyCropMargin),
            "hdStrategyCropTrigerSize": str(hdStrategyCropTrigerSize),
            "hdStrategyResizeLimit": str(hdStrategyResizeLimit),
            "prompt": prompt,
            "negativePrompt": negativePrompt,
            "croperX": str(croperX),
            "croperY": str(croperY),
            "croperHeight": str(croperHeight),
            "croperWidth": str(croperWidth),
            "useCroper": str(useCroper).lower(),
            "sdMaskBlur": str(sdMaskBlur),
            "sdStrength": str(sdStrength),
            "sdSteps": str(sdSteps),
            "sdGuidanceScale": str(sdGuidanceScale),
            "sdSampler": sdSampler,
            "sdSeed": str(sdSeed),
            "sdMatchHistograms": str(sdMatchHistograms).lower(),
            "sdScale": str(sdScale),
            "cv2Radius": str(cv2Radius),
            "cv2Flag": cv2Flag,
            "paintByExampleSteps": str(paintByExampleSteps),
            "paintByExampleGuidanceScale": str(paintByExampleGuidanceScale),
            "paintByExampleSeed": str(paintByExampleSeed),
            "paintByExampleMaskBlur": str(paintByExampleMaskBlur),
            "paintByExampleMatchHistograms": str(paintByExampleMatchHistograms).lower(),
            "p2pSteps": str(p2pSteps),
            "p2pImageGuidanceScale": str(p2pImageGuidanceScale),
            "p2pGuidanceScale": str(p2pGuidanceScale),
            "controlnet_conditioning_scale": str(controlnet_conditioning_scale),
            "controlnet_method": controlnet_method,
        }
        
        response = requests.post(LAMA_CLEANER_URL, files=files, data=data)
        
        os.remove(mask_path)

        if response.status_code == 200:
            output_filename = f"processed_{os.path.basename(image_path)}"
            output_path = os.path.join(OUTPUT_FOLDER, output_filename)
            
            with open(output_path, "wb") as f:
                f.write(response.content)
                
            if os.path.exists(output_path):
                print(f"File written successfully: {output_path}")
            else:
                print(f"File not written: {output_path}")
                
            os.remove(image_path)
            output_url = f"/outputs/{output_filename}"
            
            if os.path.exists(output_path):
                print(f"File confirmed at: {output_path}")
            else:
                print(f"File missing at: {output_path}")
            
            return {"message": "Processing complete", "output_url": output_url}
        else:
            os.remove(image_path)
            raise HTTPException(status_code=500, detail=f"Processing failed: {response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
