import { useEffect, useState } from "react";
import "./App.css";
import ProductCard from "./components/ProductCard";
import { PRODUCTS } from "./data/products";

function App() {
  // The cart stores products and how many of each product were added.
  // Keep the cart in memory so it starts empty after a page refresh.
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem("mystore-wishlist") || "[]");
  });

  const [searchText, setSearchText] = useState("");
  const [brand, setBrand] = useState("All");
  const [sortOrder, setSortOrder] = useState("featured");
  const [showWishlist, setShowWishlist] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [signInOpen, setSignInOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Keep the wishlist saved across page refreshes.
  useEffect(() => {
    localStorage.setItem("mystore-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Build the list of products to show.
  let visibleProducts = PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesBrand = brand === "All" || product.brand === brand;
    const isOnWishlist = wishlist.includes(product.id);
    const matchesWishlist = !showWishlist || isOnWishlist;

    return matchesSearch && matchesBrand && matchesWishlist;
  });

  
  if (sortOrder === "price-low") {
    visibleProducts = [...visibleProducts].sort((a, b) => a.price - b.price);
  }
  if (sortOrder === "price-high") {
    visibleProducts = [...visibleProducts].sort((a, b) => b.price - a.price);
  }
  if (sortOrder === "rating") {
    visibleProducts = [...visibleProducts].sort((a, b) => b.rating - a.rating);
  }

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const brands = [...new Set(PRODUCTS.map((product) => product.brand).filter(Boolean))];

  function addToCart(product) {
    const productIsInCart = cart.some((item) => item.id === product.id);

    if (productIsInCart) {
      // Increase the quantity if this product is already in the cart.
      const updatedCart = cart.map((item) => {
        if (item.id === product.id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      setCart(updatedCart);
    } else {
      // Otherwise, add it with a quantity of one.
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    setMessage("Added to cart");
    window.setTimeout(() => setMessage(""), 2000);
  }

  function changeQuantity(productId, amount) {
    const updatedCart = cart
      .map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: item.quantity + amount };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
  }

  function removeFromCart(productId) {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
  }

  function toggleWishlist(productId) {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  }

  function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  }

  return (
    <div className={`app ${isDarkMode ? "" : "light-theme"}`}>
      <nav className="navbar">
        <div className="nav-container">
          <a href="#top" className="logo">
            <span className="logo-icon">◆</span> Mall of India
          </a>

          <ul className="nav-links">
            <li><a href="#products" className="nav-link">Products</a></li>
            <li><a href="#products" className="nav-link">Deals</a></li>
            <li><a href="#footer" className="nav-link">Support</a></li>
          </ul>

          <div className="nav-actions">
            <button
              className="nav-btn theme-toggle"
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? "☀ Light" : "☾ Dark"}
            </button>
            <button className="nav-btn" onClick={() => setSignInOpen(true)}>
              {signedIn ? "Signed in" : "Sign in"}
            </button>
            <button
              className="nav-btn primary shop-nav-button"
              onClick={() => document.querySelector("#products").scrollIntoView({ behavior: "smooth" })}
            >
              Let’s Shop
            </button>
            <button
              className={`nav-btn wishlist-nav ${showWishlist ? "selected" : ""}`}
              onClick={() => setShowWishlist(!showWishlist)}
            >
              ♡ <span>Wishlist</span><b>{wishlist.length}</b>
            </button>
            <button className="nav-btn cart-nav" onClick={() => setCartOpen(true)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 3h2l2.2 11.1a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H6" />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              <span>Cart</span><b>{cartCount}</b>
            </button>
          </div>
        </div>
      </nav>

      <main id="top">
        <section className="hero">
          <div className="hero-content">
            <p className="hero-tag">New arrivals for 2026</p>
            <h1 className="hero-title">
              Let’s explore the world of <span className="hero-highlight">technology</span>
              <br />
              <span className="hero-highlight">together.</span>
            </h1>
            <p className="hero-description">
              Discover premium tech, the latest gadgets, and everyday essentials picked to make life smarter and more connected.
            </p>
            <div className="hero-cta">
              <button className="btn-primary" onClick={() => document.querySelector("#products").scrollIntoView({ behavior: "smooth" })}>
                Shop products
              </button>
              <button className="btn-secondary" onClick={() => document.querySelector("#products").scrollIntoView({ behavior: "smooth" })}>
                Explore deals
              </button>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-number">100K+</span><span className="stat-label">Happy customers</span></div>
            <div className="stat"><span className="stat-number">100+</span><span className="stat-label">Premium products</span></div>
            <div className="stat"><span className="stat-number">24/7</span><span className="stat-label">Customer support</span></div>
          </div>
        </section>

        <section className="products-section" id="products">
          <div className="section-header">
            <h2 className="section-title">{showWishlist ? "Your wishlist" : "Top tech picks"}</h2>
            <p className="section-subtitle">Search, filter, and sort our handpicked tech deals.</p>
          </div>

          <div className="catalog-tools">
            <form
              className="search-box"
              onSubmit={(event) => {
                event.preventDefault();
                document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" /></svg>
              <input
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
              />
              <button className="search-submit" type="submit">Search</button>
            </form>

            <label className="select-label">
              Brand
              <select value={brand} onChange={(event) => setBrand(event.target.value)}>
                <option value="All">All brands</option>
                {brands.map((brandName) => <option key={brandName}>{brandName}</option>)}
              </select>
            </label>

            <label className="select-label">
              Sort by
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </label>
          </div>

          <p className="results-count">{visibleProducts.length} products</p>

          {visibleProducts.length > 0 ? (
            <div className="product-grid">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  isWishListed={wishlist.includes(product.id)}
                  onToggleWishlist={() => toggleWishlist(product.id)}
                  onAddToCart={() => addToCart(product)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-products">
              <h3>No products found</h3>
              <p>Try a different search or filter.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="footer" id="footer">
        <p>&copy; 2026 Mall Of Tech. All rights reserved.</p>
      </footer>

      {message && <div className="toast" role="status">✓ {message}</div>}

      {signInOpen && (
        <div className="signin-backdrop" onClick={() => setSignInOpen(false)}>
          <section className="signin-modal" onClick={(event) => event.stopPropagation()}>
            <button className="close-btn signin-close" onClick={() => setSignInOpen(false)} aria-label="Close sign in">×</button>
            <p className="drawer-eyebrow">WELCOME BACK</p>
            <h2>Sign in</h2>
            <p className="signin-description">Enter your email and password to continue.</p>
            <form
              className="signin-form"
              onSubmit={(event) => {
                event.preventDefault();
                setSignedIn(true);
                setSignInOpen(false);
                setMessage("Demo sign-in complete.");
                window.setTimeout(() => setMessage(""), 2500);
              }}
            >
              <label>Email<input type="email" required placeholder="you@example.com" /></label>
              <label>Password<input type="password" required minLength="4" placeholder="Your password" /></label>
              <button className="checkout-btn" type="submit">Sign in</button>
            </form>
            <p className="signin-note">Demo only — no account or password is stored.</p>
          </section>
        </div>
      )}

      {cartOpen && (
        <div className="drawer-backdrop" onClick={() => setCartOpen(false)}>
          <aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <p className="drawer-eyebrow">YOUR BAG</p>
                <h2>Shopping cart ({cartCount})</h2>
              </div>
              <button className="close-btn" onClick={() => setCartOpen(false)}>×</button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Add a product to see it here.</p>
                <button className="btn-primary" onClick={() => setCartOpen(false)}>Start shopping</button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <article className="cart-item" key={item.id}>
                      <img src={item.image} alt={item.name} />
                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <strong>{formatPrice(item.price)}</strong>
                        <div className="quantity-control">
                          <button onClick={() => changeQuantity(item.id, -1)}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => changeQuantity(item.id, 1)}>+</button>
                          <button className="remove-item" onClick={() => removeFromCart(item.id)}>Remove</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="cart-summary">
                  <div><span>Subtotal</span><strong>{formatPrice(cartTotal)}</strong></div>
                  <p>Shipping and taxes are calculated at checkout.</p>
                  <button className="checkout-btn" onClick={() => setMessage("Checkout is not connected yet.")}>Continue to checkout →</button>
                  <button className="continue-shopping" onClick={() => setCartOpen(false)}>Continue shopping</button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;
