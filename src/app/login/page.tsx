"use client";

import { useState } from "react";
import Button from "@/components/Button/Button";
import styles from "./Login.module.scss";

export default function LoginPage() {
  const [isFlipped, setIsFlipped] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5062/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          passwordHash: loginPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setLoginError(data.message || "Login failed");
        return;
      }

      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      setLoginError("Something went wrong");
    }
  };

  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:5062/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupEmail,
          passwordHash: signupPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setSignupError(data.message || "Signup failed");
        return;
      }

      alert("Account created! You can log in now.");
      setIsFlipped(false);
    } catch (err) {
      setSignupError("Something went wrong");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.card} ${isFlipped ? styles.flipped : ""}`}>
        <div className={styles.front}>
          <h2 className={styles.title}>Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className={styles.input}
          ></input>
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className={styles.input}
          ></input>
          <Button onClick={handleLogin}>Login</Button>
          {loginError && <p className={styles.error}>{loginError}</p>}
          <p className={styles.switch} onClick={() => setIsFlipped(true)}>
            Don't have an account? Sign up
          </p>
        </div>
        <div className={styles.back}>
          <h2 className={styles.title}>Sign Up</h2>
          <input
            type="email"
            placeholder="Email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            className={styles.input}
          />
          <Button onClick={handleSignup}>Create Account</Button>
          <p className={styles.switch} onClick={() => setIsFlipped(false)}>
            Already have an account? Login
          </p>
          {signupError && <p className={styles.error}>{signupError}</p>}
        </div>
      </div>
    </div>
  );
}
