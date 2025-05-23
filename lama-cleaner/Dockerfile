# FROM nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04

# RUN apt-get update && apt-get install -y \
#     python3-pip \
#     libgl1 \
#     libglib2.0-0 && \
#     apt-get clean && rm -rf /var/lib/apt/lists/*

# WORKDIR /app
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# ENV PORT=8080
# ENV MODEL=lama
# ENV DEVICE=cuda

# EXPOSE ${PORT}
# CMD ["lama-cleaner", "--host", "0.0.0.0", "--port", "${PORT}", "--model", "${MODEL}", "--device", "${DEVICE}"]


FROM python:3.10-slim-bookworm

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
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

# optional arguments:
#   -h, --help            show this help message and exit
#   --host HOST
#   --port PORT
#   --config-installer    Open config web page, mainly for windows installer (default: False)
#   --load-installer-config
#                         Load all cmd args from installer config file (default: False)
#   --installer-config INSTALLER_CONFIG
#                         Config file for windows installer (default: None)
#   --model {lama,ldm,zits,mat,fcf,sd1.5,cv2,manga,sd2,paint_by_example,instruct_pix2pix}
#   --no-half             Using full precision model. If your generate result is always black or green, use this argument. (sd/paint_by_exmaple) (default: False)
#   --cpu-offload         Offloads all models to CPU, significantly reducing vRAM usage. (sd/paint_by_example) (default: False)
#   --disable-nsfw        Disable NSFW checker. (sd/paint_by_example) (default: False)
#   --sd-cpu-textencoder  Run Stable Diffusion text encoder model on CPU to save GPU memory. (default: False)
#   --local-files-only    Use local files only, not connect to Hugging Face server. (sd/paint_by_example) (default: False)
#   --enable-xformers     Enable xFormers optimizations. Requires xformers package has been installed. See: https://github.com/facebookresearch/xformers (sd/paint_by_example) (default: False)
#   --device {cuda,cpu,mps}
#   --gui                 Launch Lama Cleaner as desktop app (default: False)
#   --no-gui-auto-close   Prevent backend auto close after the GUI window closed. (default: False)
#   --gui-size GUI_SIZE GUI_SIZE
#                         Set window size for GUI (default: [1600, 1000])
#   --input INPUT         If input is image, it will be loaded by default. If input is directory, you can browse and select image in file manager. (default: None)
#   --output-dir OUTPUT_DIR
#                         Result images will be saved to output directory automatically without confirmation. (default: None)
#   --model-dir MODEL_DIR
#                         Model download directory (by setting XDG_CACHE_HOME environment variable), by default model downloaded to ~/.cache (default: /Users/cwq/.cache)
#   --disable-model-switch
#                         Disable model switch in frontend (default: False)
