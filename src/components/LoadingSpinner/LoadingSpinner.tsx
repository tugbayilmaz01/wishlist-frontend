import React from "react";
import styles from "./LoadingSpinner.module.scss";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  showText?: boolean;
}

export default function LoadingSpinner({
  fullScreen = false,
  showText = true,
}: LoadingSpinnerProps) {
  return (
    <div
      className={`${styles.container} ${fullScreen ? styles.fullScreen : ""}`}
    >
      <div className={styles.loaderWrapper}>
        {/* Soft SVG Kalp */}
        <svg
          className={styles.heartSvg}
          viewBox="0 0 32 29.6"
          width="50"
          height="50"
        >
          <path
            d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
          c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"
          />
        </svg>

        {/* Sabit Duran Renkli Yıldızlar */}
        <div className={styles.starsWrapper}>
          <svg className={`${styles.star} ${styles.star1}`} viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg className={`${styles.star} ${styles.star2}`} viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg className={`${styles.star} ${styles.star3}`} viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>

        {showText && <p className={styles.text}>Loading...</p>}
      </div>
    </div>
  );
}
