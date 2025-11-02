"use client";

import styles from "./LandingPage.module.scss";

interface Feature {
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    title: "Multiple Wishlist Categories",
    description:
      "Create different wishlists for files, occasions, or interests.",
  },
  {
    title: "Add & Remove Products",
    description:
      "Easily manage products in your wishlist, add or remove anytime.",
  },
  {
    title: "Monthly Planning",
    description: "Organize your purchases by month and track what to buy.",
  },
  {
    title: "Social Influence",
    description:
      "Comment on other users’ wishlists and influence their choices.",
  },
  {
    title: "Trending Products",
    description:
      "Discover popular products that many users are adding to their wishlists.",
  },
];

export default function LandingPage() {
  return (
    <main className={styles.landingContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>Wishlist</div>
        <nav>
          <a href="#features" data-scroll>
            Features
          </a>
          <a href="#footer" data-scroll>
            Footer
          </a>
        </nav>
      </header>

      <section className={styles.wishlist}>
        <div className={styles.wishlistText}>
          <h1>Your Wishlist, Your Style</h1>
          <p>
            Track, share, and discover the products you love. Keep your wishlist
            organized and see what's trending.
          </p>
          <a href="/dashboard" className={styles.ctaButton}>
            Get Started
          </a>
        </div>
      </section>

      <section id="features" className={styles.features}>
        <h2>Features & Advantages</h2>
        <div className={styles.featureList}>
          {features.map((f, idx) => (
            <div key={idx} className={styles.featureItem}>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer id="footer" className={styles.footer}>
        &copy; 2025 Fashion Wishlist. All rights reserved. ♥
      </footer>
    </main>
  );
}
