"use client";

import Sidebar from "@/components/Sidebar/Sidebar";
import styles from "./Dashboard.module.scss";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <main className={styles.dashboardMain}>{children}</main>
    </div>
  );
}
