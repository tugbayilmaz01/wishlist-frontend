"use client";

import React, { useState } from "react";
import styles from "./CollaboratorModal.module.scss";
import Button from "@/components/Button/Button";
import { FiX, FiUserPlus, FiTrash2, FiMail } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/utils/api";

interface Collaborator {
  id: number;
  name?: string;
  email: string;
  avatar?: string;
}

interface CollaboratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistId: number;
  collaborators: Collaborator[];
  onCollaboratorAdded: (collaborator: Collaborator) => void;
  onCollaboratorRemoved: (id: number) => void;
}

export default function CollaboratorModal({
  isOpen,
  onClose,
  wishlistId,
  collaborators,
  onCollaboratorAdded,
  onCollaboratorRemoved,
}: CollaboratorModalProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");
    try {
      const newCollaborator = await api.post(`/wishlists/${wishlistId}/collaborators`, { email });
      onCollaboratorAdded(newCollaborator);
      setEmail("");
    } catch (err: any) {
      const msg: string = err.message || "";
      const isNotFound =
        msg.toLowerCase().includes("not found") ||
        msg.toLowerCase().includes("bulunamadı");
      setError(isNotFound ? t("common.userNotFound") : msg || t("common.errorTitle"));
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await api.delete(`/wishlists/${wishlistId}/collaborators/${id}`);
      onCollaboratorRemoved(id);
    } catch (err) {
      console.error("Failed to remove collaborator:", err);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          <FiX size={22} />
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.iconCircle}>
            <FiUserPlus size={24} />
          </div>
          <h2>{t('wishlistDetail.inviteTitle') || "Invite Collaborators"}</h2>
          <p>{t('wishlistDetail.inviteDesc') || "Share this wishlist with friends and shop together! ✨"}</p>
        </div>

        <form onSubmit={handleInvite} className={styles.inviteForm}>
          <div className={styles.inputGroup}>
            <FiMail className={styles.inputIcon} />
            <input
              type="email"
              placeholder={t('auth.email') || "Email address"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" loading={loading} disabled={!email}>
            {t('common.invite') || "Invite"}
          </Button>
        </form>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.collaboratorList}>
          <h3>{t('wishlistDetail.currentCollaborators') || "Current Collaborators"}</h3>
          {collaborators.length === 0 ? (
            <p className={styles.emptyList}>{t('wishlistDetail.noCollaborators') || "No collaborators yet."}</p>
          ) : (
            <div className={styles.list}>
              {collaborators.map((c) => (
                <div key={c.id} className={styles.item}>
                  <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                      {c.avatar ? (
                        <img src={c.avatar} alt={c.name} />
                      ) : (
                        <span>{c.name?.[0] || c.email[0].toUpperCase()}</span>
                      )}
                    </div>
                    <div className={styles.details}>
                      <span className={styles.name}>{c.name || "User"}</span>
                      <span className={styles.email}>{c.email}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => handleRemove(c.id)}
                    title={t('common.remove') || "Remove"}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
