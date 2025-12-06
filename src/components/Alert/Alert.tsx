"use client";

import React, { useEffect } from "react";
import styles from "./Alert.module.scss";

type AlertProps = {
  message: string;
  type: "success" | "error" | "warning" | "info";
  onClose: () => void;
};

export default function Alert({ message, type, onClose }: AlertProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.alert} ${styles[type]} ${styles.show}`}>
      <span>{message}</span>
    </div>
  );
}
