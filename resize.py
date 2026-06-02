import os
from PIL import Image

#resize all images to 256x256
def process_directory(directory):
    for filename in os.listdir(directory):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            filepath = os.path.join(directory, filename)
            try:
                with Image.open(filepath) as img:
                    width, height = img.size
                    new_size = min(width, height)
                    left = (width - new_size) / 2
                    top = (height - new_size) / 2
                    right = (width + new_size) / 2
                    bottom = (height + new_size) / 2

                    img_cropped = img.crop((left, top, right, bottom))
                    img_resized = img_cropped.resize((256, 256), Image.Resampling.LANCZOS)
                    
                    img_resized.save(filepath)
            except Exception as e:
                print(e)

process_directory('./data/kodak_gold_200/trainA')
process_directory('./data/kodak_gold_200/trainB')