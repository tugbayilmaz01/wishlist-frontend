"use client";

import styles from "./Dashboard.module.scss";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export default function Loading() {
  return (
    <div className={styles.loadingWrapper} style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <LoadingSpinner showText={true} />
    </div>
  );
}
