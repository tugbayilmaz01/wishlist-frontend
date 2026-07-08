"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Card from "@/components/Card/Card";
import AddWishlistProductModal from "../components/wishlistProductModal/WishlistProductModal";
import FilterPanel from "@/components/FilterPanel/FilterPanel";
import Button from "@/components/Button/Button";
import styles from "../Dashboard.module.scss";
import {
  FiEdit,
  FiTrash2,
  FiShare2,
  FiTag,
  FiGrid,
  FiCalendar,
  FiPlus,
  FiUserPlus,
  FiArrowLeft,
  FiChevronDown,
  FiExternalLink,
  FiUser,
  FiCheckCircle,
  FiShoppingBag,
} from "react-icons/fi";
import { TbCurrencyLira } from "react-icons/tb";
import { api } from "@/utils/api";
import Alert from "@/components/Alert/Alert";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import { useLanguage } from "@/context/LanguageContext";
import CollaboratorModal from "@/app/dashboard/components/collaboratorModal/CollaboratorModal";
import { FiUsers } from "react-icons/fi";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import confetti from "canvas-confetti";

function MonthSection({
  month,
  products,
  total,
  renderCard,
  isUnplanned = false,
}: {
  month: string;
  products: any[];
  total: number;
  renderCard: (p: any) => React.ReactNode;
  isUnplanned?: boolean;
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(true);
  return (
    <div
      className={`${styles.monthSection} ${isUnplanned ? styles.unplanned : ""}`}
    >
      <button
        className={styles.monthSectionHeader}
        onClick={() => setOpen((o) => !o)}
      >
        <div className={styles.monthSectionLeft}>
          <span
            className={`${styles.monthDot} ${isUnplanned ? styles.unplannedDot : ""}`}
          />
          <span className={styles.monthSectionName}>
            {isUnplanned ? t("wishlistDetail.unplanned") : month}
          </span>
          <span className={styles.monthSectionCount}>
            {products.length} {t("common.items")}
          </span>
        </div>
        <div className={styles.monthSectionRight}>
          <span className={styles.monthSectionTotal}>
            {total.toLocaleString("tr-TR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            TL
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
  products?: any[];
  isOwner?: boolean;
  owner?: any;
  collaborators?: any[];
}

interface WishlistProduct {
  id: number;
  name: string;
  price: number;
  productUrl?: string;
  imageUrl?: string;
  plannedMonth?: string;
  category?: string;
  isPurchased?: boolean;
}

function formatMonthLabel(value: string, language: string): string {
  if (!value) return "";
  try {
    const [year, month] = value.split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleString(language === "tr" ? "tr-TR" : "en-US", {
      month: "long",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

export default function WishlistDetailPage() {
  const { t, language } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const wishlistId = Number(params.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState<WishlistProduct[]>(
    [],
  );
  const [editingProduct, setEditingProduct] = useState<WishlistProduct | null>(
    null,
  );
  const [wishlist, setWishlist] = useState<any>(null);

  const [view, setView] = useState<"list" | "month">("list");
  const [filters, setFilters] = useState<{
    month: string;
    category: string;
    status: string;
  }>({
    month: "All",
    category: "All",
    status: "All",
  });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleShare = async () => {
    try {
      const response: any = await api.post(
        `/wishlists/${wishlistId}/share`,
        {},
      );
      const token = response.token;
      const shareUrl = `${window.location.origin}/shared/${token}`;

      await navigator.clipboard.writeText(shareUrl);
      setAlertMessage(t("wishlistDetail.shareLinkCopied"));

      confetti({
        particleCount: 50,
        angle: 60,
        spread: 60,
        origin: { x: 0.05, y: 0.85 },
      });

      confetti({
        particleCount: 50,
        angle: 120,
        spread: 60,
        origin: { x: 0.95, y: 0.85 },
      });

      confetti({
        particleCount: 60,
        angle: 90,
        spread: 100,
        origin: { x: 0.5, y: 0.7 },
      });
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
      prev.map((p) => (p.id === updated.id ? updated : p)),
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
      setWishlistProducts((prev) =>
        prev.filter((p) => p.id !== productToDelete),
      );
      setProductToDelete(null);
      setIsConfirmOpen(false);
    } catch (err) {
      console.error(
        `WishlistDetail Failed to delete product ${productToDelete}:`,
        err,
      );
    }
  };

  const filteredProducts = useMemo(() => {
    return wishlistProducts.filter(
      (p) =>
        (filters.month === "All" || p.plannedMonth === filters.month) &&
        (filters.category === "All" || p.category === filters.category) &&
        (filters.status === "All" ||
          (filters.status === "Purchased" && p.isPurchased) ||
          (filters.status === "Wishlist" && !p.isPurchased)),
    );
  }, [wishlistProducts, filters]);

  const monthOptions = Array.from(
    new Set(wishlistProducts.map((p) => p.plannedMonth).filter(Boolean)),
  ).sort() as string[];

  const monthLabels = Object.fromEntries(
    monthOptions.map((m) => [m, formatMonthLabel(m, language)]),
  );

  const categoryOptions = Array.from(
    new Set(wishlistProducts.map((p) => p.category).filter(Boolean)),
  ) as string[];

  const totalPrice = useMemo(() => {
    return filteredProducts.reduce((sum, p) => sum + (p.price || 0), 0);
  }, [filteredProducts]);

  const totalOriginalPrice = useMemo(() => {
    return wishlistProducts.reduce((sum, p) => sum + (p.price || 0), 0);
  }, [wishlistProducts]);

  const togglePurchased = async (product: WishlistProduct) => {
    try {
      const updatedStatus = !product.isPurchased;
      const response: any = await api.put(
        `/wishlists/${wishlistId}/products/${product.id}`,
        {
          ...product,
          isPurchased: updatedStatus,
        },
      );
      handleUpdateProduct(response);
    } catch (err) {
      console.error("Failed to toggle purchased status:", err);
    }
  };

  const renderProductCard = (product: WishlistProduct) => (
    <Card
      key={product.id}
      title={product.name}
      subtitle={
        product.price
          ? `${product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`
          : ""
      }
      imageUrl={product.imageUrl}
      tag={product.category}
      isPurchased={product.isPurchased}
      onClick={() => {
        setEditingProduct(product);
        setIsModalOpen(true);
      }}
      actions={
        <>
          <div
            onClick={(e) => {
              e.stopPropagation();
              togglePurchased(product);
            }}
            style={{
              cursor: "pointer",
              marginRight: "8px",
              color: product.isPurchased ? "#27ae60" : "#9d8a94",
              display: "flex",
              alignItems: "center",
            }}
            title={
              product.isPurchased
                ? t("wishlistDetail.unmarkAsPurchased")
                : t("wishlistDetail.markAsPurchased")
            }
          >
            <FiShoppingBag size={18} />
          </div>
          <FiEdit
            size={18}
            onClick={(e) => {
              e.stopPropagation();
              setEditingProduct(product);
              setIsModalOpen(true);
            }}
            style={{ cursor: "pointer", marginRight: "8px" }}
          />
          {product.productUrl ? (
            <FiExternalLink
              size={18}
              onClick={(e) => {
                e.stopPropagation();
                window.open(product.productUrl, "_blank");
              }}
              style={{ cursor: "pointer", marginRight: "8px", color: "#666" }}
            />
          ) : null}
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

      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <div className={styles.titleArea}>
              <button
                onClick={() => router.push("/dashboard")}
                className={styles.backBtn}
                title={t("wishlistDetail.backToDashboard")}
              >
                <FiArrowLeft size={20} />
              </button>
              <div className={styles.titleGroup}>
                <h1>{wishlist?.name || t("wishlistDetail.title")}</h1>
                <div className={styles.titleMeta}>
                  <span>
                    <TbCurrencyLira
                      size={14}
                      style={{ marginBottom: "-2px" }}
                    />
                    {totalPrice.toLocaleString("tr-TR")} TL
                  </span>
                  <span className={styles.dot}>·</span>
                  <span>
                    <FiTag size={12} />
                    {filteredProducts.length} {t("common.items")}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.actionArea}>
              {(wishlist?.owner ||
                (wishlist?.collaborators?.length ?? 0) > 0 ||
                wishlist?.isOwner) && (
                <div className={styles.avatarStack}>
                  {wishlist?.owner && (
                    <div className={`${styles.avatar} ${styles.ownerAvatar}`}>
                      {wishlist.owner.avatar ? (
                        <img src={wishlist.owner.avatar} alt="" />
                      ) : wishlist.owner.name ? (
                        <span>{wishlist.owner.name[0].toUpperCase()}</span>
                      ) : (
                        <FiUser size={16} />
                      )}
                      <div className={styles.ownerBadge}>★</div>
                      <div className={styles.customTooltip}>
                        {wishlist.owner.name || wishlist.owner.email}
                      </div>
                    </div>
                  )}
                  {wishlist?.collaborators?.map((c: any, i: number) => (
                    <div key={i} className={styles.avatar}>
                      {c.avatar ? (
                        <img src={c.avatar} alt="" />
                      ) : c.name ? (
                        <span>{c.name[0].toUpperCase()}</span>
                      ) : (
                        <FiUser size={16} />
                      )}
                      <div className={styles.customTooltip}>
                        {c.name || c.email}
                      </div>
                    </div>
                  ))}
                  {wishlist?.isOwner && (
                    <button
                      onClick={() => setIsCollaboratorModalOpen(true)}
                      className={styles.addAvatarBtn}
                      title={t("common.invite")}
                    >
                      <FiUserPlus size={15} />
                    </button>
                  )}
                </div>
              )}

              <button onClick={handleShare} className={styles.shareBtn}>
                <FiShare2 size={16} />
                <span>{t("common.share")}</span>
              </button>

              <Button
                variant="primary"
                onClick={() => {
                  setEditingProduct(null);
                  setIsModalOpen(true);
                }}
                startIcon={<FiPlus />}
              >
                {t("wishlistDetail.addProduct")}
              </Button>
            </div>
          </div>

          {wishlistProducts.length > 0 && (
            <div
              className={styles.controlsRow}
              style={{ marginBottom: "1rem", paddingBottom: "0.75rem" }}
            >
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.toggleBtn} ${view === "list" ? styles.active : ""}`}
                  onClick={() => setView("list")}
                >
                  <FiGrid size={15} />
                  {t("wishlistDetail.listView")}
                </button>
                <button
                  className={`${styles.toggleBtn} ${view === "month" ? styles.active : ""}`}
                  onClick={() => setView("month")}
                >
                  <FiCalendar size={15} />
                  {t("wishlistDetail.monthlyView")}
                </button>
              </div>

              <div className={styles.filterSection}>
                <FilterPanel
                  filters={filters}
                  options={{
                    ...(view !== "month" && { month: monthOptions }),
                    category: categoryOptions,
                    status: ["Wishlist", "Purchased"],
                  }}
                  customMonthLabels={monthLabels}
                  onChange={(newFilters) =>
                    setFilters((prev) => ({ ...prev, ...(newFilters as any) }))
                  }
                />
              </div>
            </div>
          )}

          {wishlistProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg
                  className={styles.brandIcon}
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M32 48 H68 V76 C68 79 66 81 63 81 H37 C34 81 32 79 32 76 Z"
                    fill="#38161f"
                  />

                  <path
                    d="M28 38 C28 37 29 36 30 36 H70 C71 36 72 37 72 38 V44 C72 45 71 46 70 46 H30 C29 46 28 45 28 44 Z"
                    fill="#38161f"
                  />

                  <path d="M47 36 H53 V81 H47 Z" fill="#ff425d" />

                  <path d="M32 58 H68 V63 H32 Z" fill="#ff425d" />

                  <path
                    d="M50 36 C42 27 34 32 44 38 C48 40 50 36 50 36 C50 36 52 40 56 38 C66 32 58 27 50 36 Z"
                    fill="#ff425d"
                  />

                  <g transform="translate(14, 16)">
                    <path
                      d="M10 0 L13 7 L20 10 L13 13 L10 20 L7 13 L0 10 L7 7 Z"
                      fill="#FFD700"
                      className={`${styles.sparkleStar} ${styles.star1}`}
                    />
                  </g>

                  <g transform="translate(12, 58)">
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="#ff425d"
                      className={`${styles.sparkleStar} ${styles.star2}`}
                    />
                  </g>

                  <g transform="translate(74, 20)">
                    <path
                      d="M10 0 L13 7 L20 10 L13 13 L10 20 L7 13 L0 10 L7 7 Z"
                      fill="#FFA500"
                      className={`${styles.sparkleStar} ${styles.star3}`}
                    />
                  </g>
                </svg>
              </div>
              <h2 className={styles.emptyTitle}>
                {t("wishlistDetail.emptyTitle")}
              </h2>
              <p className={styles.emptySubtitle}>
                {t("wishlistDetail.emptySubtitle")}
              </p>
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setIsModalOpen(true);
                }}
              >
                {t("wishlistDetail.addFirst")}
              </Button>
            </div>
          ) : view === "list" ? (
            <div key={view} className={styles.wishlistGrid}>
              {filteredProducts.map(renderProductCard)}
            </div>
          ) : !filteredProducts.some((p: any) => p.plannedMonth) ? (
            <div className={styles.monthlyEmptyState}>
              <div className={styles.monthlyEmptyIcon}>
                <FiCalendar size={36} />
              </div>
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
            <div key={view} className={styles.monthlyAccordion}>
              {Array.from(
                new Set(
                  filteredProducts
                    .map((p: any) => p.plannedMonth)
                    .filter(Boolean),
                ),
              )
                .sort()
                .map((month: any) => {
                  const productsOfMonth = filteredProducts.filter(
                    (p: any) => p.plannedMonth === month,
                  );
                  const totalPriceMonth = productsOfMonth.reduce(
                    (sum: number, p: any) => sum + (p.price || 0),
                    0,
                  );
                  return (
                    <MonthSection
                      key={month}
                      month={formatMonthLabel(month, language)}
                      products={productsOfMonth}
                      total={totalPriceMonth}
                      renderCard={renderProductCard}
                    />
                  );
                })}
              {filteredProducts.filter((p: any) => !p.plannedMonth).length >
                0 && (
                <MonthSection
                  month={t("wishlistDetail.unplanned")}
                  products={filteredProducts.filter(
                    (p: any) => !p.plannedMonth,
                  )}
                  total={filteredProducts
                    .filter((p: any) => !p.plannedMonth)
                    .reduce((sum: number, p: any) => sum + (p.price || 0), 0)}
                  renderCard={renderProductCard}
                  isUnplanned
                />
              )}
            </div>
          )}
        </>
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
            collaborators: [...(prev.collaborators || []), c],
          }));
        }}
        onCollaboratorRemoved={(id) => {
          setWishlist((prev: any) => ({
            ...prev,
            collaborators: prev.collaborators.filter((c: any) => c.id !== id),
          }));
        }}
      />
    </>
  );
}
