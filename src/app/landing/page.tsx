"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button/Button";
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
      "Comment on other users' wishlists and influence their choices.",
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
        <div className={styles.logo}>
          <Image
            src="/logo-horizontal.svg"
            alt="WishIt"
            width={150}
            height={42}
            priority
          />
        </div>
        <Link href="/login">
          <Button variant="secondary">Login</Button>
        </Link>
      </header>

      <section className={styles.wishlist}>
        <div className={styles.wishlistText}>
          <div className={styles.heroIcon}>
            <Image
              src="/icon.svg"
              alt="Heart"
              width={60}
              height={60}
              className={styles.floatingHeart}
            />
          </div>
          <h1>Your Wishlist, Your Style</h1>
          <p>
            Track, share, and discover the products you love. Keep your wishlist
            organized and see what's trending.
          </p>
          <a href="/login" className={styles.ctaButton}>
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
        &copy; 2025 Fashion Wishlist. All rights reserved.{" "}
        <span className={styles.footerHeart}>
          <Image src="/icon.svg" alt="Heart" width={16} height={16} />
        </span>
      </footer>
    </main>
  );
}
