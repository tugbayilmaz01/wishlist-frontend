"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiHeart,
  FiZap,
  FiShare2,
  FiTrendingUp,
  FiCalendar,
  FiFolder,
} from "react-icons/fi";
import styles from "./LandingPage.module.scss";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSwitcher from "../../components/LanguageSwitcher/LanguageSwitcher";

export default function LandingPage() {
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(false);

  const features = useMemo(() => [
    {
      title: t("landing.features.categories.title"),
      description: t("landing.features.categories.desc"),
      icon: <FiFolder />,
    },
    {
      title: t("landing.features.planning.title"),
      description: t("landing.features.planning.desc"),
      icon: <FiCalendar />,
    },
    {
      title: t("landing.features.share.title"),
      description: t("landing.features.share.desc"),
      icon: <FiShare2 />,
    },
    {
      title: t("landing.features.trending.title"),
      description: t("landing.features.trending.desc"),
      icon: <FiTrendingUp />,
    },
  ], [t]);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setIsHeroVisible(true), 100);
  }, []);

  if (!mounted) {
    return <div style={{ background: '#fdfaf7', minHeight: '100vh' }} />;
  }

  return (
    <main className={styles.landingContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image src="/logo-horizontal.svg" alt="WishIt" width={140} height={40} priority />
        </div>
        <div className={styles.headerActions}>
          <LanguageSwitcher />
          <Link href="/login" style={{ textDecoration: "none" }}>
            <button className={styles.loginBtn}>{t("common.login")}</button>
          </Link>
          <Link href="/login" style={{ textDecoration: "none" }}>
            <button className={styles.signupBtn}>{t("common.signup")}</button>
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {t("landing.title1")}<span className={styles.gradient}>{t("landing.title2")}</span>{t("landing.title3")}
          </h1>
          <p className={styles.heroSubtitle}>
            {t("landing.subtitle")}
          </p>
          <div className={styles.heroActions}>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <button className={styles.heroCta}>
                {t("landing.getStarted")} <FiArrowRight />
              </button>
            </Link>
          </div>
        </div>

        <div className={styles.heroImageWrapper}>
          <Image 
            src="/assets/hero-lifestyle-collage.png" 
            alt="The Ultimate Wishlist Idea" 
            width={750} 
            height={750} 
            className={`${styles.collageHero} ${isHeroVisible ? styles.visible : ""}`}
            priority
          />
        </div>
      </section>

      <section className={styles.experience}>
        <div className={styles.storyBlock}>
          <div className={styles.storyImage}>
            <Image src="/assets/gift-guide-curation.png" alt="Aesthetic Gift Guides" width={800} height={800} />
          </div>
          <div className={styles.storyText}>
            <span className={styles.tagline}>{t("landing.story1.tagline")}</span>
            <h2>{t("landing.story1.title1")}<span className={styles.gradient}>{t("landing.story1.title2")}</span></h2>
            <p>{t("landing.story1.desc")}</p>
          </div>
        </div>

        <div className={styles.storyBlock}>
          <div className={styles.storyImage}>
            <Image src="/assets/smart-planning-collage.png" alt="Intelligent Organization" width={800} height={800} />
          </div>
          <div className={styles.storyText}>
            <span className={styles.tagline}>{t("landing.story2.tagline")}</span>
            <h2>{t("landing.story2.title1")}<span className={styles.gradient}>{t("landing.story2.title2")}</span></h2>
            <p>{t("landing.story2.desc")}</p>
          </div>
        </div>

        <div className={styles.storyBlock}>
          <div className={styles.storyImage} style={{ filter: 'sepia(0.3) hue-rotate(-15deg) brightness(0.9) contrast(1.1)' }}>
            <Image 
              src="/assets/community-trends-collage.png" 
              alt="Community Trends" 
              width={800} 
              height={800} 
            />
          </div>
          <div className={styles.storyText}>
            <span className={styles.tagline}>{t("landing.story3.tagline")}</span>
            <h2>{t("landing.story3.title1")}<span className={styles.gradient}>{t("landing.story3.title2")}</span></h2>
            <p>{t("landing.story3.desc")}</p>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featureGrid}>
          {features.map((f, idx) => (
            <div key={idx} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2>{t("landing.readyToStart")}</h2>
        <p>{t("landing.ctaSubtitle")}</p>
        <Link href="/login" style={{ textDecoration: "none" }}>
          <button className={styles.heroCta} style={{ margin: '0 auto' }}>
            {t("landing.createYourWishlist")} <FiArrowRight />
          </button>
        </Link>
      </section>

      <footer className={styles.footer}>
        <span>© 2025 WishIt. {t("common.madeWith")}</span>
        <FiHeart size={13} style={{ color: "#ff425d", margin: "0 4px" }} />
        <span>{t("common.forWishlisters")}</span>
      </footer>
    </main>
  );
}
