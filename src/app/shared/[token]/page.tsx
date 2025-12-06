"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Card from "@/components/Card/Card";
import Button from "@/components/Button/Button";
import styles from "@/app/dashboard/Dashboard.module.scss";
import { api } from "@/utils/api";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import FilterPanel from "@/components/FilterPanel/FilterPanel";

interface WishlistProduct {
  id: number;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  plannedMonth?: string;
}

interface Wishlist {
  id: number;
  name: string;
  description: string;
  products: WishlistProduct[];
}

export default function SharedWishlistPage() {
  const params = useParams();
  const token = params.token as string;

  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState<"list" | "month">("list");
  const [filters, setFilters] = useState<{ month: string }>({ month: "All" });

  useEffect(() => {
    if (token) {
      loadSharedWishlist();
    }
  }, [token]);

  const loadSharedWishlist = async () => {
    setLoading(true);
    try {
      const data: any = await api.get(`/wishlists/shared/${token}`);
      setWishlist(data);
    } catch (err) {
      console.error("Failed to load shared wishlist:", err);
      setError("This wishlist does not exist or has been removed.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!wishlist) return [];
    return wishlist.products.filter(
      (p) => filters.month === "All" || p.plannedMonth === filters.month
    );
  }, [wishlist, filters]);

  const monthOptions = useMemo(() => {
    if (!wishlist) return [];
    return Array.from(
      new Set(wishlist.products.map((p) => p.plannedMonth).filter(Boolean))
    ) as string[];
  }, [wishlist]);

  const renderProductCard = (product: WishlistProduct) => (
    <Card
      key={product.id}
      title={product.name}
      description={product.description}
      imageUrl={product.imageUrl}
    />
  );

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

  if (loading)
    return (
      <div style={{ marginTop: "50px" }}>
        <LoadingSpinner showText={true} />
      </div>
    );
  if (error) return <div className={styles.emptyState}>{error}</div>;
  if (!wishlist) return null;

  return (
    <div className={styles.dashboardMain}>
      <div className={styles.header}>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <h1>{wishlist.name}</h1>
          <p style={{ color: "#666" }}>{wishlist.description}</p>
        </div>
      </div>

      <div className={styles.headerControls}>
        <div className={styles.viewToggle}>
          <Button
            variant="primary"
            active={view === "list"}
            onClick={() => setView("list")}
          >
            List View
          </Button>
          <Button
            variant="primary"
            active={view === "month"}
            onClick={() => setView("month")}
          >
            Monthly View
          </Button>
        </div>

        <div className={styles.filterPanelWrapper}>
          <FilterPanel
            filters={filters}
            options={{ month: monthOptions }}
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

              const totalPrice = productsOfMonth.reduce(
                (sum, p) => sum + (p.price || 0),
                0
              );
              return (
                <div key={month} className={styles.monthColumn}>
                  <h3>
                    {month}{" "}
                    <span
                      style={{
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        color: "#555",
                      }}
                    >
                      (${totalPrice.toFixed(2)})
                    </span>
                  </h3>
                  <div className={styles.monthProducts}>
                    {productsOfMonth.map(renderProductCard)}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
