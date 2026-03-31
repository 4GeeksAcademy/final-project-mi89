import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Login = () => {
    const { store, dispatch } = useGlobalReducer();

    const [logInType, setLogInType] = useState("Log In") // Other value will be "Sign Up"
    const [userType, setUserType] = useState("Customer"); // Other value will be "Owner"
    const [email, setEmail] = useState(undefined);
    const [password, setPassword] = useState(undefined);

    function submitCredentials() {
        e.preventDefault();
        if (userType === "Customer") {
            console.log("Customer submitted" + { logInType } + "credentials")
            return
        } else if (userType === "Owner") {
            console.log("Owner submitted" + { logInType } + "credentials")
            return
        }
        console.log("When trying to submit the login/signup form, the logInType is invalid (needs to be 'Log In' or 'Log In'");
        alert("There is an error. Please refresh the page and try again.");
    }

    const login = async (email, password) => {
        const resp = await fetch(`https://curly-potato-7v99x7q67v46hg75-3001.app.github.dev/api/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })

        if (!resp.ok) throw Error("There was a problem in the login request")

        if (resp.status === 401) {
            throw ("Invalid credentials")
        }
        else if (resp.status === 400) {
            throw ("Invalid email or password format")
        }
        const data = await resp.json()
        // Save your token in the localStorage
        // Also you should set your user into the store using the setItem function
        localStorage.setItem("jwt-token", data.token);

        dispatch({ type: "isLoggedIn", payload: true })

        return data
    }

    return (
        <div>
            {!store.isLoggedIn ?
                (<form onSubmit={submitCredentials}>
                    <h2>{userType} {logInType}</h2>
                    <button type="button" onClick={() => { setUserType(userType === "Customer" ? "Owner" : "Customer") }}>I'm a restaurant {userType === "Customer" ? "owner" : "customer"}</button>
                    <small>{logInType === "Log In" ? "Don't" : "Already"} have an account? <span className="text-primary" onClick={() => { logInType === "Log In" ? setLogInType("Sign Up") : setLogInType("Log In") }}>Click here to {logInType === "Log In" ? "create one." : "log in."}</span></small>
                    <label>Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                    </label>
                    <label>Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                        />
                    </label>
                    <input type="submit" onSubmit={login(email, password)} />
                </form>)
                : (<button type="button">Log Out</button>)}

        </div>
    )
}