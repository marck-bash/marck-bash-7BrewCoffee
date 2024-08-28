import { Schema, model } from "mongoose"

const recipeSchema = new Schema ({
    name: {
        type: String,
        required: true
    }, 
    ingredients: {
        type: Array,
        required: true
    },
    directions: {
        type: String,
        required: true
    }
});

export default model("Recipe", recipeSchema)
