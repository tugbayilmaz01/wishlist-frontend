import { useEffect, useState } from "react";
import styles from "./WishlistProductModal.module.scss";
import Button from "@/components/Button/Button";
import Select from "@/components/Select/Select";
import { api } from "@/utils/api";
import { FiX } from "react-icons/fi";

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
  const [scrapingUrl, setScrapingUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: String(product.price || ""),
        imageUrl: product.imageUrl || "",
        plannedMonth: product.plannedMonth || "",
      });
      setShowManualForm(true);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        plannedMonth: "",
      });
      setShowManualForm(false);
      setScrapingUrl("");
    }
  }, [product, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleScrape = async () => {
    if (!scrapingUrl) return;
    setIsScraping(true);
    try {
     
      const res = await api.get(`/scraper?url=${encodeURIComponent(scrapingUrl)}`);
      const data = res; 

      if (data && !data.Error) {
        setFormData((prev) => ({
          ...prev,
          name: data.title || prev.name,
          description: data.description || prev.description,
          price: data.price ? String(data.price) : prev.price,
          imageUrl: data.imageUrl || prev.imageUrl,
        }));
        setShowManualForm(true);
      } else if (data?.Error) {
        alert(data.Error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch product details from URL");
    } finally {
      setIsScraping(false);
    }
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

    try {
      let data;
      if (isEditMode) {
        data = await api.put(
          `/wishlists/${wishlistId}/products/${product.id}`,
          payload
        );
        onUpdateProduct(data);
      } else {
        data = await api.post(`/wishlists/${wishlistId}/products`, payload);
        onAddProduct(data.product);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <FiX size={22} />
        </button>
        <h2>{isEditMode ? "Edit Product" : "Add Product"}</h2>
        
        {!isEditMode && (
          <div className={styles.scraperSection}>
            <label>
              Auto-fill from Link (Trendyol, Shopier, etc.)
              <div className={styles.scraperInputGroup}>
                <input
                  type="url"
                  placeholder="Paste product link here..."
                  value={scrapingUrl}
                  onChange={(e) => setScrapingUrl(e.target.value)}
                />
                <Button variant="primary" onClick={handleScrape} disabled={isScraping || !scrapingUrl}>
                  {isScraping ? "Fetching..." : "Fetch Info"}
                </Button>
              </div>
            </label>
          </div>
        )}

        {(!isEditMode && !showManualForm) && (
          <div className={styles.manualToggle}>
            <div className={styles.divider}><span>OR</span></div>
            <button type="button" onClick={() => setShowManualForm(true)} className={styles.manualBtn}>
              Enter details manually
            </button>
          </div>
        )}

        {(isEditMode || showManualForm) && (
          <form onSubmit={handleSubmit} className={styles.productForm}>
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
              step="any"
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
            <Button variant="primary">{isEditMode ? "Update" : "Save"}</Button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
