"use client";

import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import styles from "./Sidebar.module.scss";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.sidebarWrapper}>
        <button
          className={styles.toggleBtn}
          onClick={() => setCollapsed((prev) => !prev)}
        >
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
        <h2>WishIt.</h2>
      </div>
      <nav>
        <a href="/dashboard">Dashboard</a>
        <a href="/dashboard/wishlist/new">Add Wishlist</a>
        <a href="/dashboard/profile">Profile</a>
      </nav>
    </aside>
  );
}
