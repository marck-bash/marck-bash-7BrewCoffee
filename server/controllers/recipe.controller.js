import { Router, response } from "express"
import Recipe from "../models/recipes.js"
import adminPermissionMiddleware from "../middleware/permissionsMiddleware.js";
import validationMiddleware from "../middleware/validationMiddleware.js";
const router = Router()

//adds new recipe
router.post("/newRecipe", async (request, response) => {
    try {
        const doesRecipeExist = await Recipe.exists({
            name: request.body.name
        });
        if (doesRecipeExist === null) {
            const recipe = new Recipe({
                name: request.body.name,
                ingredients: request.body.ingredients,
                directions: request.body.directions
            });
            console.log("New recipe was added!")
            await recipe.save()
            console.log("recipe test 1")
        } else {
            response.send("Recipe already exists, please pick a different name.")
        }
    } catch (error) {
        response.status(500).send({
            message: error.message
        });
    }
});

//displays all recipes
router.get("/allRecipes", async (request, response) => {
    try {
        const allRecipes = await Recipe.find();
        response.send(allRecipes);
    } catch (error) {
        response.status(500).send({
            message: error.message
        });
    }
});

//edit recipes
router.put("/editRecipe/:_id", validationMiddleware, adminPermissionMiddleware, async (request, response) => {

try {
    const doesRecipeExist = await Recipe.findById(
        request.params._id
    );
    const filter = { _id: request.params._id };
    const update = request.body;
    if (!!doesRecipeExist === null) {
        const editRecipe = await Recipe.findOneAndUpdate(filter, update, {new: true})
        response.send(editRecipe)
    } else if (doesRecipeExist._id.toString() === filter._id.toString()) {
        const update = request.body;
        const editRecipe = await Recipe.findByIdAndUpdate(request.params._id, update, {new: true})
        response.send(editRecipe)
    } else {
        response.status(500).send({
            message: "Recipe name already exists"
        })
    }
} catch (error) {
    response.status(500).send({
        message: error.message
    });
}
})

//delete recipes
router.delete("/allRecipes/:_id", validationMiddleware, adminPermissionMiddleware, async (request, response) => {
    try {
        let deletedRecipe = await Recipe.deleteOne({_id: request.params._id});
        console.log(deletedRecipe);
        response.send(deletedRecipe);
    } catch (error) {
        response.status(500).send({
            message: error.message
        });
    }
});

export default router;
