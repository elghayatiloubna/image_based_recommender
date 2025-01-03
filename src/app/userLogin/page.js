'use client';

import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState(null);

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5002/login", {
        email,
        password
      });
      if (response.data.token) {
        // Stocker le token JWT dans le localStorage
        localStorage.setItem("jwt", response.data.token);
        console.log("Token JWT:", response.data.token);
        // Appeler la fonction pour obtenir l'ID utilisateur
        fetchUserInfo();
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const fetchUserInfo = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      console.error("Token not found");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5002/user-info", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserId(response.data.user_id);  // Stocker l'ID utilisateur dans l'état
      console.log("User ID:", response.data.user_id);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => loginUser(email, password)}>Login</button>

      {userId && <div>User ID: {userId}</div>}
    </div>
  );
};

export default Login;
