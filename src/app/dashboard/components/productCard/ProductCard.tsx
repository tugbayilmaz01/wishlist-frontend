import styles from "./ProductCard.module.scss";

interface Product {
  id: number;
  name: string;
  price: string;
  description?: string;
  imageUrl?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imagePath = product.imageUrl
    ? `/assets${product.imageUrl}`
    : "/assets/default.png";

  return (
    <div className={styles.productCard}>
      <img
        src={imagePath}
        alt={product.name}
        className={styles.productImage}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/assets/default.png";
        }}
      />
      <p className={styles.productName}>{product.name}</p>
      <p className={styles.productPrice}>{product.price}</p>
      {product.description && (
        <p className={styles.productDesc}>{product.description}</p>
      )}
    </div>
  );
}
