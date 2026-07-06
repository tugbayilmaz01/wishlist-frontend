"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/utils/api";
import styles from "./ForgotPassword.module.scss";
import { FiArrowLeft, FiMail, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setAlertInfo({ message: t("auth.emptyFields"), type: "error" });
      return;
    }
    if (!emailRegex.test(email)) {
      setAlertInfo({ message: t("auth.invalidEmail"), type: "error" });
      return;
    }

    setLoading(true);
    setAlertInfo(null);

    try {
      await api.post("/users/forgot-password", { email });
      setAlertInfo({ message: t("auth.resetLinkSent"), type: "success" });
      setEmail("");
    } catch (err: any) {
      const message =
        err.message?.toLowerCase().includes("not found") ||
        err.message?.toLowerCase().includes("bulunamad")
          ? t("auth.emailNotFound")
          : t("auth.resetLinkError");
      setAlertInfo({ message, type: "error" });
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
        <Image
          src="/logo-horizontal.svg"
          alt="Wishtra"
          width={140}
          height={40}
          priority
        />
        <LanguageSwitcher />
      </div>

      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <FiMail size={28} />
        </div>

        <div className={styles.textBlock}>
          <h1 className={styles.title}>{t("auth.forgotPasswordTitle")}</h1>
          <p className={styles.subtitle}>{t("auth.forgotPasswordSubtitle")}</p>
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
          <div className={styles.inputGroup}>
            <label className={styles.label}>{t("auth.forgotPasswordEmail")}</label>
            <input
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              disabled={loading || alertInfo?.type === "success"}
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading || alertInfo?.type === "success"}
          >
            {loading ? (
              <>
                <span className={styles.spinner} />
                {t("auth.sendingResetLink")}
              </>
            ) : (
              t("auth.sendResetLink")
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
