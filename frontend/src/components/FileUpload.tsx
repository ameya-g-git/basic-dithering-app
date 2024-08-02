import { useState } from "react";
import upload from "../assets/upload.png";
import clsx from "clsx";

export default function FileUpload() {
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

    return (
        <div className="flex flex-col items-stretch w-full h-screen">
            <div
                id="drag-area"
                className={dragAreaStyles}
                onDragEnter={(e) => dragOverHandler(e as unknown as DragEvent)}
                onDragOver={(e) => dragOverHandler(e as unknown as DragEvent)}
                onDragLeave={(e) => dragLeaveHandler(e as unknown as DragEvent)}
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
                            // onChange={handleFiles(this.files)}
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
