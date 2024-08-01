import { ReducerAction, useCallback, useReducer } from "react";

interface UploadedImage {
    img: ImageBitmap;
    dither: boolean;
}

function imgReducer(state: any, action: any) {
    switch (action.type) {
        case "DROP_FILES": {
            const dragEvent = action.data as DragEvent;
            const dt = dragEvent.dataTransfer;
            const files = dt!.files;

            return files;
        }
        case "UPLOAD_FILES": {
            [...(action.files as FileList)].forEach((file) => {
                let formData = new FormData();

                formData.append("file", file);

                fetch(url, {
                    method: "POST",
                    body: formData,
                })
                    .then(() => {
                        /* Done. Inform the user */
                    })
                    .catch(() => {
                        /* Error. Inform the user */
                    });
            });
        }
    }
}

export default function useUploadedFiles(initialFiles: any) {
    const [imgState, dispatch] = useReducer(imgReducer, {
        ...initialFiles,
    });

    const uploadHandler = useCallback((files: FileList) => {
        dispatch({
            type: "UPLOAD_FILES",
            files: files,
        });
    });

    const dropHandler = useCallback((data: DragEvent) => {
        dispatch({
            type: "DROP_FILES",
            data: data,
        });
        dispatch({
            type: "UPLOAD_FILES",
        });
    }, []);
}
