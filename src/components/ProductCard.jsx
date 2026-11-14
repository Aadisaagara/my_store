import "./ProductCard.css";

const money = (amount) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(amount);

export default function ProductCard({
  image, name, price, originalPrice, discount, rating, isBestSeller,
  isWishListed = false, onAddToCart, onToggleWishlist,
}) {
  return (
    <article className="product-card">
      {discount && <span className="discount-badge">{discount}</span>}
      <button className={`wishlist-button ${isWishListed ? "active" : ""}`} onClick={onToggleWishlist} aria-label={isWishListed ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`} aria-pressed={isWishListed}>{isWishListed ? "♥" : "♡"}</button>
      <div className="image-container"><img src={image} alt={name} className="product-image" loading="lazy" /></div>
      <div className="card-content">
        <h3 className="product-name">{name}</h3>
        <div className="rating"><span className="stars" aria-label={`${rating} out of 5 stars`}>{"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}</span><span className="rating-value">{rating}</span>{isBestSeller && <span className="bestseller-tag">Best seller</span>}</div>
        <div className="price-row"><span className="price">{money(price)}</span>{originalPrice && <span className="original-price">{money(originalPrice)}</span>}</div>
        <button className="add-btn" onClick={onAddToCart}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h2l2.2 11.1a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H6"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>Add to Cart</button>
      </div>
    </article>
  );
}
