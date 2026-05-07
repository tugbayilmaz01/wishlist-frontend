import React, { useEffect, useRef, useState } from "react";
import Select from "../Select/Select";
import styles from "./FilterPanel.module.scss";
import { useLanguage } from "@/context/LanguageContext";
import { FiCalendar, FiTag, FiCheckCircle, FiChevronDown } from "react-icons/fi";

interface FilterPanelProps {
  filters: Record<string, string>;
  options: Record<string, string[]>;
  onChange: (filters: Record<string, string>) => void;
}

export default function FilterPanel({
  filters,
  options,
  onChange,
}: FilterPanelProps) {
  const { t } = useLanguage();
  const handleChange = (key: string, value: string) => {
    onChange({ ...filters, [key]: value });
  };
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeCount = Object.values(filters).filter(v => v !== "All").length;

  return (
    <div className={styles.container} ref={containerRef}>
      <button 
        className={`${styles.filterToggle} ${activeCount > 0 ? styles.hasFilters : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.toggleLeft}>
          <div className={styles.iconWrapper}>
            {activeCount > 0 ? <FiCheckCircle /> : <FiTag />}
          </div>
          <span>{t("wishlistDetail.filterStatus.all")}</span>
        </div>
        {activeCount > 0 && <span className={styles.countBadge}>{activeCount}</span>}
        <FiChevronDown className={`${styles.chevron} ${isOpen ? styles.open : ""}`} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {Object.keys(options).map((key) => (
            <div key={key} className={styles.dropdownSection}>
              <label className={styles.sectionLabel}>
                {key === "month" ? <FiCalendar size={14} /> : 
                 key === "category" ? <FiTag size={14} /> : 
                 <FiCheckCircle size={14} />}
                {key === "month" ? t("wishlistDetail.plannedMonth") : 
                 key === "category" ? t("wishlistDetail.category") : 
                 t("wishlistDetail.filterStatus.all")}
              </label>
              <Select
                options={["All", ...options[key]]}
                value={filters[key] || "All"}
                onChange={(value) => handleChange(key, value)}
                placeholder={key}
                customLabels={key === "status" ? {
                  "All": t("wishlistDetail.filterStatus.all"),
                  "Wishlist": t("wishlistDetail.filterStatus.wishlist"),
                  "Purchased": t("wishlistDetail.filterStatus.purchased")
                } : (key === "month" && filters[key] === "All" ? { "All": t("wishlistDetail.filterStatus.all") } : 
                     (key === "category" && filters[key] === "All" ? { "All": t("wishlistDetail.filterStatus.all") } : undefined))}
              ></Select>
            </div>
          ))}
          
          {activeCount > 0 && (
            <button 
              className={styles.clearBtn}
              onClick={() => {
                const cleared = {};
                Object.keys(options).forEach(k => cleared[k] = "All");
                onChange(cleared);
                setIsOpen(false);
              }}
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
