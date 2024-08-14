import { nanoid } from "nanoid";
import { useCallback, useReducer } from "react";

/**
 * @typedef UploadedImage
 *
 * @property {string} id | The id of the image, used for making form state updates easier
 * @property {string} fileName | The filename of the image
 * @property {string} src | The data URL of the image
 * @property {boolean} dither | A boolean determining whether or not the image is dithered (i.e. sent to the backend)
 */
export interface UploadedImage {
    id: string;
    fileName: string;
    src: string;
    dither: boolean;
}

interface Action {
    type: string;
}

interface UploadAction extends Action {
    files: FileList;
    src: string[];
}

interface SelectAction extends Action {
    id: string;
    value: boolean;
}

interface DitherAction extends Action {}

type uploadHandlerType = (files: FileList) => void;

export type selectHandlerType = (id: string, value: boolean) => void;

type UploadedFilesHookReturn = [UploadedImage[], uploadHandlerType, selectHandlerType];

/**
 * Reads an inputted files data URL. Adapted from Joseph Zimmerman's drag-and-drop uploader linked below:
 * https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/#additional-features
 * @param file
 * @returns Promise containing the data URL
 */
async function previewFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            if (typeof this.result === "string") {
                resolve(this.result);
            } else {
                reject(new Error("Failed to read file."));
            }
        };
        reader.onerror = function () {
            reject(new Error("Error reading file"));
        };
    });
}

/**
 * Converts an uploaded File to an easily parseable object with pertinent details for the app
 * @param file
 * @returns {UploadedImage}
 */
function handleFile(file: File) {
    const image: UploadedImage = {
        id: nanoid(),
        fileName: file.name,
        src: "",
        dither: true,
    };

    return image;
}

/**
 * The main reducer function, containing all of the logic for updating imgState, such as an image upload handler and a form data handler
 * @param state | The current state before updates arrive
 * @param action | The action defined by a given dispatch() call
 * @returns {UploadedImage[]} | The updated state after the reducer call finishes
 */
function imgReducer(state: UploadedImage[] | undefined, action: UploadAction | DitherAction | SelectAction) {
    switch (action.type) {
        case "UPLOAD_FILES": {
            const uploadState = state as UploadedImage[];
            const uploadAction = action as UploadAction;
            const fileList: UploadedImage[] = [];

            [...uploadAction.files].forEach((file, i) => {
                const image = handleFile(file);
                image.src = uploadAction.src[i];
                fileList.push(image);
            });

            return [...uploadState, ...fileList];
        }
        case "SELECT_DITHER": {
            const selectAction = action as SelectAction;
            const imageIndex = state!.findIndex((img) => img.id === selectAction.id);
            const newState = state ? [...state] : [];
            newState[imageIndex] = {
                ...newState[imageIndex],
                dither: selectAction.value,
            };

            return newState;
        }
        default: {
            return state;
        }
    }
}

/**
 * The main hook function, returning helper functions that make updating this complex state object easier
 * @param initialImages | The initial state of images
 * @returns {UploadedFilesHookReturn} | A list of handler functions for the hook to function
 */
export default function useUploadedFiles(initialImages: UploadedImage[]) {
    const [imgState, dispatch] = useReducer(imgReducer, [...initialImages]);

    const uploadHandler = useCallback((files: FileList) => {
        const srcPromises = Array.from(files).map(previewFile);

        Promise.all(srcPromises)
            .then((srcList) => {
                dispatch({
                    type: "UPLOAD_FILES",
                    files: files,
                    src: srcList,
                });
            })
            .catch((error) => console.error("Error uploading files", error));
    }, []);

    const selectHandler = useCallback((id: string, value: boolean) => {
        dispatch({
            type: "SELECT_DITHER",
            id,
            value,
        });
    }, []);

    return [imgState, uploadHandler, selectHandler] as UploadedFilesHookReturn;
}
