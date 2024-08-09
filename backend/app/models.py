from PIL import Image

class UploadedImage:
    def __init__(self, image_id, file_name, src : Image, dither, dithered_image) -> None:
        self.image_id : str = image_id
        self.file_name : str = file_name
        self.src : Image = src
        self.dither : bool = dither
        self.dithered_image = dithered_image # TODO: add type for this ?? idk ??

    def to_dict(self):
        return {
            'image_id': self.image_id,
            'file_name': self.file_name,
            'src': [self.src.format, self.src.size] ,
            'dither': self.dither,
            'dithered_image': self.dithered_image,
        }
    
class UploadedImageList:
    def __init__(self, images : list[UploadedImage]) -> None:
        self.images = images
    
    def push(self, image : UploadedImage):
        self.images.append(image)
        return self.images

    def to_dict_list(self):
        image_list = []

        for image in self.images:
            image_list.append(image.to_dict())

        return image_list