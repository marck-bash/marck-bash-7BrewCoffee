import { useState } from "react";
import LogIn from "./Login"
import Footer from "../Footer";


//adding signup and login routes to auth component
function Auth() {
  const [token, setToken] = useState(localStorage.getItem("jwt-token"));
    return (
        <div className='flex flex-col justify-between h-screen overflow-y-auto'>
          
          <LogIn setToken={setToken}/>
          <Footer />

        </div>
    )
  }
  
  export default Auth