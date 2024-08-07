from flask import Blueprint, jsonify, request
from .models import UploadedImage, UploadedImageList

main = Blueprint('main', __name__)

@main.route("/", methods=['POST'])
def dither_images():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'Invalid upload'}), 400
    
    images = UploadedImageList([])

    for image in data:
        uploadedImage = UploadedImage(
            id=image.id,
            file_name=image.file_name,
            src=image.src,
            dither=image.dither,
            dithered_image=image.dithered_image
        )
        images.append(uploadedImage)

    return jsonify(images.to_dict_list()), 201