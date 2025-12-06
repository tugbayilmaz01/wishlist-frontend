"use client";

import Card from "@/components/Card/Card";
import WishlistCategoryModal from "./components/wishlistCategoryModal/WishlistCategoryModal";
import styles from "./Dashboard.module.scss";
import { api } from "@/utils/api";
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
      const data: Wishlist[] = await api.get("/wishlists");

      setWishlists(data);
    } catch (err) {
      console.error("Dashboard failed to load wishlists:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWishlist = async (id: number) => {
    if (!confirm("Are you sure you want to delete this wishlist category?"))
      return;
    try {
      await api.delete(`/wishlists/${id}`);

      setWishlists((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      console.error(`Dashboard failed to delete wishlist ${id}:`, err);
    }
  };

  const handleSaveWishList = async (data: {
    id?: number;
    name: string;
    description?: string;
  }) => {
    try {
      if (data.id) {
        await api.put(`/wishlists/${data.id}`, {
          name: data.name,
          description: data.description,
        });
      } else {
        await api.post("/wishlists", {
          name: data.name,
          description: data.description,
        });
      }

      loadWishlists();
      setIsModalOpen(false);
      setEditingWishlist(null);
    } catch (err) {
      console.error(`Dashboard failed to save wishlist:`, err);
      alert("Failed to save wishlist");
    }
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
        ) : wishlists.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No wishlists yet.</p>
          </div>
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
