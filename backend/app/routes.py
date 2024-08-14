from flask import Blueprint, jsonify, request
from io import BytesIO
from json import loads
from base64 import b64decode, b64encode
from PIL import Image

from .models import UploadedImage, UploadedImageList
from .utils.floydsteinberg import floyd_steinberg

uploaded_images = UploadedImageList([])

main = Blueprint('main', __name__)

"""Uploading images TODO
 - Accepts 
"""
@main.route("/", methods=['POST'])
def upload_images():
    try:
        form_data = request.form.get('images')

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

        return jsonify({"upload": "Succesful"}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@main.route("/", methods=['GET'])
def get_images():
    return jsonify(uploaded_images.to_dict_list()), 200

@main.route("/images", methods=['GET'])
def dither_images():
    dithered_images = []

    if len(uploaded_images.images) == 0:
        return jsonify({"error": "No images to dither"}), 500

    for image in uploaded_images.images:
        if image.dither:
            # apply dithering algorithm
            dithered_image = floyd_steinberg(image.src)
            
            # save image to in-memory file and encode it into a base-64 string
            mem_file = BytesIO()
            dithered_image.save(mem_file, format="PNG")
            data_url_bytes = b64encode(mem_file.getvalue())
            data_url_str = data_url_bytes.decode('utf-8')
            data_url = f"data:image/png;base64,{data_url_str}"

            dithered_image_json = {
                "name": f"{image.file_name.split('.')[0]}_dither_fs",
                "data": data_url,
            }

            dithered_images.append(dithered_image_json)
    
    return jsonify(dithered_images), 201