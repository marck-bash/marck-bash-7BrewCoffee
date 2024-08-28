import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function DeleteRecipeButton({ recipe }) {
    const [deleteId, setDeleteId] = useState("");
    async function deleteRecipe() {
      
      

      if(deleteId === "DELETE") {
      //fetch request from our endpoint
        const response = await fetch(`http://localhost:3000/allRecipes/${recipe._id}`, {
          method: "DELETE",
          headers: {
            "content-type" : "application/json",
            "authorization": localStorage.getItem("jwt-token")
          },
          body: null
        });
        
        const body = await response.json();
      
        if(response.status === 200) {
          console.log("Recipe has been deleted");
        } else {
          console.log(body.message);
        }
        
        //refreshes the page when the form is submitted
        location.reload();
        
      } else {
        console.log("To delete a Recipe please type: DELETE")
      }
    };
    
    function closeModal() {
      document.getElementById(recipe._id+"delete").close();
    }
  
  return (
    <>
      <button
        className="btn bg-primary"
        onClick={() => document.getElementById(recipe._id+"delete").showModal()}
      >
        Delete
      </button>
      <dialog id={recipe._id+"delete"} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Delete {recipe.name} {recipe.ingredients} {recipe.directions}</h3>
          <div className='flex flex-col justify-center items-center'>
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>✕</button>
          <form method="dialog" className='flex flex-col items-center' onSubmit={deleteRecipe}>
            <label className='font-bold'>Type DELETE to confirm your deletion:</label>
            <input placeholder='DELETE' className='border-2 border-secondary' onChange={(e) => setDeleteId(e.target.value)}></input>
            {/* if there is a button in form, it will close the modal */}
            <button type='submit' className='btn btn-primary mt-4'>DELETE</button>
          </form>
          <p className="py-4">Press ESC key or click on ✕ button to close</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
