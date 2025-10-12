export default function LandingPage() {
  return (
    <main className="container">
      <div className="wishlistHeroContainer">
        <img
          src="/wishlist.jpg"
          alt="Wishlist Hero"
          className="wishlistHeroImg"
        />
        <div className="wishlistHeroOverlay" />
        <div className="wishlistHeroText">
          <h1>Fashion Wishlist</h1>
          <p>Keep track of your favorite fashion items</p>
          <a href="/wishlist" className="btn">
            Get Started
          </a>
        </div>
      </div>
      <footer>&copy; 2025 Fashion Wishlist. All rights reserved.</footer>
    </main>
  );
}
