import FileUpload from "./components/FileUpload";
import useUploadedFiles from "./hooks/useUploadedFiles";
import "./output.css";
import ImageInput from "./components/ImageInput";

function App() {
    const [imgState, uploadHandler, selectHandler, ditherHandler] = useUploadedFiles([]);

    return (
        <main className="flex flex-col items-center w-full gap-4 p-8">
            <h1 className="font-bold">basic-dithering-app</h1>
            <FileUpload className="h-[50vh]" onUpload={uploadHandler} />
            {imgState.length > 0 && (
                <form className="flex flex-col items-center h-2/5" id="dither-form">
                    <div className="flex flex-row justify-between w-full gap-4 mb-8">
                        {imgState.map((image) => (
                            <ImageInput
                                key={image.id}
                                id={image.id}
                                formId="dither-form"
                                image={image}
                                onChange={selectHandler}
                            />
                        ))}
                    </div>
                    <button
                        formAction="submit"
                        className="w-full h-12 text-white bg-black rounded-lg"
                        onClick={(e) => {
                            e.preventDefault();
                            imgState.map((img) => console.log(img.dither));
                        }}
                    >
                        SUBMIT
                    </button>
                </form>
            )}
        </main>
    );
}
export default App;
