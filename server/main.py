from fastapi import FastAPI, File, UploadFile
import shutil
import os
from pathlib import Path
from subprocess import run

app = FastAPI()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    file_path = UPLOAD_FOLDER / file.filename
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"filename": file.filename, "path": str(file_path)}

@app.post("/process")
async def process_image(file: UploadFile = File(...), mask: UploadFile = File(...)):
    input_path = f"{UPLOAD_FOLDER}/{file.filename}"
    mask_path = f"{UPLOAD_FOLDER}/{mask.filename}"
    output_path = f"outputs/{file.filename}"

    # Save input image and mask
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    with open(mask_path, "wb") as buffer:
        shutil.copyfileobj(mask.file, buffer)

    # Run Lama Cleaner processing
    command = [
        "lama-cleaner",
        "--input", input_path,
        "--mask", mask_path,
        "--output", output_path,
        "--model", "lama"
    ]
    run(command)

    return {"output_path": output_path}
