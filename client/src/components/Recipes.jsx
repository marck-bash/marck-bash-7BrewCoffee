import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Recipes() {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [directions, setDirections] = useState("");
  // const navigate = useNavigate();

  async function newRecipe(event) {
    event.preventDefault(); //stop page from refreshing on submit
    //sending username and password to backend
    alert("Recipe has been added to database")
    const response = await fetch("http://localhost:3000/newRecipe", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        ingredients,
        directions
      }),
    });
    console.log(response)
    const body = await response.json();
    if (response.status === 200) {
      console.log(" recipe Test 2")
      console.log(body);
      // alert("Recipe has been added to database")
      // navigate("/allRecipes");
      
    } else {
      console.log(body.response);
    }
  }
  return (
    <form
      name="newRecipe"
      onSubmit={newRecipe}
      className="flex flex-col items-center"
    >
      <label className="flex form-control items-center justify-center p-2 m-2 gap-3">
        <span>Please enter name of new recipe</span>
        <input
          type="text"
          placeholder="Name"
          className=" input input-bordered w-full max-w-xs text-3xl"
          onChange={(e) => setName(e.target.value)}
        ></input>
        <span>Please enter ingredients of new recipe</span>
        <input
          type="text"
          placeholder="Ingredients"
          className=" input input-bordered w-full max-w-xs text-3xl"
          onChange={(e) => setIngredients(e.target.value)}
        ></input>
        <span>Please enter directions for preparing new recipe</span>
        {/* <input
          type="text"
          className=" textarea textarea-bordered text-3xl"
          placeholder="Directions"
          onChange={(e) => setDirections(e.target.value)}
        ></input> */}
        <textarea
          type="text"
          className=" textarea textarea-bordered w-full max-w-xs text-3xl"
          placeholder="Directions"
          onChange={(e) => setDirections(e.target.value)}
        ></textarea>
        <button className="btn btn-wide btn-primary m-3 text-2xl" type="submit">
          Submit
        </button>
        <NavLink className="btn btn-primary hover:bg-neutral hover:text-accent m-1" to={"/allRecipes"} end>View All Recipes</NavLink>
      </label>
    </form>
  );
}

export default Recipes;
