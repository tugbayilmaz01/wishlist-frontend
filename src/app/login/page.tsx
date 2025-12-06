"use client";

import { useState } from "react";
import Image from "next/image";
import { api } from "@/utils/api";
import Button from "@/components/Button/Button";
import Alert from "@/components/Alert/Alert";
import styles from "./Login.module.scss";

export default function LoginPage() {
  const [isFlipped, setIsFlipped] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const handleLogin = async () => {
    try {
      const data = await api.post("/users/login", {
        email: loginEmail,
        password: loginPassword,
      });

      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setAlertType("error");
      setAlertMessage(err.message || "Login failed. Please try again.");
    }
  };

  const handleSignup = async () => {
    try {
      await api.post("/users/register", {
        email: signupEmail,
        password: signupPassword,
      });

      setAlertType("success");
      setAlertMessage("Account created! You can log in now.");
      setIsFlipped(false);
    } catch (err: any) {
      setAlertType("error");
      setAlertMessage(err.message || "Signup failed. Please check your info.");
    }
  };

  return (
    <div className={styles.wrapper}>
      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertMessage("")}
        />
      )}

      <div className={styles.logoTop}>
        <Image
          src="/logo-horizontal.svg"
          alt="WishIt"
          width={150}
          height={42}
          priority
        />
      </div>

      <div className={`${styles.card} ${isFlipped ? styles.flipped : ""}`}>
        <div className={styles.front}>
          <h2 className={styles.title}>Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className={styles.input}
          />
          <Button onClick={handleLogin}>Login</Button>

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
        </div>
      </div>
    </div>
  );
}
