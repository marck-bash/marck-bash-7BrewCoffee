import React from 'react'

export default function EditNameButton({ user }) {
    
    async function editUser(event) {
        //create a variable that holds our data recieved from Form Data (event.target."name".value) in an object
        const data = new FormData(event.target);
    
        //create a new object so we may use it in the for loop below to only enter valid data into our object
        let dataObj = {};
    
        //This for of loop validates the data being entered into our request.body by checking for empty strings and
        // preventing them from being entered into the object being used for the body in our fetch request
        for (let [key, value] of data.entries()) {
          if (value.trim() !== "") {
            dataObj[key] = value;
          }
        }
        
        const response = await fetch(`http://localhost:3000/edit/${user._id}`, {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            authorization: localStorage.getItem("jwt-token"),
          },
          body: JSON.stringify(dataObj),
        });
    
        const body = await response.json();
    
        if (response.status === 200) {
          console.log("User has been updated");
        } else {
          console.log(body.message);
        }
    
        //refreshes the page when the form is submitted
        location.reload();
    }
      
    //function to handle closing the Modal, added as an onClick event handler in our HTML
    function closeModal() {
        document.getElementById(user._id + "editProfileName").close();
    }
    
  return (
    <>
      <div>
        <button className="btn bg-primary" onClick={()=>document.getElementById(user._id + "editProfileName").showModal()}>Edit</button>
        <dialog id={user._id + "editProfileName"} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Edit Name</h3>
                <div className="flex flex-col justify-center items-center">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>✕</button>
                  <form method="dialog" onSubmit={editUser} className="flex flex-col">
                    <label>
                      <div className="text-neutral">First Name:</div>
                      <input className="border-2 border-secondary w-full" placeholder="First Name" name="firstName"></input>
                    </label>
                    <label>
                      <div className="text-neutral">Middle Name:</div>
                      <input className="border-2 border-secondary w-full" placeholder="Middle Name" name="middleName"></input>
                    </label>
                    <label>
                      <div className="text-neutral">Last Name:</div>
                      <input className="border-2 border-secondary w-full" placeholder="Last Name" name="lastName"></input>
                    </label>
                  {/* if there is a button in form, it will close the modal */}
                  <button type="submit" className="btn btn-primary mt-4">Submit</button>
                  </form>
                <p className="py-4">Submit your edit, or click on ✕ button to close</p>
                </div>
            </div>
        </dialog>
      </div>  
    </>
  )
}
