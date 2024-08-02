import { useState } from "react";
import FileUpload from "./components/FileUpload";
import useUploadedFiles from "./hooks/useUploadedFiles";
import "./output.css";

function App() {
    const [imgState, uploadHandler, selectHandler, ditherHandler] =
        useUploadedFiles([]);

    return (
        <main className="flex flex-col items-center w-full gap-4 p-8">
            <h1 className="font-bold">basic-dithering-app</h1>
            <FileUpload onUpload={uploadHandler} />
            {imgState.map((image) => image.srcElem)}
        </main>
    );
}

// TODO: create mini forms for each image when they're uploaded, allowing the user to choose whether or not they want the images dithered
// useUploadedFiles will need a function to handle the input from these forms, find which object in the imageState needs adjusting, and subsequently save the dithered file (or not) depending on preference in another key
// TODO: create custom input component that consists of image name, image preview, and dropdown / radio to choose whether should be dithered or not
// as an input changes, some handler function will find which object to adjust as a result (should i create nanoid's for each uploaded image? i think so just to make this easier)
// the submit button for this form will run ditherHandler
export default App;
