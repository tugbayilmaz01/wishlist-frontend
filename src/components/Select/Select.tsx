import { useEffect, useRef, useState } from "react";
import styles from "./Select.module.scss";
import { FiChevronDown } from "react-icons/fi";

interface SelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  customLabels?: Record<string, string>;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder,
  icon,
  customLabels,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const getLabel = (option: string) => {
    if (customLabels && customLabels[option]) {
      return customLabels[option];
    }
    return option;
  };

  return (
    <div className={styles.selectContainer} ref={containerRef}>
      <div className={styles.selected} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.valueGroup}>
          {icon && <span className={styles.icon}>{icon}</span>}
          {getLabel(value) || placeholder || "Select"}
        </div>
        <FiChevronDown
          className={`${styles.arrow} ${isOpen ? styles.open : ""}`}
        />
      </div>
      {isOpen && (
        <ul className={styles.options}>
          {options.map((option) => (
            <li
              key={option}
              className={value === option ? styles.active : ""}
              onClick={() => handleSelect(option)}
            >
              {getLabel(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
