import { Schema, model } from "mongoose";

const pdfDetailsSchema = new Schema({
    pdf: {
        type: String,
        required: true
    },
    date: {
        type: "Date",
        default: Date.now,
        required: true
    }
}, {collection: "pdfdetails"});

export default model("PdfDetails", pdfDetailsSchema);