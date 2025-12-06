"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Card from "@/components/Card/Card";
import AddWishlistProductModal from "../components/wishlistProductModal/WishlistProductModal";
import FilterPanel from "@/components/FilterPanel/FilterPanel";
import Button from "@/components/Button/Button";
import styles from "../Dashboard.module.scss";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { api } from "@/utils/api";

interface WishlistProduct {
  id: number;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  plannedMonth?: string;
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

export default function WishlistDetailPage() {
  const params = useParams();
  const wishlistId = Number(params.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState<WishlistProduct[]>(
    []
  );
  const [editingProduct, setEditingProduct] = useState<WishlistProduct | null>(
    null
  );

  const [view, setView] = useState<"list" | "month">("list");
  const [filters, setFilters] = useState<{ month: string }>({ month: "All" });

  useEffect(() => {
    api
      .get("/wishlists")
      .then((data: any) => {
        const wishlist = data.find((w: any) => w.id === wishlistId);
        if (wishlist) {
          if (wishlist.products && wishlist.products.length > 0) {
          }
          setWishlistProducts(wishlist.products || []);
        } else {
          console.warn(`WishlistDetail Wishlist ID ${wishlistId} not found!`);
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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

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
      (p) => filters.month === "All" || p.plannedMonth === filters.month
    );
  }, [wishlistProducts, filters]);

  const monthOptions = Array.from(
    new Set(wishlistProducts.map((p) => p.plannedMonth).filter(Boolean))
  ) as string[];

  const renderProductCard = (product: WishlistProduct) => (
    <Card
      key={product.id}
      title={product.name}
      description={product.description}
      imageUrl={product.imageUrl}
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
    <div className={styles.dashboardMain}>
      <div className={styles.header}>
        <h1>Wishlist Detail</h1>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
        >
          Add Product
        </Button>
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

      <AddWishlistProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        wishlistId={wishlistId}
        product={editingProduct}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
      />
    </div>
  );
}
