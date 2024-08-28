import React from "react";

//list prop contains the data we fetched from our get request in "ViewAllUsers.jsx"
export default function EditRecipeButton({ recipe }) {
  
  async function submitRecipeEdit(event) {
    
    //create a variable that holds our data recieved from Form Data (event.target."name".value) in an object
    const data = new FormData(event.target);
    
    //create a new object so we may use it in the for loop below to only enter valid data into our object
    let dataObj = {}
    
    //!TODO: If user sends in data that already exists it will still send it to the database (this shouldn't be happen ideally)
    
    //This for of loop validates the data being entered into our request.body by checking for empty strings and
    // preventing them from being entered into the object being used for the body in our fetch request
    for (let [key, value] of data.entries())
      {
        if (value.trim() !== ''){
          dataObj[key] = value.trim();
        };
      }
    

    //fetch request for our edit endpoint
    //fetches if the email is 'undefined' (in the case of no email field being edited)
      const response = await fetch(`http://localhost:3000/editRecipe/${recipe._id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          authorization: localStorage.getItem("jwt-token"),
        },
        body: JSON.stringify(dataObj),
      });
      
      const body = await response.json();

      if (response.status === 200) {
        console.log("Recipe has been updated");
      } else {
        console.log(body.message);
      }
    
    //refreshes the page when the form is submitted
    location.reload();
  }
  
  //function to handle closing the Modal, added as an onClick event handler in our HTML
  function closeModal() {
    document.getElementById(recipe._id + "edit").close();
  }

  return (
    <>
      <button
        className="btn bg-primary"
        onClick={() => document.getElementById(recipe._id + "edit").showModal()}
      >
        Edit
      </button>
      <dialog id={recipe._id + "edit"} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            Edit: {recipe.name}
          </h3>
          <div className="mb-0.5">Please edit only the fields you would like to be changed:</div>
          <div className="flex flex-col justify-center items-center">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
            <form
              method="dialog"
              className="flex flex-col"
              onSubmit={submitRecipeEdit}
            >
              <div className="flex items-center gap-2">
                <label>
                  <div className="text-black">Recipe Name:</div>
                  <input
                    className="border-2 border-secondary w-full"
                    placeholder="Recipe Name"
                    name="name"
                  ></input>
                </label>
                <label>
                  <div className="text-black"> Recipe Ingredients:</div>
                  <input
                    className="border-2 border-secondary w-full"
                    placeholder="Recipe Ingredients"
                    name="ingredients"
                  ></input>
                </label>
                <label>
                  <div className="text-black">Recipe Directions</div>
                  <input
                    className="border-2 border-secondary w-full"
                    placeholder="Recipe Directions"
                    name="directions"
                  ></input>
                </label>
              </div>
              {/* if there is a button in form, it will close the modal */}
              <button type="submit" className="btn btn-primary mt-4">
                Submit
              </button>
            </form>
            <p className="py-4">Submit your edit, or click the X to close</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
