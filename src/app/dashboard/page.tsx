"use client";

import Card from "@/components/Card";
import AddWishlistCategoryModal from "./components/addWishlistCategoryModal/AddWishlistCategoryModal";
import styles from "./Dashboard.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Wishlist {
  id: number;
  name: string;
  description?: string;
}

export default function DashboardPage() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:5062/api/wishlists")
      .then((res) => res.json())
      .then((data: Wishlist[]) => {
        setWishlists(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <main className={styles.dashboardMain}>
        <div className={styles.header}>
          <h1>Wishlists</h1>
          <button
            className={styles.addWishlistBtn}
            onClick={() => setIsModalOpen(true)}
          >
            Add New Wishlist Category
          </button>
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
              />
            ))}
          </div>
        )}
      </main>

      <AddWishlistCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
