import { nanoid } from "nanoid";
import { useCallback, useReducer } from "react";

export interface UploadedImage {
    id: string;
    fileName: string;
    src: string;
    dither: boolean;
    ditheredImage: File | undefined;
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

type ditherHandlerType = () => void;

type UploadedFilesHookReturn = [UploadedImage[], uploadHandlerType, selectHandlerType, ditherHandlerType];

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

function handleFile(file: File) {
    const formData = new FormData(); // TODO: potentially not even needed with my current object interface

    formData.append("file", file);

    const image: UploadedImage = {
        id: nanoid(),
        fileName: file.name,
        src: "",
        dither: true,
        ditheredImage: undefined,
    };

    console.log(image);

    return image;

    // fetch(url, {
    //     method: "POST",
    //     body: formData,
    // })
    //     .then(() => {
    //         /* Done. Inform the user */
    //     })
    //     .catch(() => {
    //         /* Error. Inform the user */
    //     });
    // Used with backend to upload files to server
}

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
        case "DITHER_FILES": {
            const ditherState = state as UploadedImage[];
            for (const image of ditherState) {
                console.log(image.dither);
            }
            return state;
        }
        default: {
            return state;
        }
    }
}

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

    const ditherHandler = useCallback(() => {
        dispatch({
            type: "DITHER_FILES",
        });
    }, []);

    return [imgState, uploadHandler, selectHandler, ditherHandler] as UploadedFilesHookReturn;
    // TODO: create const ditherHandler = useCallback(); // this function should accept the list of images as from uploadHandler and add the dithered images to imageState in the ditheredImage key
}
