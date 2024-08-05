import { debounce } from "lodash";
import { nanoid } from "nanoid";
import { act, ReactElement, useCallback, useReducer } from "react";

interface UploadedImage {
    id: string;
    img: File;
    srcElem: ReactElement | undefined;
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

type UploadedFilesHookReturn = [
    UploadedImage[],
    (files: FileList) => void,
    (id: string, value: boolean) => void,
    () => void
];

async function previewFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            if (typeof reader.result === "string") {
                resolve(reader.result);
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
        img: file,
        srcElem: undefined,
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

function imgReducer(
    state: UploadedImage[] | undefined,
    action: UploadAction | DitherAction | SelectAction
) {
    switch (action.type) {
        case "UPLOAD_FILES": {
            const uploadState = state as UploadedImage[];
            const uploadAction = action as UploadAction;
            const fileList: UploadedImage[] = [];

            [...uploadAction.files].forEach((file, i) => {
                const image = handleFile(file);
                console.log(uploadAction.src[i]);
                image.srcElem = (
                    <img src={uploadAction.src[i]} alt={file.name} />
                );
                console.log(image);
                fileList.push(image);
            });

            // TODO: for some reason, the asynchronous code is messing things up and causing imageState to be  fully empty
            // its strange though, since when i console.log(fileList), it shows a properly populated list with everything resolved
            // its only when setting the  state that it just stops working
            // will need to provide more context to gpt i guess since it's been providing solutions   but none of which have really worked

            return [...uploadState, ...fileList];
        }
        case "SELECT_DITHER": {
            const selectAction = action as SelectAction;
            const imageIndex = state!.findIndex(
                (img) => img.id === selectAction.id
            );
            const newState = state ? [...state] : [];
            newState[imageIndex] = {
                ...newState[imageIndex],
                dither: selectAction.value,
            };

            break;
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
        console.log(srcPromises);

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

    return [
        imgState,
        uploadHandler,
        selectHandler,
        ditherHandler,
    ] as UploadedFilesHookReturn;
    // TODO: handle converting drag uploads into FileLists   its too convoluted to try and handle this all in this module + i think i could also honestly just define it in its own file as well
    // TODO: create const ditherHandler = useCallback(); // this function should accept the list of images as from uploadHandler and add the dithered images to imageState in the ditheredImage key
}
