"use client";

import React, { useEffect } from "react";
import styles from "./Alert.module.scss";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from "react-icons/fi";

type AlertProps = {
  message: string;
  type: "success" | "error" | "warning" | "info";
  onClose: () => void;
};

export default function Alert({ message, type, onClose }: AlertProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case "success": return <FiCheckCircle />;
      case "error": return <FiAlertCircle />;
      case "warning": return <FiAlertTriangle />;
      case "info": return <FiInfo />;
      default: return <FiInfo />;
    }
  };

  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <div className={styles.iconWrapper}>{getIcon()}</div>
      <div className={styles.content}>
        <span className={styles.message}>{message}</span>
      </div>
      <button className={styles.closeBtn} onClick={onClose}>
        <FiX />
      </button>
      <div className={styles.progress} />
    </div>
  );
}
