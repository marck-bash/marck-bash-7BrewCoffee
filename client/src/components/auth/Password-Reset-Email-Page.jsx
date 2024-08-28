import React from "react";
import Footer from "../Footer";
import roundlogo from '../../images/sevenBrew_Secondary.png'

export default function Email() {
  // const navigate = useNavigate();

  async function submitEmail(event) {

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

    //check to see if the email stored in the dataObj is a valid email address
    var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var email = dataObj.email

    event.preventDefault(); //stop page from refreshing on submit
    //sending username and password to backend

    if (regexEmail.test(email)) {
    const response = await fetch("http://localhost:3000/forgotPassword", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email
      }),
    });

    const body = await response.json();
    if (response.status === 200) {
      console.log(body);

       alert("Recovery email has been sent to " + email)
      
    } else {
      console.log(body.response);
    }
  } else {
    alert("Please enter a valid Email Address")
    }
  }
  return (
    <div>
    <form 
      name="userEmail"
      onSubmit={submitEmail}
      className="flex flex-col h-max items-center justify-center"
    >
       <figure className="flex size-1/3 m-2 md:size-44"><img src={roundlogo} alt="7 Brew Logo"/></figure>
      <label className="flex form-control m-3 p-3 gap-5 items-center">
        <span>Please enter email to recieve link to reset password</span>
        <input
          type="text"
          placeholder="Email"
          className=" input input-bordered w-full max-w-xs text-3xl"
          name="email"
        ></input>
        <button className="btn btn-wide btn-primary m-3 text-2xl" type="submit"> 
          Submit
        </button>
      </label>
    </form>
    <div className="flex bg-secondary absolute z-10 bottom-0 md:w-screen">
    <Footer />
    </div>
    </div>
  );
}