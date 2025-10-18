import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import styles from "./Sidebar.module.scss";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

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
      </aside>
    </>
  );
}
