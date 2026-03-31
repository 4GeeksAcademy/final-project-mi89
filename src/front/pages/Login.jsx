import React, { useState } from "react";

export const Login = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [logInType, setLogInType] = useState("Sign In") // Other value will be "Sign Up"
    const [userType, setUserType] = useState("customer"); // Other value will be "owner"
    const [email, setEmail] = useState(undefined);
    const [password, setPassword] = useState(undefined);

    function submitCredentials() {
        e.preventDefault();
        if (userType === "customer") {
           // what happens when customer submits log in / sign up form
           return
        } else if (userType === "owner") {
            // what happens when owner submits log in / sign up form
            return
        }
        console.log("When trying to submit the login/signup form, the logInType is invalid (needs to be 'Sign In' or 'Log In'");
        alert("There is an error. Please refresh the page and try again.");
    }

    return (
        <div>
            <form onSubmit={submitCredentials}>
                <h2>{logInType}</h2>
                <small>{logInType === "Sign In" ? "Don't" : "Already"} have an account? <span className="text-primary" onClick={()=>{logInType === "Sign In" ? setLogInType("Sign Up") : setLogInType("Sign In")}}>Click here to {logInType === "Sign In" ? "create one." : "sign in."}</span></small>
                <label>Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e)=>{setEmail(e.target.value)}}
                    />
                </label>
                <label>Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e)=>{setPassword(e.target.value)}}
                    />
                </label>
                <input type="submit" />
            </form>
        </div>
    )
}