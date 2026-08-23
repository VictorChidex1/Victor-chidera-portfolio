import urllib.request
import zipfile
import os
from PIL import Image, ImageDraw, ImageFont

def generate_logo():
    print("Downloading font...")
    font_path = "Roboto-Black.ttf"
    url = "https://github.com/googlefonts/roboto/raw/main/src/hinted/Roboto-Black.ttf"
    urllib.request.urlretrieve(url, font_path)
    
    size = 1024
    image = Image.new("RGBA", (size, size), (255, 255, 255, 0)) # Transparent
    draw = ImageDraw.Draw(image)
    
    # Brand colors
    brand_orange = (249, 115, 22, 255)
    brand_slate = (15, 23, 42, 255)
    
    # Draw sleek geometric shapes for the logo background
    # An angled squircle or just a very nice circle
    draw.ellipse((64, 64, 960, 960), fill=brand_slate)
    # Inner border
    draw.arc((100, 100, 924, 924), 0, 360, fill=brand_orange, width=24)
    
    # Load font
    try:
        font = ImageFont.truetype(font_path, 480)
    except Exception as e:
        print("Failed to load font:", e)
        font = ImageFont.load_default()
        
    # Text VC
    text = "VC"
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_w = text_bbox[2] - text_bbox[0]
    text_h = text_bbox[3] - text_bbox[1]
    
    # Center text
    x = (size - text_w) / 2
    y = (size - text_h) / 2 - 50 
    
    # Add subtle shadow for the text
    draw.text((x+8, y+8), text, fill=(0,0,0,150), font=font)
    # Draw main text
    draw.text((x, y), text, fill=brand_orange, font=font)
    
    image.save("public/vc-logo.png")
    print("Logo saved to public/vc-logo.png")

if __name__ == "__main__":
    generate_logo()
