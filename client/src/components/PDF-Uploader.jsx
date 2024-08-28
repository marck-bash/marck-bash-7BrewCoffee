import { useState } from "react"

export default function PDF_Uploader() {
    const [file, setFile] = useState("");

    async function uploadPdf(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://localhost:3000/pdf/upload", {
            method: "POST",
            headers: { 
                authorization: localStorage.getItem("jwt-token") 
            },
            body: formData
        });
        const body = await response.json();

        if(!response.ok) {
            console.error(body.message);
            return;
        }
    }

    return (
        <form className="flex gap-3" onSubmit={uploadPdf}>
            <input
                type="file" 
                name="file"
                className="file-input file-input-bordered w-full max-w-xs"
                accept="application/pdf"
                onChange={(event) => setFile(event.target.files[0])}
            ></input>
            <button type="submit" className="btn btn-primary">Upload</button>
        </form>
    )
}