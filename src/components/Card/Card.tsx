import styles from "./Card.module.scss";
import { ReactNode } from "react";
import { FiHeart, FiStar, FiShoppingBag, FiGift, FiLayers } from "react-icons/fi";

interface CardProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  description?: string;
  icon?: ReactNode;
  tag?: string;
  children?: ReactNode;
  onClick?: () => void;
  actions?: ReactNode;
  index?: number;
}

export default function Card({
  title,
  subtitle,
  imageUrl,
  description,
  icon,
  tag,
  children,
  onClick,
  actions,
  index,
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
          <div className={styles.cardImagePlaceholder} data-style={index !== undefined ? index % 4 : (title ? (title.length % 4) : 0)}>
            <img 
              src={
                (index !== undefined ? index : (title ? title.length : 0)) % 4 === 0 ? "/assets/star-patch-polka.png" : 
                (index !== undefined ? index : (title ? title.length : 0)) % 4 === 1 ? "/assets/star-patch-pink.png" : 
                (index !== undefined ? index : (title ? title.length : 0)) % 4 === 2 ? "/assets/star-patch-red.png" : 
                "/assets/star-patch-denim.png"
              } 
              alt="Star Patch"
              className={styles.starImage}
            />
            <div className={styles.shimmer}></div>
          </div>
        )}
        {tag && <span className={styles.cardTag}>{tag}</span>}
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
