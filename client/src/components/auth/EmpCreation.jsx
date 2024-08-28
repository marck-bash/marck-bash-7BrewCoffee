import React, { useState } from 'react';
import { hash } from "bcryptjs";

export default function EmpCreation() {
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [role, setRole] = useState("");
    const [storeLocation, setStoreLocation] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    //regex to check if the email stored in the email is a valid email address
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
    function employeeCreation() {
        hash(password, 10, async (err, passwordHash) => {
            if (err) {
                console.log(err);
            } else {
                if (regexEmail.test(email)) {
                        const response = await fetch("http://localhost:3000/addEmployee", {
                        method: "POST",
                        headers: {
                            "content-type": "application/json",
                            "authorization": localStorage.getItem("jwt-token")
                        },
                        body: JSON.stringify({
                            firstName,
                            middleName,
                            lastName,
                            role,
                            storeLocation,
                            email,
                            password: passwordHash
                        })
                    })
                    //create a variable called body to hold the responses we get from the back end converts the response to json so we can read it
                    const body = await response.json();
                    if (response.status === 200) {
                        console.log(body);
                    } else {
                        console.log(body.message);
                    }
                } else {
                    alert("Please enter a valid email address!")
                }
            }
        })
    }
        
    
    
    return (
        <div className='flex justify-center'>
        <form onSubmit={employeeCreation} className="prose flex flex-col m-5 card border-2 border-black shadow-2xl p-6">
            <div className='flex justify-center'>
            <h1 className='text-primary'>Add Employee</h1>
            </div>
            <label>
                <div className='text-neutral'>Email:</div>
                <input className='border-2 border-secondary w-full' placeholder="Email" onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}></input>
            </label>
            <div className='flex gap-1'>
            <label>
                <div className='text-neutral'>First Name:</div>
                <input className='border-2 border-secondary' placeholder="First Name" onChange={(e) => setFirstName(e.target.value)}></input>
            </label>
            <label>
                <div className='text-neutral'>Middle Name:</div>
                <input className='border-2 border-secondary  w-11/12' placeholder="Middle Name" onChange={(e) => setMiddleName(e.target.value)}></input>
            </label>
            <label>
                <div className='text-neutral'>Last Name:</div>
                <input className='border-2 border-secondary' placeholder="Last Name" onChange={(e) => setLastName(e.target.value)}></input>
            </label>
            </div>
            <label>
                <div className='text-neutral'>Store Location:</div>
                <input className='border-2 border-secondary w-full' placeholder="Store Location" onChange={(e) => setStoreLocation(e.target.value)}></input>
            </label>
            <label>
                <div className='text-left text-neutral'>Role:</div>
                <select className='bg-primary text-neutral w-full border-2 border-secondary' onChange={(e) => setRole(e.target.value)}>
                    <option value="">Please choose an option</option>
                    <option>Brewista</option>
                    <option>Shift Leader</option>
                </select>
            </label>
            <label>
                <div className='text-neutral'>Password:</div>
                <input className='border-2 border-secondary w-full' placeholder="Password" type='password' onChange={(e) => setPassword(e.target.value)}></input>
            </label>
            <button type='submit' className='btn btn-primary mt-10'>Submit</button>
        </form>
        </div>
    )
}
