"use client";

import Card from "@/components/Card/Card";
import WishlistCategoryModal from "./components/wishlistCategoryModal/WishlistCategoryModal";
import styles from "./Dashboard.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button/Button";
import { FiEdit, FiTrash2 } from "react-icons/fi";

interface Wishlist {
  id: number;
  name: string;
  description?: string;
}

export default function DashboardPage() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWishlist, setEditingWishlist] = useState<Wishlist | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadWishlists();
  }, []);

  const loadWishlists = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5062/api/wishlists");
      const data: Wishlist[] = await res.json();
      setWishlists(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWishlist = async (id: number) => {
    if (!confirm("Are you sure you want to delete this wishlist category?"))
      return;

    try {
      await fetch(`http://localhost:5062/api/wishlists/${id}`, {
        method: "DELETE",
      });
      setWishlists((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveWishList = async (data: {
    id?: number;
    name: string;
    description?: string;
  }) => {
    if (data.id) {
      await fetch(`http://localhost:5062/api/wishlists/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
        }),
      });
    } else {
      await fetch("http://localhost:5062/api/wishlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
        }),
      });
    }

    loadWishlists();
    setIsModalOpen(false);
    setEditingWishlist(null);
  };

  const openEditModal = (wishlist: Wishlist) => {
    setEditingWishlist(wishlist);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.dashboardContainer}>
      <main className={styles.dashboardMain}>
        <div className={styles.header}>
          <h1>Wishlists</h1>
          <Button
            onClick={() => {
              setEditingWishlist(null);
              setIsModalOpen(true);
            }}
          >
            Add New Wishlist Category
          </Button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className={styles.wishlistGrid}>
            {wishlists.map((wishlist) => (
              <Card
                key={wishlist.id}
                title={wishlist.name}
                description={wishlist.description}
                onClick={() => router.push(`/dashboard/${wishlist.id}`)}
                actions={
                  <>
                    <FiEdit
                      size={18}
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(wishlist);
                      }}
                      style={{ cursor: "pointer" }}
                    />
                    <FiTrash2
                      size={18}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWishlist(wishlist.id);
                      }}
                      style={{ cursor: "pointer", color: "#234588" }}
                    />
                  </>
                }
              />
            ))}
          </div>
        )}
      </main>

      <WishlistCategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingWishlist(null);
        }}
        initialData={editingWishlist || undefined}
        onSave={handleSaveWishList}
      />
    </div>
  );
}
