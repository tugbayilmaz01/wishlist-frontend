"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Card from "@/components/Card/Card";
import styles from "@/app/dashboard/Dashboard.module.scss";
import { api } from "@/utils/api";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import FilterPanel from "@/components/FilterPanel/FilterPanel";
import { useLanguage } from "@/context/LanguageContext";
import { FiGrid, FiCalendar, FiChevronDown, FiTag, FiExternalLink } from "react-icons/fi";
import { TbCurrencyLira } from "react-icons/tb";

interface WishlistProduct {
  id: number;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  plannedMonth?: string;
  category?: string;
}

interface Wishlist {
  id: number;
  name: string;
  description: string;
  products: WishlistProduct[];
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

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

export default function SharedWishlistPage() {
  const { t } = useLanguage();
  const params = useParams();
  const token = params.token as string;

  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState<"list" | "month">("list");
  const [filters, setFilters] = useState<{ month: string; category: string }>({ 
    month: "All", 
    category: "All" 
  });

  const loadSharedWishlist = React.useCallback(async () => {
    setLoading(true);
    try {
      const data: any = await api.get(`/wishlists/shared/${token}`);
      setWishlist(data);
    } catch (err) {
      console.error("Failed to load shared wishlist:", err);
      setError(t('wishlistDetail.emptyTitle'));
    } finally {
      setLoading(false);
    }
  }, [token, t]);

  useEffect(() => {
    if (token) {
      loadSharedWishlist();
    }
  }, [token, loadSharedWishlist]);

  const filteredProducts = useMemo(() => {
    if (!wishlist) return [];
    return (wishlist.products || []).filter(
      (p) => 
        (filters.month === "All" || p.plannedMonth === filters.month) &&
        (filters.category === "All" || p.category === filters.category)
    );
  }, [wishlist, filters]);

  const monthOptions = useMemo(() => {
    if (!wishlist) return [];
    return Array.from(
      new Set(wishlist.products.map((p) => p.plannedMonth).filter(Boolean))
    ) as string[];
  }, [wishlist]);

  const categoryOptions = useMemo(() => {
    if (!wishlist) return [];
    return Array.from(
      new Set(wishlist.products.map((p) => p.category).filter(Boolean))
    ) as string[];
  }, [wishlist]);

  const totalPrice = useMemo(() => {
    return filteredProducts.reduce((sum, p) => sum + (p.price || 0), 0);
  }, [filteredProducts]);

  const renderProductCard = (product: WishlistProduct) => (
    <Card
      key={product.id}
      title={product.name}
      subtitle={product.price ? `${product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL` : ""}
      imageUrl={product.imageUrl}
      tag={product.category}
      actions={
        product.url ? (
          <FiExternalLink
            size={18}
            onClick={(e) => {
              e.stopPropagation();
              window.open(product.url, "_blank");
            }}
            style={{ cursor: "pointer", color: "#666" }}
          />
        ) : null
      }
    />
  );

  if (loading) return <div className={styles.loadingWrapper}><LoadingSpinner /></div>;
  if (error || !wishlist) return <div className={styles.emptyState}><h2>{error || "Wishlist not found"}</h2></div>;

  return (
    <div className={styles.dashboardMain}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.titleGroup}>
            <h1>{wishlist.name}</h1>
            <div className={styles.titleMeta}>
              <span><TbCurrencyLira size={14} style={{ marginBottom: '-2px' }} />{totalPrice.toLocaleString('tr-TR')} TL</span>
              <span className={styles.dot}>·</span>
              <span><FiTag size={12} />{filteredProducts.length} {t('common.items')}</span>
            </div>
          </div>
        </div>
      </div>

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

      {view === "list" ? (
        <div className={styles.wishlistGrid}>
          {filteredProducts.map(renderProductCard)}
        </div>
      ) : !filteredProducts.some(p => p.plannedMonth) ? (
        <div className={styles.monthlyEmptyState}>
          <div className={styles.monthlyEmptyIcon}><FiCalendar size={36} /></div>
          <h3>{t("wishlistDetail.noMonthsAssigned")}</h3>
          <button className={styles.backBtn} onClick={() => setView("list")}>
            {t("wishlistDetail.backToList")}
          </button>
        </div>
      ) : (
        <div className={styles.monthlyAccordion}>
          {months
            .filter(month => filteredProducts.some(p => p.plannedMonth === month))
            .map(month => {
              const productsOfMonth = filteredProducts.filter(p => p.plannedMonth === month);
              const totalPriceMonth = productsOfMonth.reduce((sum, p) => sum + (p.price || 0), 0);
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
          {filteredProducts.filter(p => !p.plannedMonth).length > 0 && (
            <MonthSection
              month={t("wishlistDetail.unplanned")}
              products={filteredProducts.filter(p => !p.plannedMonth)}
              total={filteredProducts.filter(p => !p.plannedMonth).reduce((sum, p) => sum + (p.price || 0), 0)}
              renderCard={renderProductCard}
              isUnplanned
            />
          )}
        </div>
      )}
    </div>
  );
}
