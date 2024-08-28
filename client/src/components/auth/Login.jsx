import { useState } from "react";
import { useNavigate } from "react-router-dom";
import roundlogo from '../../images/sevenBrew_Secondary.png'

export default function LogIn({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function submitLogIn(event) {
    event.preventDefault(); //stop page from refreshing on submit
    //sending username and password to backend
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const body = await response.json();
    if (response.status === 200) {
      console.log(body);

      //saving jwt to local storage
      localStorage.setItem("jwt-token", body.token);
      setToken(body.token);
      navigate("/")
      location.reload();
    } else {
      alert("The username or password is incorrect")
      console.log(body.response);
    }
  }
  //login page render
  return (
    <div>
		<form
			onSubmit={submitLogIn}
			className="flex flex-col items-center justify-center"
		>
      <figure className="flex size-1/3 m-2 md:size-28"><img src={roundlogo} alt="7 Brew Logo"/></figure>
			<h1 className="text-4xl m-3">Log In</h1>
			<label className="form-control w-full max-w-xs">
			<span className="text-3xl m-4">Email:</span>
			<input
				type="text"
				placeholder="Email"
				className=" input input-bordered w-full max-w-xs text-3xl"
				onChange={(e) => setEmail(e.target.value)}
			></input>
			</label>
			<label className="form-control w-full max-w-xs">
			<span className="text-3xl m-4">Password:</span>
			<input
				placeholder="Password"
				type="password"
				className=" input input-bordered w-full max-w-xs"
				onChange={(e) => setPassword(e.target.value)}
			></input>
			</label>
			<button className="btn btn-secondary text-white text-2xl m-4"><a href="http://localhost:5173/user/email">Forgot your password?</a></button>
			<button className="btn btn-wide btn-primary m-3 text-2xl" type="submit">
			Submit
			</button>
		</form>
    </div>
  );
}