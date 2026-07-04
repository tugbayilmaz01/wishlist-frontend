"use client";

import Card from "@/components/Card/Card";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import WishlistCategoryModal from "./components/wishlistCategoryModal/WishlistCategoryModal";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import Alert from "@/components/Alert/Alert";
import styles from "./Dashboard.module.scss";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button/Button";
import { FiEdit, FiTrash2, FiHeart, FiFolder, FiZap, FiShare2, FiUser, FiStar } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";

interface Wishlist {
  id: number;
  name: string;
  products?: any[];
  isOwner?: boolean;
  owner?: any;
  collaborators?: any[];
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user } = useUser();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [wishlistToDelete, setWishlistToDelete] = useState<number | null>(null);
  const [editingWishlist, setEditingWishlist] = useState<Wishlist | null>(null);
  const [alertInfo, setAlertInfo] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadWishlists();
  }, []);

  const loadWishlists = async () => {
    setLoading(true);
    try {
      const data: Wishlist[] = await api.get("/wishlists");
      setWishlists(data);
    } catch (err) {
      console.error("Dashboard failed to load wishlists:", err);
      setAlertInfo({ message: t("dashboard.loadError"), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWishlist = async (id: number) => {
    setWishlistToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!wishlistToDelete) return;
    try {
      await api.delete(`/wishlists/${wishlistToDelete}`);
      setWishlists((prev) => prev.filter((w) => w.id !== wishlistToDelete));
      setWishlistToDelete(null);
      setIsConfirmOpen(false);
    } catch (err) {
      console.error(`Dashboard failed to delete wishlist ${wishlistToDelete}:`, err);
      setAlertInfo({ message: t("dashboard.deleteError"), type: "error" });
    }
  };

  const handleSaveWishList = async (data: {
    id?: number;
    name: string;
  }) => {
    try {
      if (data.id) {
        await api.put(`/wishlists/${data.id}`, {
          id: data.id,
          name: data.name,
        });
      } else {
        await api.post("/wishlists", {
          name: data.name,
        });
      }

      loadWishlists();
      setIsModalOpen(false);
      setEditingWishlist(null);
    } catch (err) {
      console.error(`Dashboard failed to save wishlist:`, err);
    }
  };

  const openEditModal = (wishlist: Wishlist) => {
    setEditingWishlist(wishlist);
    setIsModalOpen(true);
  };

  return (
    <>
      {alertInfo && (
        <Alert
          message={alertInfo.message}
          type={alertInfo.type}
          onClose={() => setAlertInfo(null)}
        />
      )}
      <div className={styles.header}>
        <div className={styles.welcomeArea}>
          <div className={styles.greetingBadge}>
            <h1>
              {t('dashboard.hi')}{user?.name ? `, ${user.name}` : ''}
              <FiStar className={styles.starIcon} size={24} />
            </h1>
            <div className={styles.greetingGlow} />
          </div>
          <p className={styles.subtitleText}>{t('dashboard.subtitle')}</p>
        </div>
        <div className={styles.actions}>
          <Button
            onClick={() => {
              setEditingWishlist(null);
              setIsModalOpen(true);
            }}
          >
            + {t('dashboard.createNew')}
          </Button>
        </div>
      </div>

      {loading ? (
        <div style={{ marginTop: "3rem" }}>
          <LoadingSpinner showText={false} />
        </div>
      ) : wishlists.length === 0 ? (
        <div className={styles.minimalOnboarding}>
          <div className={styles.onboardingGlow} />
          <div className={styles.onboardingContent}>
            <div className={styles.brandIconWrapper}>
              <img src="/icon.svg" alt="WishIt" className={styles.brandIcon} />
            </div>
            
            <div className={styles.textContent}>
              <h2>{t('dashboard.onboarding.title')}</h2>
              <p>{t('dashboard.onboarding.subtitle')}</p>
            </div>

            <div className={styles.stepJourney}>
              <div className={styles.journeyNode}>
                <div className={styles.nodeNumber}>1</div>
                <div className={styles.nodeIcon}><FiFolder /></div>
                <span className={styles.nodeText}>{t('dashboard.onboarding.step1Title')}</span>
              </div>
              <div className={styles.journeyLine} />
              <div className={styles.journeyNode}>
                <div className={styles.nodeNumber}>2</div>
                <div className={styles.nodeIcon}><FiZap /></div>
                <span className={styles.nodeText}>{t('dashboard.onboarding.step2Title')}</span>
              </div>
              <div className={styles.journeyLine} />
              <div className={styles.journeyNode}>
                <div className={styles.nodeNumber}>3</div>
                <div className={styles.nodeIcon}><FiShare2 /></div>
                <span className={styles.nodeText}>{t('dashboard.onboarding.step3Title')}</span>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className={styles.wishlistGrid}>
          {wishlists.map((wishlist, index) => (
            <Card
              key={wishlist.id}
              index={index}
              title={wishlist.name}
              subtitle={`${wishlist.products?.length || 0} ${t('common.items')}`}
              icon={<FiHeart size={32} />}
              tag={wishlist.isOwner === false ? t('common.shared') : undefined}
              onClick={() => router.push(`/dashboard/${wishlist.id}`)}
              actions={
                wishlist.isOwner !== false ? (
                  <>
                    <FiEdit
                      size={18}
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(wishlist);
                      }}
                      style={{ cursor: "pointer" }}
                    />
                    <FiTrash2
                      size={18}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWishlist(wishlist.id);
                      }}
                      style={{ cursor: "pointer", color: "#FF425D" }}
                    />
                  </>
                ) : null
              }
            >
              <div className={styles.wishlistCardContent}>
                {(wishlist.owner || (wishlist.collaborators && wishlist.collaborators.length > 0)) && (
                  <div className={styles.collaboratorAvatars}>
                    {wishlist.owner && (
                      <div className={`${styles.miniAvatar} ${styles.ownerAvatar}`} title={`${t('wishlistDetail.owner')}: ${wishlist.owner.name || wishlist.owner.email}`}>
                        {wishlist.owner.avatar ? <img src={wishlist.owner.avatar} alt="" /> : <FiUser size={14} />}
                      </div>
                    )}
                    {wishlist.collaborators?.slice(0, 2).map((c, i) => (
                      <div key={i} className={styles.miniAvatar} title={c.name || c.email}>
                        {c.avatar ? <img src={c.avatar} alt="" /> : <FiUser size={14} />}
                      </div>
                    ))}
                    {wishlist.collaborators && wishlist.collaborators.length > 2 && (
                      <div className={styles.moreCount}>+{wishlist.collaborators.length - 2}</div>
                    )}
                  </div>
                )}

                {wishlist.products && wishlist.products.length > 0 && (
                  <div className={styles.progressContainer}>
                    <div className={styles.progressHeader}>
                      <span>{Math.round(((wishlist.products.filter(p => p.isPurchased).length) / wishlist.products.length) * 100)}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ width: `${(wishlist.products.filter(p => p.isPurchased).length / wishlist.products.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <WishlistCategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingWishlist(null);
        }}
        initialData={editingWishlist || undefined}
        onSave={handleSaveWishList}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title={t("common.deleteConfirm")}
        message={t("common.deleteWishlistDesc")}
      />
    </>
  );
}
