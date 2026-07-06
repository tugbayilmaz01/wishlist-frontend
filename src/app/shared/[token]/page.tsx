"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import Card from "@/components/Card/Card";
import styles from "@/app/dashboard/Dashboard.module.scss";
import { api } from "@/utils/api";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import FilterPanel from "@/components/FilterPanel/FilterPanel";
import { useLanguage } from "@/context/LanguageContext";
import { FiGrid, FiCalendar, FiChevronDown, FiTag, FiExternalLink, FiUser } from "react-icons/fi";
import { TbCurrencyLira } from "react-icons/tb";

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

interface Wishlist {
  id: number;
  name: string;
  products: WishlistProduct[];
  owner?: any;
  collaborators?: any[];
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
  const [filters, setFilters] = useState<{ month: string; category: string; status: string }>({ 
    month: "All", 
    category: "All",
    status: "All"
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
        (filters.category === "All" || p.category === filters.category) &&
        (filters.status === "All" || 
          (filters.status === "Purchased" && p.isPurchased) || 
          (filters.status === "Wishlist" && !p.isPurchased))
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
      isPurchased={product.isPurchased}
      actions={
        product.productUrl ? (
          <FiExternalLink
            size={18}
            onClick={(e) => {
              e.stopPropagation();
              window.open(product.productUrl, "_blank");
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
    <div className={styles.dashboardMain} style={{ padding: '1.25rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <img src="/logo-horizontal.svg" alt="WishIt" style={{ height: '36px', cursor: 'pointer' }} onClick={() => window.location.href = '/landing'} />
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => window.location.href = '/login'} style={{ background: 'transparent', border: '2px solid #ff425d', color: '#ff425d', padding: '8px 20px', borderRadius: '24px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>{t("common.login")}</button>
          <button onClick={() => window.location.href = '/login?mode=signup'} style={{ background: '#ff425d', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '24px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>{t("common.signup")}</button>
        </div>
      </div>

      <div className={styles.header} style={{ marginTop: 0, marginBottom: '0.75rem' }}>
        <div className={styles.titleArea}>
          <div className={styles.titleGroup}>
            <h1>{wishlist.name}</h1>
            <div className={styles.titleMeta}>
              <span><TbCurrencyLira size={14} style={{ marginBottom: '-2px' }} />{totalPrice.toLocaleString('tr-TR')} TL</span>
              <span className={styles.dot}>·</span>
              <span><FiTag size={12} />{filteredProducts.length} {t('common.items')}</span>
            </div>
            {wishlist.owner && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '10px',
                padding: '6px 14px',
                background: 'rgba(255, 66, 93, 0.07)',
                borderRadius: '20px',
                width: 'fit-content',
                fontSize: '0.82rem',
                color: '#9d8a94',
                fontWeight: 500,
              }}>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff425d, #ff8fa3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#fff',
                  flexShrink: 0,
                  overflow: 'hidden',
                }}>
                  {wishlist.owner.avatar
                    ? <img src={wishlist.owner.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : (wishlist.owner.name ? wishlist.owner.name[0].toUpperCase() : <FiUser size={12} />)
                  }
                </div>
                <span>
                  {t('common.sharedBy')}{' '}
                  <strong style={{ color: '#6b4f5c' }}>
                    {wishlist.owner.name || wishlist.owner.email}
                  </strong>
                </span>
              </div>
            )}
          </div>
        </div>
        <div className={styles.actionArea}>
          <div className={styles.avatarStack}>
            {wishlist.owner && (
              <div className={`${styles.avatar} ${styles.ownerAvatar}`} title={wishlist.owner.name || wishlist.owner.email}>
                {wishlist.owner.avatar
                  ? <img src={wishlist.owner.avatar} alt="" />
                  : (wishlist.owner.name ? <span>{wishlist.owner.name[0].toUpperCase()}</span> : <FiUser size={16} />)
                }
                <div className={styles.ownerBadge}>★</div>
              </div>
            )}
            {wishlist.collaborators?.map((c: any, i: number) => (
              <div key={i} className={styles.avatar} title={c.name || c.email}>
                {c.avatar
                  ? <img src={c.avatar} alt="" />
                  : (c.name ? <span>{c.name[0].toUpperCase()}</span> : <FiUser size={16} />)
                }
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.controlsRow} style={{ marginBottom: '1rem', paddingBottom: '0.75rem' }}>
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
              category: categoryOptions,
              status: ["Wishlist", "Purchased"]
            }}
            onChange={(newFilters) =>
              setFilters((prev) => ({ ...prev, ...newFilters as any }))
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
