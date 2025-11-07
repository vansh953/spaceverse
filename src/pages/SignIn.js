import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../utils/firebase";
import "../style/login.css";

const Signin = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("⚠️ Please fill all fields.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    
      navigate("/home");
    } catch (error) {
      console.error("Error signing in:", error.message);
      alert("❌ Invalid email or password!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🌌 Sign In</h2>
        <form onSubmit={handleSignin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign In</button>
        </form>
        <p>
          Don’t have an account?{" "}
          <span className="link" onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signin;
