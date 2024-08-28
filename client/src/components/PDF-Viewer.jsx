import { Document, Page, pdfjs } from "react-pdf";
import { useState } from 'react';
import file from "../../../server/pdfs/1718660473697_7-brew_daily-news-1.pdf"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const options = {
    cMapUrl: "/cmaps/"
}

export default function PDF_Viewer({ pdfName }) {
    const [numPages, setNumPages] = useState();
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    console.log(pdfName)

    return (
        <div>
            <Document file={file} options={options} onLoadSuccess={onDocumentLoadSuccess}>
                <Page 
                    pageNumber={pageNumber}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                />
            </Document>
        </div>
    )
}