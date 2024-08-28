import React from "react";

//list prop contains the data we fetched from our get request in "ViewAllUsers.jsx"
export default function EditUserButton({ list }) {
  async function submitUserEdit(event) {
    
    //create a variable that holds our data recieved from Form Data (event.target."name".value) in an object
    const data = new FormData(event.target);
    
    //create a new object so we may use it in the for loop below to only enter valid data into our object
    let dataObj = {}
    
    //!TODO: If user sends in data that already exists it will still send it to the database (this shouldn't be happen ideally)
    
    //variable to check to see if the email stored in the dataObj is a valid email address
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let email = dataObj.email
    
    //This for of loop validates the data being entered into our request.body by checking for empty strings and
    // preventing them from being entered into the object being used for the body in our fetch request
    for (let [key, value] of data.entries())
      {
        if (value.trim() !== ''){
          //add emails to dataObj if they are valid, trim them and send them to lowercase
          if (regexEmail.test(value)) {
            dataObj[key] = value.trim().toLowerCase();
          } else {
          //add all other data to dataObj with trimmed white space
            dataObj[key] = value.trim();
          }
        };
      }
    
    //fetch request for our edit endpoint
    //fetches if the email is 'undefined' (in the case of no email field being edited)
    if (email === undefined) {
      const response = await fetch(`http://localhost:3000/allusers/${list._id}`, {
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
    //or if the email entered passes the validation check for valid email addresses
    } else if (regexEmail.test(email)) {
      const response = await fetch(`http://localhost:3000/allusers/${list._id}`, {
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
    document.getElementById(list._id + "edit").close();
  }

  return (
    <>
      <button
        className="btn bg-primary"
        onClick={() => document.getElementById(list._id + "edit").showModal()}
      >
        Edit
      </button>
      <dialog id={list._id + "edit"} className="modal" list={list}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            Edit {list.firstName} {list.lastName}
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
              onSubmit={submitUserEdit}
            >
              <div className="flex items-center gap-2">
                <label>
                  <div className="text-neutral">First Name:</div>
                  <input
                    className="border-2 border-secondary w-full"
                    placeholder="First Name"
                    name="firstName"
                  ></input>
                </label>
                <label>
                  <div className="text-neutral">Middle Name:</div>
                  <input
                    className="border-2 border-secondary w-full"
                    placeholder="Middle Name"
                    name="middleName"
                  ></input>
                </label>
                <label>
                  <div className="text-neutral">Last Name:</div>
                  <input
                    className="border-2 border-secondary w-full"
                    placeholder="Last Name"
                    name="lastName"
                  ></input>
                </label>
              </div>
              <label>
                <div className="text-neutral">Email:</div>
                <input
                  className="border-2 border-secondary w-full"
                  placeholder="Email"
                  name="email"
                ></input>
              </label>
              <label>
                <div className="text-neutral">Store Location:</div>
                <input
                  className="border-2 border-secondary w-full"
                  placeholder="Store Location"
                  name="storeLocation"
                ></input>
              </label>
              <label>
                <div className="text-left text-neutral">Role:</div>
                <select
                  className="bg-primary text-neutral w-full border-2 border-secondary"
                  name="role"
                >
                  <option value="">Please choose an option</option>
                  <option>Admin</option>
                  <option>Regional Manager</option>
                  <option>Manager</option>
                  <option>Shift Leader</option>
                  <option>Brewista</option>
                </select>
              </label>
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
