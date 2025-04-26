FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libgcc-s1 \
    libpng16-16 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8080

CMD ["sh", "-c", "lama-cleaner --host 0.0.0.0 --port ${PORT:-8080} --model lama --device cpu"]
# CMD ["sh", "-c", "lama-cleaner --host 0.0.0.0 --port ${PORT:-8080} --model lama --device cpu --debug --no-half --cpu-offload --disable-nsfw --sd-cpu-textencoder"]
