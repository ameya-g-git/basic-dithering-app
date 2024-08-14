import { selectHandlerType, UploadedImage } from "../hooks/useUploadedFiles";

interface ImageInputType {
    id: string;
    formId: string;
    image: UploadedImage;
    onChange: selectHandlerType;
}

/**
 * A component used to display an uploaded imaeg, along with inputtable settings for the image
 * @param id | A nanoid() applied to each UploadedImage object used to make updating the overall form state easier
 * @param formId | The id of the form that this component is nested within
 * @param image | (check useUploadedFiles.tsx for interface)
 *    An object containing details about an uploaded image, including the file's name, ID, data URL, and whether or not it is to be dithered
 * @param onChange | A handler function to adjust the overall form state once a form input is changed
 * @returns | The JSX that displays the component, showing a title, a preview of the image, and a dropdown to choose between dithering / not dithering
 */

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
