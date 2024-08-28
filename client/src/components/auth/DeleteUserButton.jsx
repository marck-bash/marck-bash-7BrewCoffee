import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function DeleteUserButton({ list }) {
    const [deleteId, setDeleteId] = useState("");
    
    async function deleteUser() {
      
      if(deleteId === "DELETE") {
      //fetch request from our endpoint
        const response = await fetch(`http://localhost:3000/allusers/${list._id}`, {
          method: "DELETE",
          headers: {
            "content-type" : "application/json",
            "authorization": localStorage.getItem("jwt-token")
          },
          body: null
        });
        
        const body = await response.json();
      
        if(response.status === 200) {
          console.log("User has been deleted");
        } else {
          console.log(body.message);
        }
        
        //refreshes the page when the form is submitted
        location.reload();
        
      } else {
        console.log("To delete a user please type: DELETE")
      }
    };
    
    function closeModal() {
      document.getElementById(list._id+"delete").close();
    }
  
  return (
    <>
      <button
        className="btn bg-primary"
        onClick={() => document.getElementById(list._id+"delete").showModal()}
      >
        Delete
      </button>
      <dialog id={list._id+"delete"} className="modal" list={list}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Delete {list.firstName} {list.lastName}</h3>
          <div className='flex flex-col justify-center items-center'>
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>✕</button>
          <form method="dialog" className='flex flex-col items-center' onSubmit={deleteUser}>
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
