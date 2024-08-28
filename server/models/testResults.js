import { Schema, model } from "mongoose";

const testResultSchema = new Schema({
    user: {
        type: "Object",
        required: true
    },
    date: {
        type: "Date",
        default: Date.now,
        required: true
    },
    quiz: {
        type: "Object",
        required: true
    },
    numCorrect: {
        type: "Number",
        required: true
    },
    numIncorrect: {
        type: "Number",
        required: true
    },
    questions: {
        type: ["Object"],
        required: true
    },
    score: {
        type: "Number",
        min: 0,
        max: 100,
        required: true
    }
});

export default model("TestResult", testResultSchema);
