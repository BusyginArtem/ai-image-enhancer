FROM python:3.10-slim-bookworm

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libgl1 \
    # libgl1-mesa-glx \
    libglib2.0-0 \
    # libgcc-s1 \
    # libpng16-16 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

ENV PORT=8080
ENV MODEL=lama
ENV DEVICE=cpu

EXPOSE ${PORT}

ENTRYPOINT ["sh", "-c"]
CMD ["lama-cleaner --host 0.0.0.0 --port ${PORT} --model ${MODEL} --device ${DEVICE}"]
