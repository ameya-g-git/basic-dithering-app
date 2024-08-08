from flask import Blueprint, jsonify, request
from .models import UploadedImage, UploadedImageList
import json

uploaded_images = UploadedImageList([])

main = Blueprint('main', __name__)

@main.route("/", methods=['POST'])
def dither_images():
    try:
        form_data = request.form.get('images')

        data = []

        if not form_data:
            return jsonify({'error': 'Invalid upload'}), 400
        else:
            data : list[dict] = json.loads(form_data)
            print(data[0].get('filename'))

        for image in data:
            uploaded_image = UploadedImage(
                image_id=image.get('id'),
                file_name=image.get('fileName'),
                src=image.get('src'),
                dither=image.get('dither'),
                dithered_image=image.get('ditheredImage')
            )
            uploaded_images.push(uploaded_image)

        return jsonify(uploaded_images.to_dict_list()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@main.route("/", methods=['GET'])
def get_images():
    return jsonify(uploaded_images.to_dict_list()), 200