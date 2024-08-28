import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import Grid from "gridfs-stream";
import userRouter from "./controllers/user.controller.js";
import flashcardRouter from "./controllers/flashcards.js";
import quizRouter from "./controllers/quizzes.js";
import recipeRouter from "./controllers/recipe.controller.js"
import pdfRouter from "./controllers/pdf-controller.js";

//creating variables
const app = express();
const PORT = process.env.SERVER_PORT;
const MONGO = process.env.MONGODB;

//connecting to database
mongoose.connect(`${MONGO}`);

//creating database variable
const db = mongoose.connection;

// middleware
app.use(express.json());
app.use(cors());
app.use("/pdfs", express.static("pdfs"));
//routes being used
app.use("/", userRouter);
app.use("/", flashcardRouter);
app.use("/", quizRouter);
app.use("/", recipeRouter);
app.use("/", pdfRouter)

export let gfs;
export let gridFsBucket;

//printing to the console when connection is established
db.once('open', () => {
    gridFsBucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });
    gfs = Grid(db, mongoose.mongo);
    gfs.collection("pdfdetails");
    console.log(`connected to Mongo Atlas DB`)
});

//printing to the console what port is being used
app.listen(PORT, () => { console.log(`listening on port: ${PORT}`) })