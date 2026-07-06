"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/utils/api";
import styles from "@/app/forgot-password/ForgotPassword.module.scss";
import resetStyles from "./ResetPassword.module.scss";
import {
  FiArrowLeft,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export default function ResetPasswordPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setAlertInfo({ message: t("auth.weakPassword"), type: "error" });
      return;
    }

    if (password !== confirmPassword) {
      setAlertInfo({ message: t("auth.passwordsDoNotMatch"), type: "error" });
      return;
    }

    setLoading(true);
    setAlertInfo(null);

    try {
      await api.post("/users/reset-password", { token, newPassword: password });
      setAlertInfo({ message: t("auth.resetSuccess"), type: "success" });
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: any) {
      setAlertInfo({ message: t("auth.resetError"), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className={styles.wrapper}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />
      <div className={`${styles.blob} ${styles.blob3}`} />

      <div className={styles.logoTop}>
        <Image src="/logo-horizontal.svg" alt="Wishtra" width={140} height={40} priority />
        <LanguageSwitcher />
      </div>

      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <FiLock size={28} />
        </div>

        <div className={styles.textBlock}>
          <h1 className={styles.title}>{t("auth.resetPasswordTitle")}</h1>
          <p className={styles.subtitle}>{t("auth.resetPasswordSubtitle")}</p>
        </div>

        {alertInfo && (
          <div
            className={`${styles.inlineAlert} ${
              alertInfo.type === "error" ? styles.errorAlert : styles.successAlert
            }`}
          >
            {alertInfo.type === "error" ? (
              <FiAlertCircle className={styles.alertIcon} />
            ) : (
              <FiCheckCircle className={styles.alertIcon} />
            )}
            <p>{alertInfo.message}</p>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* New Password */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>{t("auth.newPassword")}</label>
            <div className={resetStyles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${styles.input} ${resetStyles.inputPad}`}
                disabled={loading || alertInfo?.type === "success"}
              />
              <button
                type="button"
                className={resetStyles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>{t("auth.confirmPassword")}</label>
            <div className={resetStyles.passwordWrapper}>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${styles.input} ${resetStyles.inputPad}`}
                disabled={loading || alertInfo?.type === "success"}
              />
              <button
                type="button"
                className={resetStyles.eyeIcon}
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
              >
                {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading || alertInfo?.type === "success"}
          >
            {loading ? (
              <>
                <span className={styles.spinner} />
                {t("auth.settingPassword")}
              </>
            ) : (
              t("auth.setNewPassword")
            )}
          </button>
        </form>

        <Link href="/login" className={styles.backLink}>
          <FiArrowLeft size={15} />
          {t("auth.backToLogin")}
        </Link>
      </div>
    </div>
  );
}
