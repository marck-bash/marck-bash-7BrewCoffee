import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EditNameButton from "./EditNameButton";
import EditEmailButton from "./EditEmailButton";

export default function EditProfileCard() {
  //get our ID # from our current route parameters to tell us which ID we are to edit in our Fetch request
  let { _id } = useParams();
  let [records, setRecords] = useState([]);

  //useEffect to get data from user whom is currently logged in
  useEffect(() => {
    fetch(`http://localhost:3000/edit/${_id}`, {
      headers: {
        "content-type": "application/json",
        "authorization": localStorage.getItem("jwt-token")
        }
        })
        .then(response => response.json())
        .then(data => setRecords(data))
        .catch(err => console.log(err))
        }, [])
        
  return ( 
  <>
    <div className="flex justify-center items-center my-20">
        <div className="card w-fit border-2 border-secondary bg-base-100 shadow-2xl">
            <div className="card-body">
                <div className="card-title text-primary">Edit Profile</div>
                {records.map((user, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <div>Name: {user.firstName} {user.middleName} {user.lastName} </div>
                        <EditNameButton user={user}/>
                      </div>
                        <div className='border-2 border-secondary my-4'></div>
                      <div className="flex items-center justify-between">
                        <div>Email: {user.email} </div>
                        <EditEmailButton user={user}/>
                      </div>
                        
                    </div>
                )
                )}
            </div>
        </div>
    </div>
  </>
) 
}
