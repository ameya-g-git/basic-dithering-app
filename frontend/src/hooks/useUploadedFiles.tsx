import { ReducerAction, useCallback, useReducer } from "react";

interface UploadedImage {
    img: ImageBitmap;
    dither: boolean;
}

function imgReducer(state: any, action: any) {
    switch (action.type) {
        case "UPLOAD_FILES": {
            [...(action.files as FileList)].forEach((file) => {
                const formData = new FormData();

                formData.append("file", file);

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
        }
    }
}

export default function useUploadedFiles(initialFiles: any) {
    const [imgState, dispatch] = useReducer(imgReducer, { ...initialFiles });

    // imgState:
    // [
    //     {
    //         file: File,
    //         dither: Boolean,
    //         ditheredFile: File || undefined,
    //     },
    //     ...
    // ];

    const uploadHandler = useCallback((files?: FileList, data?: DragEvent) => {
        dispatch({
            type: "UPLOAD_FILES",
            files: files,
        });
    }, []);

    // TODO: handle converting drag uploads into FileLists   its too convoluted to try and handle this all in this module + i think i could also honestly just define it in its own file as well
    // TODO: create const ditherHandler = useCallback(); // this function should accept the list of images as from uploadHandler and add the dithered images to imageState in the ditheredImage key
}
