# AI Image Enhancer

## Build Status Badge: [![Deploy Next.js to Vercel](https://github.com/BusyginArtem/ai-image-enhancer/actions/workflows/deploy-client.yml/badge.svg?branch=main&event=push)](https://github.com/BusyginArtem/ai-image-enhancer/actions/workflows/deploy-client.yml) | [![Deploy Server & Lama Cleaner to Railway](https://github.com/BusyginArtem/ai-image-enhancer/actions/workflows/deploy-server.yml/badge.svg?branch=main&event=push)](https://github.com/BusyginArtem/ai-image-enhancer/actions/workflows/deploy-server.yml)

AI Image Enhancer is a monorepo project featuring a Next.js frontend for a user-friendly interface and a backend powered by a Python FastAPI server and Lama Cleaner for AI-driven image enhancement. The frontend is deployed on Vercel, while the backend services run on Railway.

## Project Structure

- **`client/`**: Next.js frontend for uploading and enhancing images.
- **`server/`**: Python FastAPI server handling API requests and integration with Lama Cleaner.
- **`server/lama-cleaner/`**: Dockerized [Lama Cleaner](https://github.com/Sanster/lama-cleaner) for AI image inpainting and enhancement.

## Prerequisites

- **Docker**: For running the project locally with Docker Compose
- **Vercel CLI**: For frontend deployment
- **Railway CLI**: For backend deployment
- **Git**: For version control

Optional for non-Docker development:
- **Node.js**: v18 or later (for `client/`)
- **Python**: v3.10 or later (for `server/`)

## Getting Started Locally

To run the entire project locally (frontend, FastAPI server, and Lama Cleaner) using Docker Compose:

```bash
docker-compose up --build
