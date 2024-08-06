import { useCallback, useState } from "react";
import upload from "../assets/upload.png";
import clsx from "clsx";
import useUploadedFiles from "../hooks/useUploadedFiles";

export default function FileUpload({
    onUpload,
}: {
    onUpload: (files: FileList) => void;
}) {
    const [isDraggedOver, setIsDraggedOver] = useState(false);

    const dragAreaStyles = clsx({
        "transition-all flex flex-col bg-white items-center justify-center gap-2 border-2 border-dashed rounded-3xl h-3/5 border-slate-700":
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
            console.log(files);
            onUpload(files);
        },
        [onUpload]
    );

    return (
        <div className="flex flex-col items-stretch w-full h-screen">
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
                            onChange={(e) =>
                                onUpload(e.target.files as FileList)
                            }
                        />
                        <label
                            htmlFor="fileElem"
                            className="font-bold text-blue-500 underline cursor-pointer"
                        >
                            browse!
                        </label>
                    </h2>
                </span>

                <h3 className="text-slate-400">(supports JPEG, JPG, PNG!)</h3>
            </div>
        </div>
    );
}
