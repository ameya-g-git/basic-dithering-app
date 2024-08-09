from flask import Blueprint, jsonify, request
from .models import UploadedImage, UploadedImageList
import json
from io import BytesIO
from json import loads
from base64 import b64decode
from PIL import Image

from .utils.floydsteinberg import floyd_steinberg

uploaded_images = UploadedImageList([])

main = Blueprint('main', __name__)

@main.route("/", methods=['POST'])
def upload_images():
    try:
        form_data = request.form.get('images')

        # TODO: also figure out how to send the image back once the image is dithered  
            # would an await statement literally just   wait until the response is sent   that makes sense right

        data = []

        if not form_data:
            return jsonify({'error': 'Invalid upload'}), 400
        else:
            data : list[dict] = loads(form_data)
            print(data[0].get('filename'))

        for image in data:
            header_length = len("data:image/png;base64,")
            image_data = b64decode(image.get("src")[header_length:])
            decoded_image = Image.open(BytesIO(image_data))

            uploaded_image = UploadedImage(
                image_id=image.get('id'),
                file_name=image.get('fileName'),
                src=decoded_image,
                dither=image.get('dither'),
                dithered_image=image.get('ditheredImage')
            )
            uploaded_images.push(uploaded_image)

        return jsonify({"hi": "bye"}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@main.route("/", methods=['GET'])
def get_images():
    return jsonify(uploaded_images.to_dict_list()), 200

@main.route("/images", methods=['GET'])
def dither_images():
    dithered_images = []

    for image in uploaded_images.images:
        if image.dither:
            dithered_image = floyd_steinberg(image)
            dithered_images.append(dithered_image)
    
    return jsonify(dithered_images), 200