export default function LandingPage() {
  return (
    <main className="container">
      <div className="hero-container">
        <img
          src="/wishlist.jpg"
          alt="Fashion Wishlist Hero"
          className="hero-img"
        />
        <div className="hero-overlay" />
        <div className="hero-text">
          <h1>Fashion Wishlist</h1>
          <p>
            Track your favorite fashion products, monitor prices, and never miss
            a deal again!
          </p>
          <a href="/wishlist" className="btn">
            Get Started
          </a>
        </div>
      </div>

      <footer>&copy; 2025 Fashion Wishlist. All rights reserved.</footer>
    </main>
  );
}
