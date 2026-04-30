"use client";

import { useState, useEffect } from "react";
import styles from "./Profile.module.scss";
import Button from "@/components/Button/Button";
import Alert from "@/components/Alert/Alert";
import { api } from "@/utils/api";
import { FiUser, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

const AVATARS = ["👩🏻", "👩🏼", "👩🏽", "👱‍♀️", "👩🏻‍🦰", "🎀", "✨", "🌸", "👑", "💅"];

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data: any = await api.get("/users/me");
        setEmail(data.email || "");
        setName(data.name || "Fashion Lover");
        setSelectedAvatar(data.avatar || AVATARS[0]);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const data: any = await api.put("/users/me", {
        name: name,
        avatar: selectedAvatar
      });
      
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
        <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <div className={styles.iconCircle}>
            <FiUser size={24} />
          </div>
          <div className={styles.textGroup}>
            <h1>My Account</h1>
            <p>Manage your settings and personalization</p>
          </div>
        </div>
      </div>

      <div className={styles.profileCard}>
        {/* Avatar Picker Section */}
        <div className={styles.avatarSection}>
          <div className={styles.currentAvatar}>
            {selectedAvatar}
          </div>
          <div className={styles.avatarOptions}>
            {AVATARS.map((avatar, idx) => (
              <button
                key={idx}
                type="button"
                className={`${styles.avatarOption} ${selectedAvatar === avatar ? styles.selected : ""}`}
                onClick={() => setSelectedAvatar(avatar)}
              >
                {avatar}
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
              placeholder="e.g. Trendy Girl"
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
