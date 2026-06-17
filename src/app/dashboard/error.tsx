"use client";

import { useEffect } from "react";
import Button from "@/components/Button/Button";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '2rem',
      backgroundColor: '#fdfaf7',
      borderRadius: '24px',
      margin: '2rem'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        backgroundColor: '#fff0f3',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ff425d',
        marginBottom: '1.5rem'
      }}>
        <FiAlertTriangle size={40} />
      </div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38161f', marginBottom: '0.5rem' }}>
        {t("common.errorTitle")}
      </h2>
      <p style={{ color: '#b0929a', marginBottom: '2rem', maxWidth: '300px' }}>
        {t("common.errorDesc")}
      </p>
      <Button onClick={() => reset()} startIcon={<FiRefreshCw />}>
        {t("common.tryAgain")}
      </Button>
    </div>
  );
}
