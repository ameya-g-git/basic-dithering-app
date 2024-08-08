import FileUpload from "./components/FileUpload";
import useUploadedFiles from "./hooks/useUploadedFiles";
import "./output.css";
import ImageInput from "./components/ImageInput";
import axios from "axios";

function App() {
    const [imgState, uploadHandler, selectHandler] = useUploadedFiles([]);

    async function submitImages() {
        const formData = new FormData();

        formData.append("images", JSON.stringify(imgState));

        console.log(imgState);
        try {
            const response = await axios.post("/api", formData);

            if (response.status === 200 || response.status === 201) {
                console.log("Uploaded images to server");
            } else {
                console.error("Error:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // useEffect(() => {

    //     }
    // }, [imgState]);
    // Used with backend to upload files to server
    // for (const image of ditherState) {
    //     console.log(image.dither);
    // }
    // return state;

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
                        type="button"
                        className="w-full h-12 text-white bg-black rounded-lg"
                        onClick={(e) => {
                            e.preventDefault();
                            submitImages();
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
