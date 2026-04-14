import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

export const Login = () => {
    const { store, dispatch } = useGlobalReducer();

    const navigate = useNavigate()

    const [logInType, setLogInType] = useState("Log In"); // Other value will be "Sign Up"
    const [userType, setUserType] = useState("Customer"); // Other value will be "Owner"
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userId, setUserId] = useState();


    async function submitCredentials(e) {
        e.preventDefault();
        if (logInType === "Log In") {
            await login(email, password);
        }
        if (logInType === "Sign Up") {
            await signup(userType, email, password);
            await login(email, password);
            // userType === "Customer" && await createCustomer(username, userId);
            // userType === "Owner" && await createOwner(username, userId);
            // I'm going to call the above lines inside getUser so they can access data.id directly instead of waiting for the state update to userId
        }
        if (store.userToken === undefined) {
            await logout()
        }
        console.log(userType + " " + username + " is trying to " + logInType);
    }

    const login = async (email, password) => {
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password })
        })
        const data = await resp.json()
        // if (!resp.ok) {
        //     // console.error("Backend error:", data);

        //     if (resp.status === 401) {
        //         throw new Error("Invalid credentials");
        //     } else if (resp.status === 400) {
        //         throw new Error("Invalid email or password format");
        //     } else {
        //         throw new Error(data.msg || "Login failed");
        //     }
        // }


        // Save your token in the localStorage
        // Also you should set your user into the store using the setItem function
        localStorage.setItem("jwt-token", data.access_token);

        dispatch({ type: "set_userToken", payload: data.access_token })
        console.log("token after logging in:", data.access_token)

        await getUser()

        navigate("/");

        return data
    }

    const signup = async (userType, email, password) => {
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/signup", {
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

        return data
    }

    const getUser = async () => {
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/user", {
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("jwt-token") },
        })

        const data = await resp.json()
        const id = data.id;
        console.log("This is the user: ", data);
        setUserId(id);
        console.log("LOOK HERE - user ID state variable:", userId);
        console.log("data.id is:", data.id);

        if (logInType === "Sign Up") {
            userType === "Customer" && await createCustomer(username, data.id);
            userType === "Owner" && await createOwner(username, data.id);
        }

        return data;
    }

    const createCustomer = async (username, userId) => {
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/customer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, user_id: userId })
        })

        const data = await resp.json();

        return data;
    }

    const createOwner = async (username, userId) => {
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/owner", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, user_id: userId })
        })

        const data = await resp.json();

        return data;
    }

    const logout = () => {
        localStorage.removeItem("jwt-token");
        dispatch({ type: "set_userToken", payload: null });
        setEmail("");
        setPassword("");
        console.log("token after logging out:", store.userToken);
    }

    useEffect(() => {
        if (store.loggingOut == true) {
            logout();
            navigate("/");
            dispatch({ type: "set_loggingOut", payload: false })
            // This store variable will equal true only when the user clicks Log Out from the navbar, then it will immediately become false because of this useEffect, which will then log out and navigate to the home page.
        }
    }, [store.loggingOut])

    return (
        <div id="login-page" className="bg-dark d-flex justify-content-center row mt-5">
            {store.userToken === null ?
                (<form onSubmit={submitCredentials} className="mt-5 p-4 card col-10 col-md-6 col-xl-4 my-5 rounded-4 border border-2 border-secondary">
                    <h2 className="text-center">{logInType === "Sign Up" && userType} {logInType}</h2>
                    <div>
                        {logInType === "Sign Up" ? <label className="w-100 text-center"><strong>I am a restaurant owner. </strong>
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
                        </label> : <label className="w-100 text-center"><strong>Customers or owners can log in here.</strong></label>} <br />
                        <label className="w-100">Username:
                            <input
                                className="w-100"
                                type="username"
                                value={username}
                                onChange={(e) => { setUsername(e.target.value) }}
                            />
                        </label> <br />
                        <label className="w-100">Email:
                            <input
                                className="w-100"
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                            />
                        </label> <br />
                        <label className="w-100">Password:
                            <input
                                className="w-100"
                                type="password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                            />
                        </label>
                    </div>
                    <button className="btn my-3 fw-bold" type="submit" >{logInType}</button>
                    <span className="mb-3 text-center"><button className="w-100 login-type-button" onClick={() => { logInType === "Log In" ? setLogInType("Sign Up") : setLogInType("Log In") }}>I {logInType === "Log In" ? "don't" : "already"} have an account</button></span>
                </form>)
                : (<div><p className="loading">Loading...</p>
                <p className="loading-message">If this is going too slow, <Link to="/">click here to go home.</Link></p>
                </div>)}
        </div>
    )
}