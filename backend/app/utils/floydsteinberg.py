import numpy as np
from PIL import Image

"""
WEIGHT MATRIX
	X   7
3   5   1
	
	1/16
"""

def round_val(old_val, nc):
    """
    Get the "closest" colour to old_val in the range [0,1] per channel divided
    into nc values.

    """

    return np.round(old_val * (nc - 1)) / (nc - 1)

# For RGB images, the following might give better colour-matching.
#p = np.linspace(0, 1, nc)
#p = np.array(list(product(p,p,p)))
#def get_new_val(old_val):
#    idx = np.argmin(np.sum((old_val[None,:] - p)**2, axis=1))
#    return p[idx]

# TODO: ok so i still need to work on this implementation
    # do some more reading on how to do FS dithering with RGB just so i can adjust this implementation appropriately
# TODO: also  fetching b64 encoded images from the server  decoding them   and zipping them with JSZip or whatever

def floyd_steinberg(img : Image, nc : int):
    """
    Floyd-Steinberg dither the image img into a palette with nc colours per
    channel.

    """

    width, height = img.size
    fwd_arr = np.zeros(width) # TODO: the fwd array will likely need to change shape as well  shrimple stuff

    img_arr = np.array(img, dtype=float) / 255

    for ir in range(height):
        for ic in range(width):
            # NB need to copy here for RGB arrays otherwise err will be (0,0,0)!
            old_val = img_arr[ir, ic].copy()
            new_val = round_val(old_val, nc)

            img_arr[ir, ic] = new_val

            err = old_val - new_val

            if ic < width - 1:
                fwd_arr[ic] += (err >> 4) * 7
            if ir < height - 1:
                if ic > 0:
                    fwd_arr[ic] += (err >> 4) * 3
                fwd_arr[ir+1, ic] += (err >> 4) * 5
                if ic < width - 1:
                    fwd_arr[ir+1, ic+1] += (err >> 4) * 1
        
        img_arr[ir+1] += fwd_arr 

    carr = np.array(img_arr/np.max(img_arr, axis=(0,1)) * 255, dtype=np.uint8)
    return Image.fromarray(carr)


def palette_reduce(img, nc):
    """Simple palette reduction without dithering."""
    arr = np.array(img, dtype=float) / 255
    arr = round_val(arr, nc)

    carr = np.array(arr/np.max(arr) * 255, dtype=np.uint8)
    return Image.fromarray(carr)

# for nc in (2, 3, 4, 8, 16):
#     print('nc =', nc)
#     dim = fs_dither(img, nc)
#     dim.save('dimg-{}.jpg'.format(nc))
#     rim = palette_reduce(img, nc)
#     rim.save('rimg-{}.jpg'.format(nc))
