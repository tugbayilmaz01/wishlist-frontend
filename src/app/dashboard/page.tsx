"use client";

import Sidebar from "./components/sidebar/Sidebar";
import ProductCard from "./components/productCard/ProductCard";
import styles from "./Dashboard.module.scss";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
  description?: string;
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5062/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <main className={styles.dashboardMain}>
        <h1>Wishlist</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className={styles.productsGrid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
