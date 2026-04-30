"use client";

import { useEffect, useState } from "react";
import styles from "./WishlistProductModal.module.scss";
import Button from "@/components/Button/Button";
import Select from "@/components/Select/Select";
import { api } from "@/utils/api";
import { FiX, FiImage } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

interface AddWishlistProductModalProps {
  wishlistId: number;
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: any) => void;
  onUpdateProduct: (product: any) => void;
  product?: any;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function AddWishlistProductModal({
  isOpen,
  onClose,
  wishlistId,
  onAddProduct,
  onUpdateProduct,
  product,
}: AddWishlistProductModalProps) {
  const { t } = useLanguage();
  const isEditMode = !!product;
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    plannedMonth: "",
    category: "",
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
        category: product.category || "",
      });
      setShowManualForm(true);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        plannedMonth: "",
        category: "",
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
        let cleanDesc = data.description || "";
        if (cleanDesc.includes("fiyatını öğrenmek") || cleanDesc.includes("online sipariş")) {
          cleanDesc = "";
        }

        setFormData((prev) => ({
          ...prev,
          name: data.title || prev.name,
          description: cleanDesc || prev.description,
          price: data.price ? String(data.price) : prev.price,
          imageUrl: data.imageUrl || prev.imageUrl,
        }));
        setShowManualForm(true);
      } else if (data?.Error) {
        alert(data.Error);
      }
    } catch (err) {
      console.error(err);
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
      category: formData.category,
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
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <FiX size={22} />
        </button>
        
        <div className={styles.modalHeader}>
          <h2>{isEditMode ? t('wishlistDetail.editProduct') : t('wishlistDetail.addProduct')}</h2>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.leftCol}>
            <div className={styles.imagePreview}>
              {formData.imageUrl ? (
                <img src={formData.imageUrl} alt="Product Preview" />
              ) : (
                <div className={styles.noImage}>
                  <FiImage size={40} />
                  <span>Product Preview</span>
                </div>
              )}
            </div>

            {!isEditMode && (
              <div className={styles.scraperSection}>
                <label>
                  {t('wishlistDetail.autoFill')}
                  <div className={styles.scraperInputGroup}>
                    <input
                      type="url"
                      placeholder="Paste link here..."
                      value={scrapingUrl}
                      onChange={(e) => setScrapingUrl(e.target.value)}
                    />
                    <Button variant="primary" onClick={handleScrape} disabled={isScraping || !scrapingUrl}>
                      {isScraping ? t('wishlistDetail.fetching') : t('wishlistDetail.fetchInfo')}
                    </Button>
                  </div>
                </label>
              </div>
            )}

            {(!isEditMode && !showManualForm) && (
              <div className={styles.manualToggle}>
                <div className={styles.divider}><span>{t('common.or')}</span></div>
                <button type="button" onClick={() => setShowManualForm(true)} className={styles.manualBtn}>
                  {t('wishlistDetail.manualEntry')}
                </button>
              </div>
            )}
          </div>

          <div className={styles.rightCol}>
            {(isEditMode || showManualForm) && (
              <form onSubmit={handleSubmit} className={styles.productForm}>
                <label className={styles.fullWidth}>
                  {t('wishlistDetail.productName')}
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  {t('wishlistDetail.category')}
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. Birthday"
                  />
                </label>

                <label>
                  {t('wishlistDetail.price')}
                  <input
                    type="number"
                    name="price"
                    step="any"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className={styles.fullWidth}>
                  {t('wishlistDetail.description')}
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className={styles.fullWidth}>
                  {t('wishlistDetail.imageUrl')}
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                  />
                </label>

                <label className={styles.fullWidth}>
                  {t('wishlistDetail.plannedMonth')}
                  <Select
                    options={months}
                    value={formData.plannedMonth}
                    onChange={(value) =>
                      setFormData({ ...formData, plannedMonth: value })
                    }
                    placeholder={t('wishlistDetail.selectMonth')}
                  />
                </label>

                <div className={styles.actions}>
                  <Button variant="primary">{isEditMode ? t('common.update') : t('common.save')}</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
