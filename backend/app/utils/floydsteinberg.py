from PIL import Image
import numpy as np

def floyd_steinberg(image : Image):
    image_array = np.array(image)

    return image_array.shape