"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Card from "@/components/Card/Card";
import AddWishlistProductModal from "../components/wishlistProductModal/WishlistProductModal";
import FilterPanel from "@/components/FilterPanel/FilterPanel";
import Button from "@/components/Button/Button";
import styles from "../Dashboard.module.scss";
import { FiEdit, FiTrash2 } from "react-icons/fi";

interface WishlistProduct {
  id: number;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  plannedMonth?: string;
}

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

  const [filters, setFilters] = useState<{ month: string }>({ month: "All" });

  useEffect(() => {
    fetch("http://localhost:5062/api/wishlists")
      .then((res) => res.json())
      .then((data) => {
        const wishlist = data.find((w: any) => w.id === wishlistId);
        if (wishlist) {
          setWishlistProducts(wishlist.products || []);
        }
      })
      .catch((err) => console.error(err));
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

    const response = await fetch(
      `http://localhost:5062/api/wishlists/${wishlistId}/products/${productId}`,
      { method: "DELETE" }
    );

    if (response.ok) {
      setWishlistProducts((prev) => prev.filter((p) => p.id !== productId));
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

  return (
    <div style={{ padding: "2rem" }}>
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
      <FilterPanel
        filters={filters}
        options={{ month: monthOptions }}
        onChange={setFilters}
      />
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginTop: "1rem",
        }}
      >
        {filteredProducts.map((product) => (
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
                  style={{ cursor: "pointer", color: "#234588" }}
                />
              </>
            }
          />
        ))}
      </div>

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
