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
  const imagePath = imageUrl ? `/assets${imageUrl}` : "/assets/default.png";

  return (
    <div className={styles.card} onClick={onClick}>
      <img
        src={imagePath}
        alt={title || "Card image"}
        className={styles.cardImage}
        onError={(e) =>
          ((e.currentTarget as HTMLImageElement).src = "/assets/default.png")
        }
      />

      <div className={styles.cardBody}>
        {title && <h3 className={styles.cardTitle}>{title}</h3>}
        {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
        {description && <p className={styles.cardDescription}>{description}</p>}
        {actions && <div className={styles.cardActions}> {actions}</div>}
        {children && <div className={styles.cardChildren}>{children}</div>}
      </div>
    </div>
  );
}
