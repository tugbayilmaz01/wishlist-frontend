import { useEffect, useState } from "react";
import styles from "./WishlistCategoryModal.module.scss";
import Button from "@/components/Button/Button";

interface AddWishlistCategoryModalProps {
  isOpen: boolean;
  onClose?: () => void;
  initialData?: {
    id: number;
    name: string;
    description?: string;
  };
  onSave: (data: { id?: number; name: string; description?: string }) => void;
}

export default function AddWishlistCategoryModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: AddWishlistCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || "",
      });
    } else {
      setFormData({ name: "", description: "" });
    }
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      id: initialData?.id,
      name: formData.name,
      description: formData.description,
    });

    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>
          {initialData ? "Edit Wishlist Category" : "Add Wishlist Category"}
        </h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>

          <div className={styles.actions}>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
