from flask import Blueprint, jsonify, request

main = Blueprint('main', __name__)

@main.route("/", methods=['POST'])
def dither_images():
    data = request.get_json()