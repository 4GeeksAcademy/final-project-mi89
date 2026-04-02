import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Navbar } from "../components/Navbar";

export const Login = () => {
    const { store, dispatch } = useGlobalReducer();

    const [logInType, setLogInType] = useState("Log In") // Other value will be "Sign Up"
    const [userType, setUserType] = useState("Customer"); // Other value will be "Owner"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function submitCredentials(e) {
        e.preventDefault();
        logInType === "Log In" && login(email, password)
        logInType === "Sign Up" && signup(userType, email, password)
        dispatch({ type: "set_isLoggedIn", payload: true })
        console.log("User " + email + " is trying to " + logInType);
    }

    const login = async (email, password) => {
        const resp = await fetch(`https://curly-potato-7v99x7q67v46hg75-3001.app.github.dev/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password })
        })

        if (!resp.ok) throw Error("There was a problem in the login request")

        if (resp.status === 401) {
            throw ("Invalid credentials")
        }
        else if (resp.status === 400) {
            throw ("Invalid email, or password format")
        }
        const data = await resp.json()
        // Save your token in the localStorage
        // Also you should set your user into the store using the setItem function
        localStorage.setItem("jwt-token", data.token);

        dispatch({ type: "set_userToken", payload: data.token })
        console.log("token after logging in:", store.userToken)

        return data
    }

    const signup = async (userType, email, password) => {
        const resp = await fetch(`https://curly-potato-7v99x7q67v46hg75-3001.app.github.dev/api/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_type: userType, email: email, password: password })
        })

        if (!resp.ok) throw new Error("There was a problem in the signup request")

        if (resp.status === 401) {
            throw new Error("Invalid sign up credentials")
        }
        else if (resp.status === 400) {
            throw ("Invalid userType, email, or password format")
        }
        const data = await resp.json()
        // Save your token in the localStorage
        // Also you should set your user into the store using the setItem function
        localStorage.setItem("jwt-token", data.token);

        dispatch({ type: "set_userToken", payload: data.token })
        console.log("token after signing up:", store.userToken)

        return data
    }

    const logout = () => {
        dispatch({ type: "set_userToken", payload: "" })
        dispatch({ type: "set_isLoggedIn", payload: false })
        console.log("token after logging out:", store.userToken)
    }

    return (
        <div>
            <Navbar/>
            {!store.isLoggedIn ?
                (<form onSubmit={submitCredentials} className="mt-5 pt-5">
                    <h2>{userType} {logInType}</h2>
                    <label>I am a restaurant owner.
                        <input
                            type="checkbox"
                            name="userIsOwner"
                            checked={userType === "Owner"}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setUserType("Owner")
                                } else {
                                    setUserType("Customer")
                                }
                            }}
                        />
                    </label> <br />
                    <small>{logInType === "Log In" ? "Don't" : "Already"} have an account? <span className="text-primary" onClick={() => { logInType === "Log In" ? setLogInType("Sign Up") : setLogInType("Log In") }}>Click here to {logInType === "Log In" ? "create one." : "log in."}</span></small> <br />
                    <label>Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                    </label> <br />
                    <label>Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                        />
                    </label>
                    <input type="submit" />
                </form>)
                : (<button type="button" onClick={logout} className="pt-5 mt-5">Log Out</button>)}

        </div>
    )
}