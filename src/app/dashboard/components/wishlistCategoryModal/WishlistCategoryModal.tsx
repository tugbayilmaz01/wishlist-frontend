import { useEffect, useState } from "react";
import styles from "./WishlistCategoryModal.module.scss";
import Button from "@/components/Button/Button";
import { useLanguage } from "@/context/LanguageContext";
import { FiX } from "react-icons/fi";

interface AddWishlistCategoryModalProps {
  isOpen: boolean;
  onClose?: () => void;
  initialData?: {
    id: number;
    name: string;
  };
  onSave: (data: { id?: number; name: string }) => void;
}

export default function AddWishlistCategoryModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: AddWishlistCategoryModalProps) {
  const { t } = useLanguage();
  const [name, setName] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    } else {
      setName("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      id: initialData?.id,
      name: name,
    });

    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <FiX size={22} />
        </button>

        <h2>
          {initialData ? t("dashboard.createNew") : t("dashboard.createNew")}
        </h2>
        <form onSubmit={handleSubmit}>
          <label>
            {t("dashboard.categoryName")}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("dashboard.categoryPlaceholder")}
              required
            />
          </label>

          <div className={styles.actions}>
            <Button variant="primary" type="submit">
              {t("common.save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
