import React from "react";
import styles from "./ConfirmModal.module.scss";
import Button from "@/components/Button/Button";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
}: ConfirmModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          <FiX size={22} />
        </button>

        <h2>{title || t("common.delete")}</h2>
        <p>{message || t("common.deleteWishlistDesc")}</p>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>
            {cancelText || t("common.cancel")}
          </Button>
          <Button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{ backgroundColor: "#FF425D" }}
          >
            {confirmText || t("common.delete")}
          </Button>
        </div>
      </div>
    </div>
  );
}
