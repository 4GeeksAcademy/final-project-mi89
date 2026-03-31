import React, { useState } from "react";
import { Link } from "react-router-dom";

export const Login = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [logInType, setLogInType] = useState("Sign In") // Other value will be "Sign Up", "Register" or similar
    const [userType, setUserType] = useState("customer"); // Or "owner"
    const [email, setEmail] = useState(undefined);
    const [password, setPassword] = useState(undefined);

    function submitCredentials() {
        if (userType === "customer") {
           // what happens when customer submits log in / sign up form
           return
        } else if (userType === "owner") {
            // what happens when owner submits log in / sign up form
            return
        }
        // Error handling: what to do if userType is not "customer" or "owner"
    }

    return (
        <div>
            <input type="email" />
            <input type="password" />
            <form onSubmit={submitCredentials}>
                <h2>{logInType}</h2>
                <small>{logInType === "Sign In" ? "Don't" : "Already"} have an account? <Link>Click here to {logInType === "Sign In" ? "create one." : "sign in."}</Link></small>
                <label>Email:
                    <input
                        type="email"
                        value={email}
                        onChange={setEmail(e.target.value)}
                    />
                </label>
                <label>Password:
                    <input
                        type="password"
                        value={password}
                        onChange={setPassword(e.target.value)}
                    />
                </label>
                <input type="submit" />
            </form>
        </div>
    )
}