"use client";

import { useState, useEffect } from "react";
import styles from "./Profile.module.scss";
import Button from "@/components/Button/Button";
import Alert from "@/components/Alert/Alert";
import { api } from "@/utils/api";
import { useUser } from "@/context/UserContext";
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
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setName(user.name || "");
      setSelectedAvatar(user.avatar || AVATARS[0]);
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
      setAlertInfo({ message: "Profile updated successfully! ✨", type: "success" });
    } catch (err) {
      console.error("Failed to update profile:", err);
      setAlertInfo({ message: "Failed to save profile.", type: "error" });
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
            Back to Dashboard
          </Link>
          <h1>My Profile</h1>
          <p>Personalize your experience and account settings</p>
        </div>

        <div className={styles.profileCard}>
        {/* Avatar Picker Section */}
        <div className={styles.avatarSection}>
          <div className={styles.currentAvatar}>
            <img src={selectedAvatar} alt="Current avatar" />
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
            <label>Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              title="Email cannot be changed"
            />
          </div>

          <div className={styles.actions}>
            <Button variant="primary" loading={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </>
);
}
