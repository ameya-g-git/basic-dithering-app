import { nanoid } from "nanoid";
import { useCallback, useReducer } from "react";

interface UploadedImage {
    id: string;
    img: File;
    dither: boolean;
    ditheredImage: File | undefined;
}

interface UploadAction {
    type: string;
    files: FileList;
}

function imgReducer(state: UploadedImage[] | undefined, action: UploadAction) {
    switch (action.type) {
        case "UPLOAD_FILES": {
            const fileList: UploadedImage[] = [];
            [...(action.files as FileList)].forEach((file) => {
                const formData = new FormData();

                formData.append("file", file);
                fileList.push({
                    id: nanoid(),
                    img: file,
                    dither: true,
                    ditheredImage: undefined,
                });

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
            });
            return [...state, ...fileList];
        }
    }
}

export default function useUploadedFiles(initialImages: UploadedImage[]) {
    const [imgState, dispatch] = useReducer(imgReducer, [...initialImages]);

    // imgState:
    // [
    //     {
    //         file: File,
    //         dither: Boolean,
    //         ditheredFile: File || undefined,
    //     },
    //     ...
    // ];

    const uploadHandler = useCallback((files: FileList) => {
        dispatch({
            type: "UPLOAD_FILES",
            files: files,
        });
    }, []);

    return [imgState, uploadHandler];
    // TODO: handle converting drag uploads into FileLists   its too convoluted to try and handle this all in this module + i think i could also honestly just define it in its own file as well
    // TODO: create const ditherHandler = useCallback(); // this function should accept the list of images as from uploadHandler and add the dithered images to imageState in the ditheredImage key
}
