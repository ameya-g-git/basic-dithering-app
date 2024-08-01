import FileUpload from "./components/FileUpload";
import "./output.css";

function App() {
    return (
        <main className="flex flex-col items-center w-full gap-4 p-8">
            <h1 className="font-bold">basic-dithering-app</h1>
            <FileUpload />
        </main>
    );
}

export default App;
