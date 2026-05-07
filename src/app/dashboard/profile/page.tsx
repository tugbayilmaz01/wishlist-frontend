"use client";

import { useState, useEffect } from "react";
import styles from "./Profile.module.scss";
import Button from "@/components/Button/Button";
import Alert from "@/components/Alert/Alert";
import { api } from "@/utils/api";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { FiUser, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

const AVATARS = [
  "/assets/avatars/avatar-1.png",
  "/assets/avatars/avatar-2.png",
  "/assets/avatars/avatar-3.png",
  "/assets/avatars/avatar-4.png",
  "/assets/avatars/avatar-5.png",
  "/assets/avatars/avatar-6.png",
  "/assets/avatars/avatar-7.png",
  "/assets/avatars/avatar-8.png",
];

export default function ProfilePage() {
  const { user, refreshUser } = useUser();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setName(user.name || "");
      setSelectedAvatar(user.avatar || "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const data: any = await api.put("/users/me", {
        name: name,
        avatar: selectedAvatar
      });
      
      await refreshUser();
      setAlertInfo({ message: t('profile.success'), type: "success" });
    } catch (err) {
      console.error("Failed to update profile:", err);
      setAlertInfo({ message: t('profile.error'), type: "error" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setAlertInfo(null), 3000);
    }
  };

  return (
    <>
      {alertInfo && (
        <Alert
          message={alertInfo.message}
          type={alertInfo.type}
          onClose={() => setAlertInfo(null)}
        />
      )}
      <div className={styles.profileContainer}>
        <div className={styles.headerSection}>
          <Link href="/dashboard" className={styles.backLink}>
            <FiArrowLeft size={16} />
            {t('profile.back')}
          </Link>
          <h1>{t('profile.title')}</h1>
          <p>{t('profile.subtitle')}</p>
        </div>

        <div className={styles.profileCard}>
        {/* Avatar Picker Section */}
        <div className={styles.avatarSection}>
          <div className={styles.currentAvatar}>
            {selectedAvatar ? (
              <img src={selectedAvatar} alt="Current avatar" />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <FiUser size={40} />
              </div>
            )}
          </div>
          <div className={styles.avatarOptions}>
            {AVATARS.map((avatar, idx) => (
              <button
                key={idx}
                type="button"
                className={`${styles.avatarOption} ${selectedAvatar === avatar ? styles.selected : ""}`}
                onClick={() => setSelectedAvatar(avatar)}
              >
                <img src={avatar} alt={`Avatar option ${idx + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* User Details Form */}
        <form className={styles.formSection} onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label>{t('profile.displayName')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('profile.placeholderName')}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t('profile.email')}</label>
            <input
              type="email"
              value={email}
              disabled
              title={t('profile.emailDisabled')}
            />
          </div>

          <div className={styles.actions}>
            <Button variant="primary" loading={isSaving}>
              {isSaving ? t('profile.saving') : t('profile.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </>
);
}
