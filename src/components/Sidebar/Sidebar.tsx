import { useState } from "react";
import Image from "next/image";
import {
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import styles from "./Sidebar.module.scss";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const goToProfile = () => {
    window.location.href = "/profile";
  };

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

          <div className={styles.logo}>
            {!collapsed && (
              <Image
                src="/logo-horizontal.svg"
                alt="WishIt"
                width={130}
                height={36}
                priority
              />
            )}
          </div>
        </div>

        {!collapsed && (
          <div className={styles.sidebarButtons}>
            <button className={styles.sidebarBtn} onClick={goToProfile}>
              <FiUser /> <span>Profile</span>
            </button>
            <button className={styles.sidebarBtn} onClick={handleLogout}>
              <FiLogOut /> <span>Log Out</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
