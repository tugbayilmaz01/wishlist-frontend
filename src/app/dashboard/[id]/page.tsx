"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Card from "@/components/Card";
import AddWishlistProductModal from "../components/addWishlistProductModal/AddWishlistProductModal";

interface WishlistProduct {
  id: number;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

export default function WishlistDetailPage() {
  const params = useParams();
  const wishlistId = Number(params.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState<WishlistProduct[]>(
    []
  );

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

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Wishlist Detail</h1>
      <button onClick={() => setIsModalOpen(true)}>Add Product</button>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginTop: "1rem",
        }}
      >
        {wishlistProducts.map((product) => (
          <Card
            key={product.id}
            title={product.name}
            description={product.description}
          />
        ))}
      </div>

      <AddWishlistProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        wishlistId={wishlistId}
        onAddProduct={(product) =>
          setWishlistProducts((prev) => [...prev, product])
        }
      />
    </div>
  );
}
