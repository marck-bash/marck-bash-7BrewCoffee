import { Schema, model } from "mongoose";

const permissionSchema = new Schema({
    role: String,
    uploadToAnnouncement: Boolean,
    addNewUser: Boolean,
    viewTestScores: Boolean,
    downloadCSV: Boolean,
    addEditRecipes: Boolean,
    addEditFlashCards: Boolean,
    addEditTests: Boolean
});

export default model("Permission", permissionSchema);