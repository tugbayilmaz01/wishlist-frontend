"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Card from "@/components/Card/Card";
import AddWishlistProductModal from "../components/wishlistProductModal/WishlistProductModal";
import FilterPanel from "@/components/FilterPanel/FilterPanel";
import Button from "@/components/Button/Button";
import styles from "../Dashboard.module.scss";
import { FiEdit, FiTrash2, FiShare2, FiTag, FiGrid, FiCalendar, FiDollarSign, FiPlus, FiUserPlus, FiArrowLeft, FiChevronDown } from "react-icons/fi";
import { api } from "@/utils/api";
import Alert from "@/components/Alert/Alert";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import { useLanguage } from "@/context/LanguageContext";
import CollaboratorModal from "@/app/dashboard/components/collaboratorModal/CollaboratorModal";
import { FiUsers } from "react-icons/fi";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

function MonthSection({ month, products, total, renderCard, isUnplanned = false }: {
  month: string;
  products: any[];
  total: number;
  renderCard: (p: any) => React.ReactNode;
  isUnplanned?: boolean;
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(true);
  return (
    <div className={`${styles.monthSection} ${isUnplanned ? styles.unplanned : ""}`}>
      <button className={styles.monthSectionHeader} onClick={() => setOpen(o => !o)}>
        <div className={styles.monthSectionLeft}>
          <span className={`${styles.monthDot} ${isUnplanned ? styles.unplannedDot : ""}`} />
          <span className={styles.monthSectionName}>{isUnplanned ? t("wishlistDetail.unplanned") : month}</span>
          <span className={styles.monthSectionCount}>{products.length} {t("common.items")}</span>
        </div>
        <div className={styles.monthSectionRight}>
          <span className={styles.monthSectionTotal}>
            {total.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
          </span>
          <FiChevronDown
            size={18}
            className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
          />
        </div>
      </button>
      {open && (
        <div className={styles.monthSectionProducts}>
          {products.map(renderCard)}
        </div>
      )}
    </div>
  );
}


interface Wishlist {
  id: number;
  name: string;
  description?: string;
  products?: any[];
  isOwner?: boolean;
  owner?: any;
  collaborators?: any[];
}

interface WishlistProduct {
  id: number;
  name: string;
  price: number;
  url?: string;
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
  const router = useRouter();
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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(true);
    api
      .get(`/wishlists/${wishlistId}`)
      .then((data: any) => {
        setWishlist(data);
        setWishlistProducts(data.products || []);
      })
      .catch((err) => {
        console.error(`WishlistDetail Failed to load wishlist:`, err);
      })
      .finally(() => {
        setIsLoading(false);
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
    setProductToDelete(productId);
    setIsConfirmOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/wishlists/${wishlistId}/products/${productToDelete}`);
      setWishlistProducts((prev) => prev.filter((p) => p.id !== productToDelete));
      setProductToDelete(null);
      setIsConfirmOpen(false);
    } catch (err) {
      console.error(
        `WishlistDetail Failed to delete product ${productToDelete}:`,
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
          <button 
            onClick={() => router.push("/dashboard")} 
            className={styles.backBtn}
            title={t('wishlistDetail.backToDashboard')}
          >
            <FiArrowLeft size={20} />
          </button>
          <div className={styles.titleGroup}>
            <h1>{wishlist?.name || t('wishlistDetail.title')}</h1>
            <div className={styles.titleMeta}>
              <span><FiDollarSign size={12} />{totalPrice.toLocaleString('tr-TR')} TL</span>
              <span className={styles.dot}>·</span>
              <span><FiTag size={12} />{filteredProducts.length} {t('common.items')}</span>
            </div>
          </div>
        </div>

        <div className={styles.actionArea}>
       
          {(wishlist?.owner || (wishlist?.collaborators?.length ?? 0) > 0 || wishlist?.isOwner) && (
            <div className={styles.avatarStack}>
              {wishlist?.owner && (
                <div
                  className={`${styles.avatar} ${styles.ownerAvatar}`}
                  title={wishlist.owner.name || wishlist.owner.email}
                >
                  {wishlist.owner.avatar
                    ? <img src={wishlist.owner.avatar} alt="" />
                    : <span>{wishlist.owner.name?.[0]?.toUpperCase() || "?"}</span>
                  }
                  <div className={styles.ownerBadge}>★</div>
                </div>
              )}
              {wishlist?.collaborators?.map((c: any, i: number) => (
                <div key={i} className={styles.avatar} title={c.name || c.email}>
                  {c.avatar
                    ? <img src={c.avatar} alt="" />
                    : <span>{c.name?.[0]?.toUpperCase() || "?"}</span>
                  }
                </div>
              ))}
              {wishlist?.isOwner && (
                <button
                  onClick={() => setIsCollaboratorModalOpen(true)}
                  className={styles.addAvatarBtn}
                  title={t('common.invite')}
                >
                  <FiUserPlus size={15} />
                </button>
              )}
            </div>
          )}

    
          <button onClick={handleShare} className={styles.shareBtn}>
            <FiShare2 size={16} />
            <span>{t('common.share')}</span>
          </button>

      
          <Button
            variant="primary"
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            startIcon={<FiPlus />}
          >
            {t('wishlistDetail.addProduct')}
          </Button>
        </div>
      </div>

      {wishlistProducts.length > 0 && (
        <div className={styles.controlsRow}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.toggleBtn} ${view === "list" ? styles.active : ""}`}
              onClick={() => setView("list")}
            >
              <FiGrid size={15} />
              {t('wishlistDetail.listView')}
            </button>
            <button
              className={`${styles.toggleBtn} ${view === "month" ? styles.active : ""}`}
              onClick={() => setView("month")}
            >
              <FiCalendar size={15} />
              {t('wishlistDetail.monthlyView')}
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

      {isLoading ? (
        <LoadingSpinner />
      ) : wishlistProducts.length === 0 ? (
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
      ) : !filteredProducts.some((p: any) => p.plannedMonth) ? (
        <div className={styles.monthlyEmptyState}>
          <div className={styles.monthlyEmptyIcon}><FiCalendar size={36} /></div>
          <h3>{t("wishlistDetail.noMonthsAssigned")}</h3>
          <p>{t("wishlistDetail.assignMonthDesc")}</p>
          <button
            style={{
              marginTop: "0.5rem",
              background: "transparent",
              border: "1.5px solid #f0e6e9",
              borderRadius: "10px",
              padding: "8px 20px",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#9d8a94",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
            onClick={() => setView("list")}
          >
            {t("wishlistDetail.backToList")}
          </button>
        </div>
      ) : (
        <div className={styles.monthlyAccordion}>
          {months
            .filter((month) => filteredProducts.some((p: any) => p.plannedMonth === month))
            .map((month) => {
              const productsOfMonth = filteredProducts.filter((p: any) => p.plannedMonth === month);
              const totalPriceMonth = productsOfMonth.reduce((sum: number, p: any) => sum + (p.price || 0), 0);
              return (
                <MonthSection
                  key={month}
                  month={month}
                  products={productsOfMonth}
                  total={totalPriceMonth}
                  renderCard={renderProductCard}
                />
              );
            })}
          {filteredProducts.filter((p: any) => !p.plannedMonth).length > 0 && (
            <MonthSection
              month={t("wishlistDetail.unplanned")}
              products={filteredProducts.filter((p: any) => !p.plannedMonth)}
              total={filteredProducts.filter((p: any) => !p.plannedMonth).reduce((sum: number, p: any) => sum + (p.price || 0), 0)}
              renderCard={renderProductCard}
              isUnplanned
            />
          )}
        </div>
      )}

      <AddWishlistProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        wishlistId={wishlistId}
        product={editingProduct || undefined}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDeleteProduct}
        title={t("common.deleteConfirm")}
        message={t("common.deleteProductDesc")}
      />

      <CollaboratorModal
        isOpen={isCollaboratorModalOpen}
        onClose={() => setIsCollaboratorModalOpen(false)}
        wishlistId={wishlistId}
        collaborators={wishlist?.collaborators || []}
        onCollaboratorAdded={(c) => {
          setWishlist((prev: any) => ({
            ...prev,
            collaborators: [...(prev.collaborators || []), c]
          }));
        }}
        onCollaboratorRemoved={(id) => {
          setWishlist((prev: any) => ({
            ...prev,
            collaborators: prev.collaborators.filter((c: any) => c.id !== id)
          }));
        }}
      />
    </>
  );
}
