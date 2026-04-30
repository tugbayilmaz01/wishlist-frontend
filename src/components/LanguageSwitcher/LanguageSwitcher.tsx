"use client";

import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./LanguageSwitcher.module.scss";

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={styles.switcher}>
      <button
        className={`${styles.btn} ${language === "en" ? styles.active : ""}`}
        onClick={() => setLanguage("en")}
      >
        EN
      </button>
      <div className={styles.divider} />
      <button
        className={`${styles.btn} ${language === "tr" ? styles.active : ""}`}
        onClick={() => setLanguage("tr")}
      >
        TR
      </button>
    </div>
  );
};

export default LanguageSwitcher;
