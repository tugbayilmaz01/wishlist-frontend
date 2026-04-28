import styles from "./Card.module.scss";
import { ReactNode } from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  description?: string;
  children?: ReactNode;
  onClick?: () => void;
  actions?: ReactNode;
}

export default function Card({
  title,
  subtitle,
  imageUrl,
  description,
  children,
  onClick,
  actions,
}: CardProps) {
  const imagePath = imageUrl
    ? imageUrl.startsWith("http") ? imageUrl : `/assets${imageUrl}`
    : null;

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.cardImageWrapper}>
        {imagePath ? (
          <img
            src={imagePath}
            alt={title || "Product image"}
            className={styles.cardImage}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className={styles.cardImagePlaceholder}>
            <span>🛍️</span>
          </div>
        )}
        {actions && <div className={styles.cardActions}>{actions}</div>}
      </div>

      <div className={styles.cardBody}>
        {title && <h3 className={styles.cardTitle}>{title}</h3>}
        {subtitle && <span className={styles.cardPrice}>{subtitle}</span>}
        {description && <p className={styles.cardDescription}>{description}</p>}
        {children && <div className={styles.cardChildren}>{children}</div>}
      </div>
    </div>
  );
}
