import { useEffect, useState } from "react";
import styles from "./WishlistProductModal.module.scss";
import Button from "@/components/Button/Button";
import Select from "@/components/Select/Select";

interface AddWishlistProductModalProps {
  wishlistId: number;
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: any) => void;
  onUpdateProduct: (product: any) => void;
  product?: any;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function AddWishlistProductModal({
  isOpen,
  onClose,
  wishlistId,
  onAddProduct,
  onUpdateProduct,
  product,
}: AddWishlistProductModalProps) {
  const isEditMode = !!product;
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    plannedMonth: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: String(product.price || ""),
        imageUrl: product.imageUrl || "",
        plannedMonth: product.plannedMonth || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        plannedMonth: "",
      });
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      id: product?.id,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      imageUrl: formData.imageUrl,
      plannedMonth: formData.plannedMonth,
    };

    const url = isEditMode
      ? `http://localhost:5062/api/wishlists/${wishlistId}/products/${product.id}`
      : `http://localhost:5062/api/wishlists/${wishlistId}/products`;

    const method = isEditMode ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      if (isEditMode) onUpdateProduct(data);
      else onAddProduct(data.product);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Add Product</h2>
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

          <label>
            Price
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Image URL
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </label>

          <label>
            Planned Month
            <Select
              options={months}
              value={formData.plannedMonth}
              onChange={(value) =>
                setFormData({ ...formData, plannedMonth: value })
              }
              placeholder="Select Month"
            />
          </label>

          <div className={styles.actions}>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary">{isEditMode ? "Update" : "Save"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
