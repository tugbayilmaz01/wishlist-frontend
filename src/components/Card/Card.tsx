import styles from "./Card.module.scss";
import { ReactNode } from "react";
import { FiHeart, FiStar, FiCheck, FiGift, FiLayers } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

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
  isPurchased?: boolean;
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
  isPurchased,
}: CardProps) {
  const { t } = useLanguage();
  const starPatches = [
    "/assets/star-patch-polka.png",
    "/assets/star-patch-pink.png",
    "/assets/star-patch-red.png",
    "/assets/star-patch-denim.png",
    "/assets/star-patch-extra-1.png",
    "/assets/star-patch-extra-2.png",
    "/assets/star-patch-extra-3.png",
    "/assets/star-patch-extra-4.png",
    "/assets/star-patch-extra-5.png",
  ];

  const starIndex = (index !== undefined ? index : (title ? title.length : 0)) % starPatches.length;
  const imagePath = imageUrl
    ? imageUrl.startsWith("http") ? imageUrl : `/assets${imageUrl}`
    : null;

  return (
    <div className={`${styles.card} ${isPurchased ? styles.purchased : ""}`} onClick={onClick}>
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
          <div className={styles.cardImagePlaceholder} data-style={starIndex % 4}>
            <img 
              src={starPatches[starIndex]} 
              alt="Star Patch"
              className={styles.starImage}
            />
            <div className={styles.shimmer}></div>
          </div>
        )}
        {tag && <span className={styles.cardTag}>{tag}</span>}
        {actions && <div className={styles.cardActions}>{actions}</div>}
        {isPurchased && (
          <div className={styles.purchasedBadge}>
            <FiCheck size={14} />
            <span className={styles.purchasedText}>BOUGHT</span>
          </div>
        )}
      </div>

      <div className={styles.cardBody}>
        {title && <h3 className={`${styles.cardTitle} ${isPurchased ? styles.strikethrough : ""}`}>{title}</h3>}
        {subtitle && <span className={`${styles.cardPrice} ${isPurchased ? styles.strikethrough : ""}`}>{subtitle}</span>}
        {description && <p className={styles.cardDescription}>{description}</p>}
        {children && <div className={styles.cardChildren}>{children}</div>}
      </div>
    </div>
  );
}
