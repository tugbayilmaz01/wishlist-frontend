"use client";

import { useState, useEffect } from "react";
import { FiX, FiImage, FiArrowRight } from "react-icons/fi";
import styles from "./WishlistProductModal.module.scss";
import Button from "@/components/Button/Button";
import { api } from "@/utils/api";
import { useLanguage } from "@/context/LanguageContext";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  url: string;
  imageUrl: string;
  category: string;
}

interface WishlistProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  wishlistId: string;
  product?: Product;
}

const WishlistProductModal: React.FC<WishlistProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  wishlistId,
  product,
}) => {
  const { t } = useLanguage();
  const isEditMode = !!product;
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scraping, setScraping] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price?.toString() || "");
      setUrl(product.url || "");
      setImageUrl(product.imageUrl || "");
      setCategory(product.category || "");
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setUrl("");
      setImageUrl("");
      setCategory("");
      setScrapeUrl("");
    }
  }, [product, isOpen]);

  const handleScrape = async () => {
    if (!scrapeUrl) return;
    setScraping(true);
    try {
      const { data } = await api.post("/scrape", { url: scrapeUrl });
      setName(data.title || "");
      
      let cleanDesc = data.description || "";
      const junkPatterns = [
        /tıklayın!/gi,
        /online sipariş vermek için/gi,
        /ürünün fiyatını öğrenmek/gi,
        /ile süslemeli/gi,
        /öğrenmek ve online/gi
      ];
      junkPatterns.forEach(p => cleanDesc = cleanDesc.replace(p, ""));
      setDescription(cleanDesc.trim());
      
      setPrice(data.price?.toString() || "");
      setImageUrl(data.image || "");
      setUrl(scrapeUrl);
    } catch (error) {
      console.error("Scrape error:", error);
    } finally {
      setScraping(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name,
        description,
        price: parseFloat(price) || 0,
        url,
        imageUrl,
        category,
        wishlistId,
      };

      if (isEditMode) {
        await api.put(`/products/${product.id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
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
          <h2>{isEditMode ? t("wishlistDetail.editProduct") : t("wishlistDetail.addProduct")}</h2>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.leftCol}>
            <div className={styles.imagePreview}>
              {imageUrl ? (
                <img src={imageUrl} alt="Preview" />
              ) : (
                <div className={styles.noImage}>
                  <FiImage size={40} />
                  <span>{t("wishlistDetail.productPreview")}</span>
                </div>
              )}
            </div>

            <div className={styles.scraperSection}>
              <label>
                {t("wishlistDetail.autoFill")}
                <div className={styles.scraperInputGroup}>
                  <input
                    type="text"
                    placeholder={t("wishlistDetail.manualEntry")}
                    value={scrapeUrl}
                    onChange={(e) => setScrapeUrl(e.target.value)}
                  />
                  <Button 
                    onClick={handleScrape} 
                    loading={scraping}
                  >
                    {t("wishlistDetail.fetchInfo")}
                  </Button>
                </div>
              </label>
            </div>
          </div>

          <div className={styles.rightCol}>
            <form onSubmit={handleSubmit} className={styles.productForm}>
              <label className={styles.fullWidth}>
                {t("wishlistDetail.productName")}
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("wishlistDetail.productName")}
                />
              </label>

              <label className={styles.fullWidth}>
                {t("wishlistDetail.description")}
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("wishlistDetail.description")}
                />
              </label>

              <label>
                {t("wishlistDetail.price")}
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                />
              </label>

              <label>
                {t("wishlistDetail.category")}
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder={t("wishlistDetail.category")}
                />
              </label>

              <label className={styles.fullWidth}>
                {t("wishlistDetail.productUrl")}
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                />
              </label>

              <div className={styles.actions}>
                <Button type="submit" loading={loading} endIcon={<FiArrowRight />}>
                  {isEditMode ? t("common.update") : t("common.save")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistProductModal;
