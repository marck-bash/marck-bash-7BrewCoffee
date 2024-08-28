import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hash } from "bcryptjs";
import { useParams } from "react-router-dom";
import roundlogo from '../../images/sevenBrew_Secondary.png'
import Footer from "../Footer";

export default function Password() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const navigate = useNavigate();
  let { _id } = useParams();

  async function submitPassword(event) {
    event.preventDefault(); //stop page from refreshing on submit
    //sending username and password to backend
    console.log(password)
    console.log(confirmPassword)
    if (password === confirmPassword) {
    hash(password, 10, async (err, passwordHash) => {
      if (err) {
        console.log(err);
      } else {
    console.log("test", _id);
    const response = await fetch(`http://localhost:3000/resetPassword/${_id}`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        password: passwordHash
      })
    });
    console.log("test3", response);
    const body = await response.json();
    if (response.status === 200) {
      console.log("test2", body);

      navigate("/", {replace: true});
    } else {
      console.log("test4", body.response);
    }
  }
      });
    } else {
      alert("Passwords do not match")
      console.log("test5")
      response.status(500).send({
          message: "Passwords do not match"
      });
  }
  } 
  return (
    <div>
    <form
      name="userPassword"
      onSubmit={submitPassword}
      className="flex flex-col items-center justify-center"
    >
       <figure className="flex size-1/3 m-2 md:size-44"><img src={roundlogo} alt="7 Brew Logo"/></figure>
      <label className="flex form-control items-center justify-center gap-4 h-fit">
        <span>Please enter new password to reset password</span>
        <input
          name="new password"
          type="password"
          placeholder="New Password"
          className=" input input-bordered w-full max-w-xs text-2xl"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <input
          name="confirm password"
          type="password"
          placeholder="Re-enter New Password"
          className=" input input-bordered w-full max-w-xs text-2xl"
          onChange={(e) => setconfirmPassword(e.target.value)}
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
