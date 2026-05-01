"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar/Navbar";
import styles from "./Dashboard.module.scss";

import { UserProvider } from "@/context/UserContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <UserProvider>
      <div className={styles.dashboardContainer}>
        <Navbar />
        <div className={styles.contentWrapper}>
          <main className={styles.dashboardMain}>{children}</main>
        </div>
      </div>
    </UserProvider>
  );
}
