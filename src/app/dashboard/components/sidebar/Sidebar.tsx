import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import styles from "./Sidebar.module.scss";
import AddWishlistModal from "../addWishlistModal/AddWishlistModal";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <aside
        className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}
      >
        <div className={styles.sidebarWrapper}>
          <button
            className={styles.toggleBtn}
            onClick={() => setCollapsed((prev) => !prev)}
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>

          <h2>
            <img
              src="/assets/heart.png"
              alt="Heart"
              className={styles.logoIcon}
            />
            {!collapsed && <span>WishIt.</span>}
          </h2>
        </div>

        <nav>
          <a href="/dashboard">Dashboard</a>
          <button
            className={styles.addWishlistBtn}
            onClick={() => setIsModalOpen(true)}
          >
            Add Wishlist
          </button>
          <a href="/dashboard/profile">Profile</a>
        </nav>
      </aside>

      <AddWishlistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
