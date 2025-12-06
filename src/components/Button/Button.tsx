import React, { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: "primary" | "secondary";
  active?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  startIcon,
  endIcon,
  variant = "primary",
  active = false,
  className = "",
  loading = false,
  ...rest
}) => {
  const buttonClass = `${styles.button} ${styles[variant]} ${
    active ? styles.active : ""
  } ${loading ? styles.loading : ""}`;

  return (
    <button className={buttonClass} {...rest} disabled={loading}>
      {loading ? (
        <span className={styles.spinner}></span>
      ) : (
        startIcon && <span className={styles.icon}>{startIcon}</span>
      )}

      {loading ? "Loading..." : children}

      {!loading && endIcon && <span className={styles.icon}>{endIcon}</span>}
    </button>
  );
};

export default Button;
