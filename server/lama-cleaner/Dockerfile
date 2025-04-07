FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/* 

RUN pip install --no-cache-dir lama-cleaner
RUN pip install --no-cache-dir "huggingface_hub==0.14.1"

EXPOSE 8080

# Start Lama Cleaner
CMD ["lama-cleaner", "--host", "0.0.0.0", "--port", "8080", "--model", "lama", "--device", "cpu"]
