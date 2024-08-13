import "./output.css";
import FileUpload from "./components/FileUpload";
import useUploadedFiles from "./hooks/useUploadedFiles";
import ImageInput from "./components/ImageInput";
import loadingSpinner from "./assets/loading-buffering.gif";
import { useEffect, useState } from "react";

import axios from "axios";
import JSZip from "jszip";
import moment from "moment";
import { saveAs } from "file-saver";

interface DitheredImage {
    name: string;
    data: string;
}

function App() {
    const [imgState, uploadHandler, selectHandler] = useUploadedFiles([]);
    const [loading, setLoading] = useState(false);
    const [ditheredImages, setDitheredImages] = useState<DitheredImage[]>([]);
    const [downloadButton, setDownloadButton] = useState(<></>);

    async function submitImages() {
        const formData = new FormData();

        formData.append("images", JSON.stringify(imgState));

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

        setLoading(true);
        const request = await axios
            .get<DitheredImage[]>("/api/images")
            .then((req) => setDitheredImages([...req.data]))
            .then(() => {
                setLoading(false);
            })
            .catch((e) => console.error(e));

        // TODO: add the GET from /images request here, create a <Loading /> component, hold it in a state value, and
        // once the request resolves, remove the loader, and append to a new state value the uploaded image previews
        // use JSZip to zip all the files together  and make the button a download as per  what online says
    }

    useEffect(() => {
        if (ditheredImages.length > 0) {
            const zip = JSZip();
            let zipUrl;

            for (const image of ditheredImages) {
                zip.file(`${image.name}.png`, image.data);
            }

            zip.generateAsync({ type: "blob" }).then((blob) => {
                setDownloadButton(
                    <button
                        onClick={(e) => {
                            saveAs(blob, `dithered-images-${moment().format("YYYYMMDD-HHmmss")}.zip`);
                        }}
                        className="w-full h-12 text-white bg-black rounded-lg"
                    >
                        DOWNLOAD
                    </button>
                );
            });
        }
    }, [ditheredImages]);

    // const zippedImages = () => {
    //     const zip = JSZip();
    //     let zipUrl = "";

    //     for (const image of ditheredImages) {
    //         zip.file(`${image.name}.png`, image.data, { base64: true });
    //     }
    //     zip.generateAsync({ type: "blob" }).then((blob) => {
    //         zipUrl = URL.createObjectURL(blob);
    //     });

    //     return (
    //         <button className="w-full h-12 text-white bg-black rounded-lg">
    //             <a href={zipUrl} download={`dithered-images-${moment().format("YYYYMMDD-HHmmss")}.zip`}>
    //                 DOWNLOAD
    //             </a>
    //         </button>
    //     );
    // };

    const uploadedImageElements = imgState.map((image) => (
        <ImageInput key={image.id} id={image.id} formId="dither-form" image={image} onChange={selectHandler} />
    ));

    const ditheredImageElements = ditheredImages.map((ditherImg, i) => (
        <div key={i} className="flex flex-col items-center justify-center" id={ditherImg.name}>
            <h2>{ditherImg.name}</h2>
            <img className="w-auto max-h-full p-4" src={ditherImg.data} alt={ditherImg.name} />
        </div>
    ));

    return (
        <main className="flex flex-col items-center w-full gap-4 p-8">
            <h1 className="font-bold">basic-dithering-app</h1>
            <FileUpload className="h-[50vh]" onUpload={uploadHandler} />
            {imgState.length > 0 && (
                <form className="flex flex-col items-center h-2/5" id="dither-form">
                    <div className="flex flex-row justify-between w-full gap-4 mb-8">{uploadedImageElements}</div>
                    {ditheredImages.length === 0 && (
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
                    )}
                </form>
            )}
            {loading && <img className="w-8" src={loadingSpinner} alt="loading" />}
            <div className="flex flex-row justify-between w-full gap-4 mb-8">{!loading && ditheredImageElements}</div>
            {downloadButton}
        </main>
    );
}
export default App;
