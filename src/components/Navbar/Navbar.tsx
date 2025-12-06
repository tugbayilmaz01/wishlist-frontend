import { FiLogOut, FiUser } from "react-icons/fi";
import Image from "next/image";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const goToProfile = () => {
    window.location.href = "/profile";
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Image
          src="/logo-horizontal.svg"
          alt="WishIt"
          width={150}
          height={42}
          priority
        />
      </div>

      <div className={styles.navButtons}>
        <button className={styles.navBtn} onClick={goToProfile}>
          <FiUser /> <span>Profile</span>
        </button>
        <button className={styles.navBtn} onClick={handleLogout}>
          <FiLogOut /> <span>Log Out</span>
        </button>
      </div>
    </nav>
  );
}
