import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BadgePercent,
  CheckCircle2,
  ChevronRight,
  Heart,
  MapPin,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  User,
  X
} from "lucide-react";
import "./styles.css";

type Product = {
  id: number;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  mrp: number;
  discountPercent: number;
  stock: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  deliveryText: string;
  dealOfDay: boolean;
  primeEligible: boolean;
};

type CartLine = Product & {
  quantity: number;
};

type AppUser = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

const API = "http://localhost:8081/api";
const categories = ["All", "Mobiles", "Electronics", "Audio", "Fashion", "Home", "Kitchen", "Appliances", "Wearables"];

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [orderMessage, setOrderMessage] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem("shopverse-user");
    return saved ? JSON.parse(saved) : null;
  });
  const [customer, setCustomer] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: ""
  });
  const [authForm, setAuthForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: ""
  });
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    alternateAddress: ""
  });

  async function loadProducts(nextQuery = query, nextCategory = category) {
    setLoading(true);
    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set("query", nextQuery.trim());
    if (nextCategory !== "All") params.set("category", nextCategory);

    const productResponse = await fetch(`${API}/products?${params.toString()}`);
    const dealResponse = await fetch(`${API}/products/deals`);
    setProducts(await productResponse.json());
    setDeals(await dealResponse.json());
    setLoading(false);
  }

  useEffect(() => {
    loadProducts("", "All");
  }, []);

  useEffect(() => {
    if (!orderMessage) return;
    const timer = window.setTimeout(() => setOrderMessage(""), 1200);
    return () => window.clearTimeout(timer);
  }, [orderMessage]);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const savings = useMemo(
    () => cart.reduce((sum, item) => sum + (item.mrp - item.price) * item.quantity, 0),
    [cart]
  );

  function addToCart(product: Product) {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);
      if (found) {
        return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function changeQuantity(id: number, delta: number) {
    setCart((current) => current
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0)
    );
  }

  function openCheckout() {
    if (user) {
      setCustomer({
        customerName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address || ""
      });
    }
    setCheckoutOpen(true);
  }

  async function submitAuth(event: React.FormEvent) {
    event.preventDefault();
    setAuthMessage("");
    const endpoint = authMode === "login" ? "login" : "register";
    const payload = authMode === "login"
      ? { email: authForm.email, password: authForm.password }
      : authForm;

    const response = await fetch(`${API}/auth/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      setAuthMessage(error.message || "Authentication failed");
      return;
    }

    const nextUser = await response.json();
    setUser(nextUser);
    localStorage.setItem("shopverse-user", JSON.stringify(nextUser));
    setAuthOpen(false);
    setAuthMessage("");
    setOrderMessage(`${authMode === "login" ? "Welcome back" : "Account created"}, ${nextUser.fullName}`);
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("shopverse-user");
    setProfileOpen(false);
  }

  function openProfile() {
    if (!user) return;
    setProfileForm({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address || "",
      alternateAddress: localStorage.getItem(`shopverse-alt-address-${user.id}`) || ""
    });
    setProfileOpen(true);
  }

  function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    if (!user) return;

    const nextUser = {
      ...user,
      fullName: profileForm.fullName,
      phone: profileForm.phone,
      address: profileForm.address
    };

    setUser(nextUser);
    localStorage.setItem("shopverse-user", JSON.stringify(nextUser));
    localStorage.setItem(`shopverse-alt-address-${user.id}`, profileForm.alternateAddress);
    setProfileOpen(false);
    setOrderMessage("Profile updated");
  }

  async function placeOrder(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch(`${API}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...customer,
        items: cart.map((item) => ({ productId: item.id, quantity: item.quantity }))
      })
    });

    if (!response.ok) {
      const error = await response.json();
      setOrderMessage(error.message || "Order failed");
      return;
    }

    const order = await response.json();
    setOrderMessage(`Order #${order.id} placed successfully. Total: ${money(order.totalAmount)}`);
    setCart([]);
    setCheckoutOpen(false);
    await loadProducts();
  }

  return (
    <main>
      <header className="top-header">
        <div className="brand-row">
          <button className="icon-button" aria-label="Menu"><Menu size={22} /></button>
          <a className="brand" href="#">ShopVerse</a>
          <div className="location"><MapPin size={18} /><span>Deliver to India</span></div>
        </div>

        <form className="search-bar" onSubmit={(event) => { event.preventDefault(); loadProducts(); }}>
          <select value={category} onChange={(event) => { setCategory(event.target.value); loadProducts(query, event.target.value); }}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for mobiles, laptops, headphones and more" />
          <button type="submit" aria-label="Search"><Search size={20} /></button>
        </form>

        <button className="cart-button" onClick={() => setCartOpen(true)}>
          <ShoppingCart size={22} />
          <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </button>
        {user ? (
          <button className="account-button" onClick={openProfile}>
            <User size={18} />
            <span>{user.fullName.split(" ")[0]}</span>
          </button>
        ) : (
          <button className="account-button" onClick={() => { setAuthMode("login"); setAuthOpen(true); }}>
            <User size={18} />
            <span>Sign in</span>
          </button>
        )}
      </header>

      <nav className="deal-nav">
        <a>Today's Deals</a>
        <a>Mobiles</a>
        <a>Fashion</a>
        <a>Electronics</a>
        <a>Home & Kitchen</a>
        <a>Prime Delivery</a>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <span><Sparkles size={16} />Mega savings week</span>
          <h1>Everything you need, delivered fast</h1>
          <p>Premium electronics, fashion, home essentials, and daily deals with smooth checkout and MySQL-backed orders.</p>
          <button onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>
            Shop deals <ChevronRight size={18} />
          </button>
        </div>
        <div className="hero-showcase">
          {deals.slice(0, 3).map((product) => (
            <article key={product.id}>
              <img src={product.imageUrl} alt={product.name} />
              <strong>{product.discountPercent}% off</strong>
              <span>{product.brand}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="category-strip">
        {categories.slice(1).map((item) => (
          <button key={item} onClick={() => { setCategory(item); loadProducts("", item); }}>{item}</button>
        ))}
      </section>

      <section className="promo-grid">
        <article>
          <BadgePercent size={28} />
          <h2>Deal of the day</h2>
          <p>Live product discounts loaded from your Spring Boot API.</p>
        </article>
        <article>
          <Truck size={28} />
          <h2>Fast delivery</h2>
          <p>Delivery labels, stock and pricing come from MySQL.</p>
        </article>
        <article>
          <PackageCheck size={28} />
          <h2>Real checkout</h2>
          <p>Orders are saved through the backend order API.</p>
        </article>
      </section>

      <section className="section-head" id="products">
        <div>
          <p>Marketplace catalog</p>
          <h2>{category === "All" ? "Top picks for you" : category}</h2>
        </div>
        <span>{products.length} products</span>
      </section>

      <section className="product-grid">
        {loading ? <p className="status-text">Loading products...</p> : products.map((product) => (
          <article className="product-card" key={product.id}>
            <button className="wish" aria-label="Wishlist"><Heart size={18} /></button>
            {product.dealOfDay && <span className="deal-badge">Deal</span>}
            <div className="image-wrap">
              <img src={product.imageUrl} alt={product.name} />
            </div>
            <div className="product-info">
              <span className="brand-name">{product.brand}</span>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="rating"><Star size={15} fill="currentColor" />{product.rating} <span>({product.reviewCount})</span></div>
              <div className="price-row">
                <strong>{money(product.price)}</strong>
                <s>{money(product.mrp)}</s>
                <span>{product.discountPercent}% off</span>
              </div>
              <div className="delivery"><Truck size={16} />{product.deliveryText}</div>
              {product.primeEligible && <div className="prime"><CheckCircle2 size={15} />Prime eligible</div>}
            </div>
            <button className="add-cart" onClick={() => addToCart(product)}>
              <ShoppingCart size={17} />Add to cart
            </button>
          </article>
        ))}
      </section>

      {cartOpen && (
        <aside className="cart-drawer">
          <div className="drawer-head">
            <h2>Your cart</h2>
            <button className="icon-button dark" onClick={() => setCartOpen(false)}><X size={20} /></button>
          </div>

          <div className="cart-lines">
            {cart.length === 0 ? <p className="status-text">Your cart is empty.</p> : cart.map((item) => (
              <article className="cart-line" key={item.id}>
                <img src={item.imageUrl} alt={item.name} />
                <div>
                  <strong>{item.name}</strong>
                  <span>{money(item.price)}</span>
                  <div className="quantity">
                    <button onClick={() => changeQuantity(item.id, -1)}><Minus size={14} /></button>
                    <b>{item.quantity}</b>
                    <button onClick={() => changeQuantity(item.id, 1)}><Plus size={14} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="cart-summary">
            <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
            <div><span>You save</span><strong>{money(savings)}</strong></div>
            <button disabled={cart.length === 0} onClick={openCheckout}>Checkout</button>
          </div>
        </aside>
      )}

      {authOpen && (
        <div className="modal-backdrop">
          <form className="checkout-modal" onSubmit={submitAuth}>
            <div className="drawer-head">
              <h2>{authMode === "login" ? "Sign in" : "Create account"}</h2>
              <button type="button" className="icon-button dark" onClick={() => setAuthOpen(false)}><X size={20} /></button>
            </div>
            {authMode === "register" && (
              <>
                <input required placeholder="Full name" value={authForm.fullName} onChange={(e) => setAuthForm({ ...authForm, fullName: e.target.value })} />
                <input required placeholder="Phone" value={authForm.phone} onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })} />
                <textarea placeholder="Address" value={authForm.address} onChange={(e) => setAuthForm({ ...authForm, address: e.target.value })} />
              </>
            )}
            <input required type="email" placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} />
            <input required type="password" minLength={6} placeholder="Password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} />
            {authMessage && <p className="form-error">{authMessage}</p>}
            <button type="submit">{authMode === "login" ? "Sign in" : "Register"}</button>
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setAuthMode(authMode === "login" ? "register" : "login");
                setAuthMessage("");
              }}
            >
              {authMode === "login" ? "New customer? Create an account" : "Already have an account? Sign in"}
            </button>
          </form>
        </div>
      )}

      {profileOpen && user && (
        <div className="modal-backdrop">
          <form className="checkout-modal profile-modal" onSubmit={saveProfile}>
            <div className="drawer-head">
              <h2>My profile</h2>
              <button type="button" className="icon-button dark" onClick={() => setProfileOpen(false)}><X size={20} /></button>
            </div>
            <div className="profile-summary">
              <User size={24} />
              <div>
                <strong>{user.fullName}</strong>
                <span>{user.email}</span>
              </div>
            </div>
            <input required placeholder="Full name" value={profileForm.fullName} onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })} />
            <input disabled type="email" placeholder="Email" value={profileForm.email} />
            <input required placeholder="Phone" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
            <textarea placeholder="Primary address" value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} />
            <textarea placeholder="Alternate address" value={profileForm.alternateAddress} onChange={(e) => setProfileForm({ ...profileForm, alternateAddress: e.target.value })} />
            <button type="submit">Save profile</button>
            <button type="button" className="danger-button" onClick={logout}>Logout</button>
          </form>
        </div>
      )}

      {checkoutOpen && (
        <div className="modal-backdrop">
          <form className="checkout-modal" onSubmit={placeOrder}>
            <div className="drawer-head">
              <h2>Checkout</h2>
              <button type="button" className="icon-button dark" onClick={() => setCheckoutOpen(false)}><X size={20} /></button>
            </div>
            <input required placeholder="Full name" value={customer.customerName} onChange={(e) => setCustomer({ ...customer, customerName: e.target.value })} />
            <input required type="email" placeholder="Email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
            <input required placeholder="Phone" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
            <textarea required placeholder="Delivery address" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
            <strong>Total: {money(subtotal)}</strong>
            <button type="submit">Place order</button>
          </form>
        </div>
      )}

      {orderMessage && <div className="toast">{orderMessage}</div>}
    </main>
  );
}

function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

createRoot(document.getElementById("root")!).render(<App />);
