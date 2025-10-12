import styles from "./ProductCard.module.scss";

interface Product {
  id: number;
  name: string;
  price: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className={styles.productCard}>
      <p className={styles.productName}>{product.name}</p>
      <p className={styles.productPrice}>{product.price}</p>
      {product.description && (
        <p className={styles.productDesc}>{product.description}</p>
      )}
    </div>
  );
}
