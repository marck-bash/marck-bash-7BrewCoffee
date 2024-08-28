import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function LogOut() {
    
  return (
    <NavLink 
    to="/" 
    className='btn bg-neutral text-accent hover:bg-primary hover:text-accent rounded-xl mx-8'
    onClick={() => {
        localStorage.removeItem("jwt-token")
    }}
    reloadDocument
    >
        Log Out
    </NavLink>
  )
}
