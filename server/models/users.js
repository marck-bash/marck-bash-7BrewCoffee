import { Schema, model } from "mongoose";

const userSchema = new Schema({
    employeeID: String,
    createdBy: String,
    password: {
        type: String,
        required: true
    },
    firstName: String,
    middleName: String,
    lastName: String,
    role: {
        type: String,
        required: true
    },
    storeLocation: String,
    brewistas: Array,
    email: {
        type: String,
        required: true
    }
});

export default model("User", userSchema);