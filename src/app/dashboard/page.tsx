"use client";

import Card from "@/components/Card/Card";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import WishlistCategoryModal from "./components/wishlistCategoryModal/WishlistCategoryModal";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import styles from "./Dashboard.module.scss";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button/Button";
import { FiEdit, FiTrash2, FiHeart } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";

interface Wishlist {
  id: number;
  name: string;
  description?: string;
  products?: any[];
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user } = useUser();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [wishlistToDelete, setWishlistToDelete] = useState<number | null>(null);
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
    setWishlistToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!wishlistToDelete) return;
    try {
      await api.delete(`/wishlists/${wishlistToDelete}`);
      setWishlists((prev) => prev.filter((w) => w.id !== wishlistToDelete));
      setWishlistToDelete(null);
      setIsConfirmOpen(false);
    } catch (err) {
      console.error(`Dashboard failed to delete wishlist ${wishlistToDelete}:`, err);
    }
  };

  const handleSaveWishList = async (data: {
    id?: number;
    name: string;
  }) => {
    try {
      if (data.id) {
        await api.put(`/wishlists/${data.id}`, {
          id: data.id,
          name: data.name,
          description: "",
        });
      } else {
        await api.post("/wishlists", {
          name: data.name,
          description: "",
        });
      }

      loadWishlists();
      setIsModalOpen(false);
      setEditingWishlist(null);
    } catch (err) {
      console.error(`Dashboard failed to save wishlist:`, err);
    }
  };

  const openEditModal = (wishlist: Wishlist) => {
    setEditingWishlist(wishlist);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.welcomeText}>
          <h1>{t('dashboard.hi')}, {user?.name || "there"}! ✨</h1>
          <p>{t('dashboard.subtitle')}</p>
        </div>
        <div className={styles.actions}>
          <Button
            onClick={() => {
              setEditingWishlist(null);
              setIsModalOpen(true);
            }}
          >
            + {t('dashboard.createNew')}
          </Button>
        </div>
      </div>

      {loading ? (
        <div style={{ marginTop: "3rem" }}>
          <LoadingSpinner showText={false} />
        </div>
      ) : wishlists.length === 0 ? (
        <div className={styles.emptyState}>
          <p>{t('dashboard.noWishlists')}</p>
        </div>
      ) : (
        <div className={styles.wishlistGrid}>
          {wishlists.map((wishlist, index) => (
            <Card
              key={wishlist.id}
              index={index}
              title={wishlist.name}
              subtitle={`${wishlist.products?.length || 0} ${t('common.items')}`}
              icon={<FiHeart size={32} />}
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
                    style={{ cursor: "pointer", color: "#FF425D" }}
                  />
                </>
              }
            />
          ))}
        </div>
      )}

      <WishlistCategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingWishlist(null);
        }}
        initialData={editingWishlist || undefined}
        onSave={handleSaveWishList}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title={t("common.deleteConfirm")}
        message={t("common.deleteWishlistDesc")}
      />
    </>
  );
}
