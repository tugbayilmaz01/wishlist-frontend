"use client";

import { FiLogOut, FiUser, FiChevronDown } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import styles from "./Navbar.module.scss";
import { api } from "@/utils/api";
import { useLanguage } from "../../context/LanguageContext";
import { useUser } from "../../context/UserContext";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";

export default function Navbar() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const goToProfile = () => {
    setIsDropdownOpen(false);
    router.push("/dashboard/profile");
  };

  return (
    <nav className={styles.navbar}>
      <Link href="/dashboard" className={styles.logo}>
        <Image
          src="/logo-horizontal.svg"
          alt="WishIt"
          width={140}
          height={40}
          priority
        />
      </Link>

      <div className={styles.navActions}>
        <LanguageSwitcher />
        
        <div className={styles.userMenu} ref={dropdownRef}>
          <div 
            className={`${styles.userToggle} ${isDropdownOpen ? styles.active : ""}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className={styles.avatarWrapper}>
              {user?.avatar ? (
                user.avatar.startsWith("/") ? (
                  <img src={user.avatar} alt="Avatar" />
                ) : (
                  <span>{user.avatar}</span>
                )
              ) : (
                <FiUser />
              )}
            </div>
            <FiChevronDown className={styles.chevron} />
          </div>

          {isDropdownOpen && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} onClick={goToProfile}>
                <FiUser /> <span>{t('profile.title')}</span>
              </button>
              <div className={styles.divider} />
              <button className={`${styles.dropdownItem} ${styles.logout}`} onClick={handleLogout}>
                <FiLogOut /> <span>{t('common.logout')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
