import Select from "../Select/Select";
import styles from "./FilterPanel.module.scss";
import { useLanguage } from "@/context/LanguageContext";
import { FiCalendar, FiTag } from "react-icons/fi";

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
  return (
    <div className={styles.container}>
      {Object.keys(options).map((key) => (
        <div key={key} className={styles.filterItem}>
          <span className={styles.label} title={key === "month" ? t("wishlistDetail.plannedMonth") : t("wishlistDetail.category")}>
            {key === "month" ? <FiCalendar size={18} /> : <FiTag size={18} />}
          </span>
          <Select
            options={["All", ...options[key]]}
            value={filters[key] || "All"}
            onChange={(value) => handleChange(key, value)}
            placeholder={key}
          ></Select>
        </div>
      ))}
    </div>
  );
}
