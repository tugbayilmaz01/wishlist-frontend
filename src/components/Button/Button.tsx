import React, { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  children,
  startIcon,
  endIcon,
  variant = "primary",
  className = "",
  ...rest
}) => {
  const buttonClass = `${styles.button} ${styles[variant]} ${className}`;

  return (
    <button className={buttonClass} {...rest}>
      {startIcon && <span className={styles.icon}>{startIcon}</span>}
      {children}
      {endIcon && <span className={styles.icon}>{endIcon}</span>}
    </button>
  );
};

export default Button;
