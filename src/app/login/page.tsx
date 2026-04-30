"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { api } from "@/utils/api";
import Button from "@/components/Button/Button";
import Alert from "@/components/Alert/Alert";
import styles from "./Login.module.scss";
import { FiEye, FiEyeOff, FiArrowRight, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const { t } = useLanguage();
  const [isFlipped, setIsFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setAlertType("error");
      setAlertMessage(t("auth.emptyFields"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      setAlertType("error");
      setAlertMessage(t("auth.invalidEmail"));
      return;
    }

    setLoginLoading(true);
    try {
      const data = await api.post("/users/login", {
        email: loginEmail,
        password: loginPassword,
      });

      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setAlertType("error");
      setAlertMessage(err.message || t("auth.loginError"));
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!signupEmail || !signupPassword) {
      setAlertType("error");
      setAlertMessage(t("auth.emptyFields"));
      return;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupEmail)) {
      setAlertType("error");
      setAlertMessage(t("auth.invalidEmail"));
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(signupPassword)) {
      setAlertType("error");
      setAlertMessage(t("auth.weakPassword"));
      return;
    }

    setSignupLoading(true);
    try {
      await api.post("/users/register", {
        email: signupEmail,
        password: signupPassword,
      });

      setAlertType("success");
      setAlertMessage(t("auth.signupSuccess"));
      setIsFlipped(false);
    } catch (err: any) {
      setAlertType("error");
      setAlertMessage(err.message || t("auth.signupError"));
    } finally {
      setSignupLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.blob} ${styles.blob1}`}></div>
      <div className={`${styles.blob} ${styles.blob2}`}></div>
      <div className={`${styles.blob} ${styles.blob3}`}></div>

      <div className={styles.logoTop}>
        <Image
          src="/logo-horizontal.svg"
          alt="WishIt"
          width={140}
          height={40}
          priority
        />
      </div>

      <div className={`${styles.card} ${isFlipped ? styles.flipped : ""}`}>
        <div className={styles.front}>
          <h2 className={styles.title}>{t("auth.welcomeBack")}</h2>
          {alertMessage && !isFlipped && (
            <div className={`${styles.inlineAlert} ${alertType === "error" ? styles.errorAlert : styles.successAlert}`}>
              {alertType === "error" ? <FiAlertCircle className={styles.alertIcon} /> : <FiCheckCircle className={styles.alertIcon} />}
              <p>{alertMessage}</p>
            </div>
          )}
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className={styles.input}
            />
            <div className={styles.passwordWrapper}>
              <input
                type={showLoginPassword ? "text" : "password"}
                placeholder={t("auth.passwordPlaceholder")}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className={styles.input}
              />
              <button
                type="button"
                className={styles.eyeIcon}
                onClick={() => setShowLoginPassword(!showLoginPassword)}
              >
                {showLoginPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>
          <Button 
            onClick={handleLogin} 
            loading={loginLoading} 
            endIcon={<FiArrowRight />}
            style={{ width: '100%', marginTop: '10px' }}
          >
            {loginLoading ? t("auth.signingIn") : t("auth.signIn")}
          </Button>

          <p className={styles.switch} onClick={() => { setIsFlipped(true); setAlertMessage(""); }}>
            {t("auth.newHere")} <span>{t("auth.createAccount")}</span>
          </p>
        </div>

        <div className={styles.back}>
          <h2 className={styles.title}>{t("auth.joinTitle")}</h2>
          {alertMessage && isFlipped && (
            <div className={`${styles.inlineAlert} ${alertType === "error" ? styles.errorAlert : styles.successAlert}`}>
              {alertType === "error" ? <FiAlertCircle className={styles.alertIcon} /> : <FiCheckCircle className={styles.alertIcon} />}
              <p>{alertMessage}</p>
            </div>
          )}
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              className={styles.input}
            />
            <div className={styles.passwordWrapper}>
              <input
                type={showSignupPassword ? "text" : "password"}
                placeholder={t("auth.passwordPlaceholder")}
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className={styles.input}
              />
              <button
                type="button"
                className={styles.eyeIcon}
                onClick={() => setShowSignupPassword(!showSignupPassword)}
              >
                {showSignupPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>
          <Button 
            onClick={handleSignup} 
            loading={signupLoading} 
            endIcon={<FiArrowRight />}
            style={{ width: '100%', marginTop: '10px' }}
          >
            {signupLoading ? t("auth.creating") : t("auth.startWishing")}
          </Button>
          <p className={styles.switch} onClick={() => { setIsFlipped(false); setAlertMessage(""); }}>
            {t("auth.alreadyHave")} <span>{t("auth.loginNow")}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
