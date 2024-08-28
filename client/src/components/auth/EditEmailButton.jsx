import React from 'react'

export default function EditEmailButton({ user }) {
    
    async function editUser(event) {
        
        //create a variable that holds our data recieved from Form Data (event.target."name".value) in an object
        const data = new FormData(event.target);
    
        //create a new object so we may use it in the for loop below to only enter valid data into our object
        let dataObj = {};
    
        //This for of loop validates the data being entered into our request.body by checking for empty strings and
        // preventing them from being entered into the object being used for the body in our fetch request
        for (let [key, value] of data.entries()) {
          if (value.trim() !== "") {
            dataObj[key] = value.trim().toLowerCase();
          }
        }
        
        //check to see if the email stored in the dataObj is a valid email address
        const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let email = dataObj.email
        
        if (email === undefined) {
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
        } else if (regexEmail.test(email)) {
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
            } else {
                alert("Please enter a valid Email Address")
                }
        //refreshes the page when the form is submitted
        location.reload();
    }
      
    //function to handle closing the Modal, added as an onClick event handler in our HTML
    function closeModal() {
        document.getElementById(user._id + "editProfileEmail").close();
    }
    
  return (
    <>
    <div>
        <button className="btn bg-primary" onClick={()=>document.getElementById(user._id + "editProfileEmail").showModal()}>Edit</button>
        <dialog id={user._id + "editProfileEmail"} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Edit Email</h3>
                <div className="flex flex-col justify-center items-center">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>✕</button>
                    <form method="dialog" onSubmit={editUser} className="flex flex-col">
                        <label>
                            <div className="text-neutral">Email:</div>
                            <input className="border-2 border-secondary w-full" placeholder="Email" name="email"></input>
                        </label>
                        {/* if there is a button in form, it will close the modal */}
                        <button type="submit" className="btn btn-primary mt-4">Submit</button>
                    </form>
                    <p className="py-4">Submit your edit, or click the X to close</p>
                </div>
            </div>
        </dialog>
    </div>
    </>
  )
}
