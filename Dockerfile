# Step 1: Build the React frontend
FROM node:20-alpine AS build-stage
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Step 2: Set up the FastAPI + PyTorch backend
FROM python:3.10-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies from PyPI
RUN pip install --no-cache-dir \
    fastapi \
    uvicorn \
    python-multipart \
    pillow

# Install PyTorch and TorchVision from the PyTorch CPU index
RUN pip install --no-cache-dir \
    torch \
    torchvision \
    --index-url https://download.pytorch.org/whl/cpu

# Copy the backend files and model
COPY backend/main.py /app/main.py
COPY backend/latest_net_G_A.pth /app/latest_net_G_A.pth

# Copy the built frontend static assets
COPY --from=build-stage /app/frontend/dist /app/dist

# Expose port 7860 (Hugging Face Spaces default port)
EXPOSE 7860

# Run the backend and serve the frontend static files
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
