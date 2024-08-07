import { useCallback, useState } from "react";
import upload from "../assets/upload.png";
import clsx from "clsx";

interface FileUploadType {
    onUpload: (files: FileList) => void;
    className: string;
}

export default function FileUpload({ onUpload, className }: FileUploadType) {
    const [isDraggedOver, setIsDraggedOver] = useState(false);

    // TODO: create a little modal for when the file size is too big, don't push it to imgState either

    const dragAreaStyles = clsx({
        "transition-all flex flex-col bg-white items-center justify-center gap-2 border-2 border-dashed rounded-3xl h-full border-slate-700":
            true,
        "brightness-75": isDraggedOver,
    });

    function dragOverHandler(e: DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggedOver(true);
    }

    function dragLeaveHandler(e: DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggedOver(false);
    }

    const dropHandler = useCallback(
        (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const dt = e.dataTransfer;
            const files = dt!.files;
            if (files.length > 0) {
                onUpload(files);
            } else {
                console.error("Error in uploading file, try uploading a file saved on your computer");
            }
        },
        [onUpload]
    );

    return (
        <div className={`flex flex-col items-stretch w-full ${className}`}>
            <div
                id="drag-area"
                className={dragAreaStyles}
                onDragEnter={(e) => dragOverHandler(e as unknown as DragEvent)}
                onDragOver={(e) => dragOverHandler(e as unknown as DragEvent)}
                onDragLeave={(e) => dragLeaveHandler(e as unknown as DragEvent)}
                onDrop={(e) => {
                    dragLeaveHandler(e as unknown as DragEvent);
                    dropHandler(e as unknown as DragEvent);
                }}
            >
                <img src={upload} alt="upload" className="w-32 -m-4" />
                <span className="flex flex-col *:-m-1 items-center">
                    <h2>Upload your file!</h2>
                    <h2>
                        or{" "}
                        <input
                            type="file"
                            id="fileElem"
                            multiple
                            accept="image/*"
                            hidden
                            onChange={(e) => onUpload(e.target.files as FileList)}
                        />
                        <label htmlFor="fileElem" className="font-bold text-blue-500 underline cursor-pointer">
                            browse!
                        </label>
                    </h2>
                </span>

                <h3 className="text-slate-400">(supports JPEG, JPG, PNG!)</h3>
            </div>
        </div>
    );
}
