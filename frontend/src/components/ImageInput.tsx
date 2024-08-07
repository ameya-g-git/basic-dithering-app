import { selectHandlerType, UploadedImage } from "../hooks/useUploadedFiles";

interface ImageInputType {
    id: string;
    formId: string;
    image: UploadedImage;
    onChange: selectHandlerType;
}

export default function ImageInput({ id, formId, image, onChange }: ImageInputType) {
    return (
        <div className="flex flex-col items-center w-full" id={`${image.fileName}-${id}`}>
            <h3 className="font-bold">{image.fileName}</h3>

            <img className="w-auto max-h-full p-4" src={image.src} alt={image.fileName} />

            <label htmlFor={id}>want to dither this image?</label>
            <select
                value={image.dither ? "Y" : "N"}
                onChange={(e) => {
                    onChange(id, e.target.value === "Y");
                }}
                className=""
                form={formId}
                id={id}
            >
                <option value="Y">dither it!</option>
                <option value="N">don't dither it.</option>
            </select>
        </div>
    );
}
