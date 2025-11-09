import Select from "../Select/Select";
import styles from "./FilterPanel.module.scss";

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
  const handleChange = (key: string, value: string) => {
    onChange({ ...filters, [key]: value });
  };
  return (
    <div className={styles.container}>
      {Object.keys(options).map((key) => (
        <div key={key} className={styles.filterItem}>
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
