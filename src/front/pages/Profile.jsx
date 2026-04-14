import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CustomerProfile } from "./CustomerProfile";
import { OwnerProfile } from "./OwnerProfile";

export const Profile = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserType = async () => {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        console.log("No token found");
        navigate("/login");
        return;
      }

      try {
        // Decode JWT
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );

        const decoded = JSON.parse(jsonPayload);
        const userId = decoded.sub;
        console.log("User ID from token:", userId);

        // Fetch user data
        const response = await fetch(
          `https://effective-garbanzo-rqrxxw67jg7h975-3001.app.github.dev/api/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Response status:", response.status);
        const user = await response.json();
        console.log("User data:", user);

        if (user.user_type) {
          setUserType(user.user_type);
        } else {
          setError("user_type not found in response");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    getUserType();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ background: "#0f0f0f", color: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "80px" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: "#0f0f0f", color: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "80px" }}>
        <h2>Error: {error}</h2>
      </div>
    );
  }

  console.log("User type:", userType);

  return userType === "customer" ? <CustomerProfile /> : userType === "owner" ? <OwnerProfile /> : <div style={{ background: "#0f0f0f", color: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "80px" }}><h2>Unknown user type</h2></div>;
};