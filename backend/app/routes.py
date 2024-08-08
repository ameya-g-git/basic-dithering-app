from flask import Blueprint, jsonify, request
from .models import UploadedImage, UploadedImageList

uploaded_images = UploadedImageList([])

main = Blueprint('main', __name__)

@main.route("/", methods=['POST'])
def dither_images():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'Invalid upload'}), 400

    for image in data:
        uploadedImage = UploadedImage(
            id=image.id,
            file_name=image.file_name,
            src=image.src,
            dither=image.dither,
            dithered_image=image.dithered_image
        )
        uploaded_images.append(uploadedImage)

    return jsonify(uploaded_images.to_dict_list()), 201

@main.route("/", methods=['GET'])
def get_images():
    return jsonify(uploaded_images.to_dict_list()), 200