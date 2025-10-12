import Sidebar from "./components/sidebar/Sidebar";
import ProductCard from "./components/productCard/ProductCard";
import styles from "./Dashboard.module.scss";

interface Product {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
  description?: string;
}

const mockProducts: Product[] = [
  { id: 1, name: "Headphones", price: "$50", imageUrl: "/headphones.jpg" },
  { id: 2, name: "Bag", price: "$120", imageUrl: "/bag.jpg" },
  { id: 3, name: "Coat", price: "$200", imageUrl: "/coat.jpg" },
  { id: 4, name: "Shoes", price: "$80", imageUrl: "/shoes.jpg" },
];

export default function DashboardPage() {
  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <main className={styles.dashboardMain}>
        <h1>Wishlist</h1>
        <div className={styles.productsGrid}>
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}
