import os
from PIL import Image

image_dir = r"c:\Users\arenc\Desktop\asiste\assets\images"

def optimize_images():
    for filename in ["imagen5.png", "imagen8.png"]:
        filepath = os.path.join(image_dir, filename)
        if os.path.exists(filepath):
            webp_filepath = os.path.join(image_dir, os.path.splitext(filename)[0] + ".webp")
            try:
                img = Image.open(filepath)
                img.save(webp_filepath, "webp", quality=75, method=6)
                print(f"Optimized: {filename} -> {os.path.basename(webp_filepath)}")
                os.remove(filepath)
            except Exception as e:
                print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    optimize_images()
