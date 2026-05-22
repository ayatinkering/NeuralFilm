from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import torch
from PIL import Image
import io
import base64
import torchvision.transforms as transforms
import cv2
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change to Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = torch.load("latest_net_G_A.pth", map_location=device)
model.eval()

transform_in = transforms.Compose([
    transforms.Resize(1024),
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
])

transform_out = transforms.Compose([
    transforms.Normalize((-1, -1, -1), (2, 2, 2)),
    transforms.ToPILImage()
])

def apply_opencv_effects(pil_image):
    cv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
    noise = np.random.normal(0, 15, cv_image.shape).astype(np.uint8)
    noisy_image = cv2.add(cv_image, noise)
    return Image.fromarray(cv2.cvtColor(noisy_image, cv2.COLOR_BGR2RGB))

@app.post("/emulate")
async def emulate_film(file: UploadFile = File(...)):
    image_bytes = await file.read()
    input_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
    # Fake the model process for testing today
    # input_tensor = transform_in(input_image).unsqueeze(0).to(device)
    # with torch.no_grad():
    #     output_tensor = model(input_tensor)
    # output_image = transform_out(output_tensor.squeeze(0).cpu())
    
    # For testing today, we will just apply grain to the original image
    output_image = input_image.resize((1024, int(1024 * input_image.height / input_image.width)))
    final_image = apply_opencv_effects(output_image)
    
    buffered = io.BytesIO()
    final_image.save(buffered, format="JPEG", quality=90)
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    
    return JSONResponse(content={"emulated_image": img_str})