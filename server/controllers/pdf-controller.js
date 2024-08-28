import { Router } from "express";
import "dotenv/config";
import multer from "multer";
import fs, { unlink } from "fs";
import PdfDetails from "../models/pdfDetails.js";

const router = Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './pdfs')
    },
    filename: function (req, file, cb) {
      const uniquePrefix = Date.now()
      cb(null, uniquePrefix+"_"+file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

// upload pdf to database
router.post("/pdf/upload", upload.single("file"), async (request, response) => {
    try {
        const fileName = request.file.filename;
        // delete old file from folder
        const currentFiles = fs.readdirSync("./pdfs/");
        currentFiles.forEach(async (file) => {
            if(file !== fileName) {
                console.log("deleting old file")
                unlink(`./pdfs/${file}`, (err) => {
                    if(err) console.log(err, "file does not exists");
                    console.log("file was removed")
                })
                // delete old file details from database
                await PdfDetails.deleteOne({ pdf: file });
            }
        });

        console.log("starting upload of pdf")

        const pdf = new PdfDetails({ pdf: fileName });
        await pdf.save();

        response.send({ 
            message: "Pdf successfully uploaded to database."
        });
    }
    catch(err) {
        response.status(500).send({
            message: err.message
        });
    }
});

// get single pdf file from database
router.get("/pdf", async (request, response) => {
    try {
        const pdf = await PdfDetails.find({});
        
        response.send({
            message: "Success",
            data: pdf
        })
    }
    catch(err) {
        response.status(500).send({
            message: err.message
        });
    }
});

export default router;