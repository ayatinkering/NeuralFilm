# Neural Film

Neural Film is an AI-powered film emulation app that transforms digital photos into a Kodak Gold 200-inspired look. It pairs a React image comparison interface with a PyTorch/FastAPI inference backend running a CycleGAN-style ResNet generator.

The project is designed as a practical full-stack machine learning demo: upload a photo, run neural style translation on the backend, and compare the original and emulated result with an interactive before/after slider.

## Highlights

- **Film emulation with deep learning**: uses a ResNet generator architecture commonly used in CycleGAN image-to-image translation workflows.
- **End-to-end ML product flow**: image upload, preprocessing, model inference, postprocessing, and browser rendering.
- **Interactive before/after UI**: React frontend with a draggable comparison slider for visual evaluation.
- **FastAPI inference service**: lightweight Python API for serving the model locally.
- **GPU-aware backend**: automatically uses CUDA when available and falls back to CPU.
- **Dataset prep helper**: includes a resizing/cropping utility for preparing paired image folders.

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, react-compare-image |
| Backend | FastAPI, PyTorch, TorchVision, Pillow |
| Model | CycleGAN-style ResNet Generator |
| Utilities | Python image preprocessing script |

## Demo Flow

1. Open the web app.
2. Upload a digital photo.
3. The frontend sends the image to the FastAPI backend.
4. The backend resizes and normalizes the image, runs neural inference, and returns a JPEG as base64.
5. The UI displays a side-by-side comparison between the original photo and the emulated Kodak Gold 200 output.

## Project Structure

```text
NeuralFilm/
├── backend/
│   └── main.py              # FastAPI app and PyTorch inference pipeline
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Upload UI and before/after comparison
│   │   ├── main.jsx         
│   │   └── index.css       
│   ├── package.json        
│   └── vite.config.js
├── resize.py                # Dataset crop/resize helper
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- Python 3.10+
- A trained model checkpoint named `latest_net_G_A.pth`

Model files are intentionally ignored by Git because they are usually large. Place your trained checkpoint in the project root:

```text
NeuralFilm/latest_net_G_A.pth
```

### Backend Setup

Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate
```

Install backend dependencies:

```bash
pip install fastapi uvicorn python-multipart torch torchvision pillow
```

Start the API server from the project root:

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:

```text
http://localhost:8000
```

### Frontend Setup

Install dependencies:

```bash
cd frontend
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local Vite URL shown in your terminal, usually:

```text
http://localhost:5173
```

## API

### `POST /emulate`

Accepts an uploaded image and returns the film-emulated result.

**Request**

```text
multipart/form-data
file: image file
```

**Response**

```json
{
  "emulated_image": "base64-encoded-jpeg"
}
```

## Contributing

To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make a focused change.
4. Run the frontend build or relevant backend checks.
5. Open a pull request with a clear description.

