// src/components/Login.js
import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Successfully toasted!')
      navigate("/home");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="form-container">
    <form onSubmit={handleLogin} className="login-form">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
      <div className="links">
        <Link to="/signup" className="signup-link">Sign Up</Link>
        <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
      </div>
    </form>
    </div>
  );
};

export default Login;
