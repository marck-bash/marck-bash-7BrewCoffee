import { useLoaderData } from "react-router-dom";
import PDF_Uploader from "./PDF-Uploader";
import { useState } from "react";
import PDF_Viewer from "./PDF-Viewer";

export async function dailyNewsLoader() {
    const pdfResponse = await fetch("http://localhost:3000/pdf");
    const pdfBody = await pdfResponse.json();
    return pdfBody.data;
}

export default function DailyNews() {
    const pdfBody = useLoaderData();
    const [pdfName, setPdfName] = useState(pdfBody[0].pdf);

    return (
        <div className="flex flex-col items-center m-6">
            {/* <PDF_Uploader /> */}
            <PDF_Viewer pdfName={pdfName} />
        </div>
    )
}