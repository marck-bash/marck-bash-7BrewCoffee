import React, { useState, useEffect } from 'react'
import {  NavLink } from 'react-router-dom'

export default function DropDownMenuLinkAdmin() {
    const [user, setUser] = useState([]);

    //useEffect to fetch our current user from our database
    useEffect(() => {
        const fetchResults = async () => {
            try {
                let response = await fetch("http://localhost:3000/user/role", {
                    method: "GET",
                    headers: {
                    "content-type": "application/json",
                    "authorization": localStorage.getItem("jwt-token")
                  }
                });
                const body = await response.json();
                setUser(body);
            } catch (error) {
                console.log(error);
            }
        }
        fetchResults();
    }, [])
    
    //mapping our user array to firstName for use in our hello message
    const userName = user.map((list) => (list.firstName))
    
    //maping our user array to role for use in our conditional rendering
    const userRole = user.map((list) => list.role);
    
  return (
    <>
        {
            <div>
                Hello {userName}
            </div>
        }
        {
            // conditional rendering to prevent users without Admin, Manager,
            // and Regional Manager from seeing these renderings
            (userRole[0] === "Admin" || userRole[0] === "Manager" || userRole[0] === "Regional Manager")
            ?
            <>
                <NavLink to='addadmin'>Add Manager</NavLink>
                <NavLink to='addemployee'>Add Employee</NavLink>
                <NavLink to='allusers'>View All Users</NavLink>
                <NavLink to='testResults'>Employee Test Results</NavLink>
                <NavLink to='recipes'>Recipe Creation</NavLink>
            </>
            :
            <>
            </>
        }
    </>
  )
}
