import os

from django.core.exceptions import ValidationError
from PIL import Image


def validate_icon_image_size(image):
    if image:
        with Image.open(image) as img:
            if img.width > 70 or img.height > 70:
                raise ValidationError(
                    f"The maximu allowed dimensions for th eimage are 70x70 - size of image you uploaded: {img.size}"
                )


def validate_image_file_exstension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = [".jpg", ".jpeg", ".png", ".gif", "svg"]
    print(ext)
    if not ext.lower() in valid_extensions:
        raise ValidationError("Unsupported file extensions")
