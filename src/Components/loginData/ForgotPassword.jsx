import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { database } from "./FirebaseConfig";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const history = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        const emalVal = e.target.email.value;
        sendPasswordResetEmail(database, emalVal).then(data => {
            alert("Check your gmail")
            history("/")
        }).catch(err => {
            alert(err.code)
        })
    }
    return (
        <div className="App-bg">
            {/* Background Design */}
            <div class="bg-circles">
                <div class="circle-1"></div>
                <div class="circle-2"></div>
                <div class="circle-3"></div>
                <div class="circle-4"></div>
            </div>
            <div className="App">
                <h1 className="Second-heading">Forgot Password</h1>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <input name="email"   placeholder="Enter Email" className="email"/><br /><br />
                    <button className="Login-btn" style={{marginTop:'-17px'}}>Reset</button>
                </form>
            </div>
        </div>
    )
}
export default ForgotPassword;