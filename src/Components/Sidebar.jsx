import { signOut } from "firebase/auth";
import React from "react";
import { database } from './loginData/FirebaseConfig';
import {  useNavigate } from "react-router-dom";
import './sidebar.css'

function Sidebar() {

  const history = useNavigate()

    const handleClick = () =>{
        signOut(database).then(val=>{
            console.log(val,"val")
            history('/')
        })
    }
  return (
    <nav className="w-40 bg-gray-800 text-white p-15 flex flex-col items-center nav">
      {/* Sidebar content goes here */}
      <h1 style={{color:"white", fontSize:'20px' ,fontWeight:'600' , marginTop:'40px'}}>Garv To-do</h1>
      <p style={{fontSize:'16px',  textAlign:'center',marginTop:'25px' ,opacity:'0.9'}}>Welcome user ! To The To-Do Application</p>
      <button onClick={handleClick} style={{ backgroundColor: "#3E4684", color: "white", padding: ".75em", borderRadius: "9px",position:'absolute', bottom:'20px' , left:'45px' }}>SignOut</button>
    </nav>
  );
}

export default Sidebar;
