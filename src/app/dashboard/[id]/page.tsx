"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Card from "@/components/Card/Card";
import AddWishlistProductModal from "../components/wishlistProductModal/WishlistProductModal";
import FilterPanel from "@/components/FilterPanel/FilterPanel";
import Button from "@/components/Button/Button";
import styles from "../Dashboard.module.scss";
import { FiEdit, FiTrash2, FiShare2, FiTag, FiGrid, FiCalendar, FiDollarSign, FiPlus } from "react-icons/fi";
import { api } from "@/utils/api";
import Alert from "@/components/Alert/Alert";
import { useLanguage } from "@/context/LanguageContext";

interface WishlistProduct {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  plannedMonth?: string;
  category?: string;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function WishlistDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const wishlistId = Number(params.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState<WishlistProduct[]>(
    []
  );
  const [editingProduct, setEditingProduct] = useState<WishlistProduct | null>(
    null
  );
  const [wishlist, setWishlist] = useState<any>(null);

  const [view, setView] = useState<"list" | "month">("list");
  const [filters, setFilters] = useState<{ month: string; category: string }>({ 
    month: "All", 
    category: "All" 
  });

  const [alertMessage, setAlertMessage] = useState("");

  const handleShare = async () => {
    try {
      const response: any = await api.post(`/wishlists/${wishlistId}/share`, {});
      const token = response.token;
      const shareUrl = `${window.location.origin}/shared/${token}`;

      await navigator.clipboard.writeText(shareUrl);
      setAlertMessage("Link copied to clipboard! Share it with the world ✨");
    } catch (err) {
      console.error("Failed to share wishlist:", err);
    }
  };

  useEffect(() => {
    api
      .get("/wishlists")
      .then((data: any) => {
        const found = data.find((w: any) => w.id === wishlistId);
        if (found) {
          setWishlist(found);
          setWishlistProducts(found.products || []);
        }
      })
      .catch((err) => {
        console.error(`WishlistDetail Failed to load wishlist:`, err);
      });
  }, [wishlistId]);

  const handleAddProduct = (product: WishlistProduct) => {
    setWishlistProducts((prev) => [...prev, product]);
  };

  const handleUpdateProduct = (updated: WishlistProduct) => {
    setWishlistProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm(t('common.delete') + "?")) return;

    try {
      await api.delete(`/wishlists/${wishlistId}/products/${productId}`);
      setWishlistProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error(
        `WishlistDetail Failed to delete product ${productId}:`,
        err
      );
    }
  };

  const filteredProducts = useMemo(() => {
    return wishlistProducts.filter(
      (p) => 
        (filters.month === "All" || p.plannedMonth === filters.month) &&
        (filters.category === "All" || p.category === filters.category)
    );
  }, [wishlistProducts, filters]);

  const monthOptions = Array.from(
    new Set(wishlistProducts.map((p) => p.plannedMonth).filter(Boolean))
  ) as string[];

  const categoryOptions = Array.from(
    new Set(wishlistProducts.map((p) => p.category).filter(Boolean))
  ) as string[];
  
  const totalPrice = useMemo(() => {
    return filteredProducts.reduce((sum, p) => sum + (p.price || 0), 0);
  }, [filteredProducts]);

  const totalOriginalPrice = useMemo(() => {
    return wishlistProducts.reduce((sum, p) => sum + (p.price || 0), 0);
  }, [wishlistProducts]);

  const renderProductCard = (product: WishlistProduct) => (
    <Card
      key={product.id}
      title={product.name}
      subtitle={product.price ? `${product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL` : ""}
      imageUrl={product.imageUrl}
      tag={product.category}
      actions={
        <>
          <FiEdit
            size={18}
            onClick={(e) => {
              e.stopPropagation();
              setEditingProduct(product);
              setIsModalOpen(true);
            }}
            style={{ cursor: "pointer", marginRight: "8px" }}
          />
          <FiTrash2
            size={18}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteProduct(product.id);
            }}
            style={{ cursor: "pointer", color: "#FF425D" }}
          />
        </>
      }
    />
  );

  return (
    <>
      {alertMessage && (
        <Alert
          message={alertMessage}
          type="success"
          onClose={() => setAlertMessage("")}
        />
      )}

      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>{wishlist?.name || t('wishlistDetail.title')}</h1>
          <button onClick={handleShare} className={styles.iconBtn} title={t('common.share')}>
            <FiShare2 size={20} />
          </button>
          
          <div className={styles.miniStats}>
            <span className={styles.miniStat}>
              <FiDollarSign size={14} />
              {totalPrice.toLocaleString('tr-TR')} TL
            </span>
            <span className={styles.miniStat}>
              <FiTag size={14} />
              {filteredProducts.length} {t('common.items')}
            </span>
          </div>
        </div>
        
        <Button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          startIcon={<FiPlus />}
        >
          {t('wishlistDetail.addProduct')}
        </Button>
      </div>

      {wishlistProducts.length > 0 && (
        <div className={styles.controlsRow}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.toggleBtn} ${view === "list" ? styles.active : ""}`}
              onClick={() => setView("list")}
              title={t('wishlistDetail.listView')}
            >
              <FiGrid size={18} />
            </button>
            <button
              className={`${styles.toggleBtn} ${view === "month" ? styles.active : ""}`}
              onClick={() => setView("month")}
              title={t('wishlistDetail.monthlyView')}
            >
              <FiCalendar size={18} />
            </button>
          </div>

          <div className={styles.filterSection}>
            <FilterPanel
              filters={filters}
              options={{ 
                ...(view !== "month" && { month: monthOptions }),
                category: categoryOptions
              }}
              onChange={(newFilters) =>
                setFilters((prev) => ({ ...prev, ...newFilters }))
              }
            />
          </div>
        </div>
      )}

      {wishlistProducts.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>✨</div>
          <h2 className={styles.emptyTitle}>{t('wishlistDetail.emptyTitle')}</h2>
          <p className={styles.emptySubtitle}>
            {t('wishlistDetail.emptySubtitle')}
          </p>
          <Button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
          >
            {t('wishlistDetail.addFirst')}
          </Button>
        </div>
      ) : view === "list" ? (
        <div className={styles.wishlistGrid}>
          {filteredProducts.map(renderProductCard)}
        </div>
      ) : (
        <div className={styles.monthlyGrid}>
          {months
            .filter((month) =>
              filteredProducts.some((p) => p.plannedMonth === month)
            )
            .map((month) => {
              const productsOfMonth = filteredProducts.filter(
                (p) => p.plannedMonth === month
              );

              const totalPriceMonth = productsOfMonth.reduce(
                (sum, p) => sum + (p.price || 0),
                0
              );
              return (
                <div key={month} className={styles.monthColumn}>
                  <div className={styles.monthHeader}>
                    <div className={styles.monthTitle}>
                      <FiCalendar className={styles.calIcon} />
                      <h3>{month}</h3>
                    </div>
                    <span className={styles.monthBadge}>
                      {totalPriceMonth.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
                    </span>
                  </div>
                  <div className={styles.monthProducts}>
                    {productsOfMonth.map(renderProductCard)}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      <AddWishlistProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        wishlistId={wishlistId}
        product={editingProduct}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
      />
    </>
  );
}
