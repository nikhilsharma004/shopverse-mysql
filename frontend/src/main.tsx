import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BadgePercent,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Heart,
  History,
  LogOut,
  MapPin,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  Store,
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

type CartLine = Product & { quantity: number };

type AppUser = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: "CUSTOMER" | "SELLER" | "ADMIN";
  token: string;
};

type Order = {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  userId: number | null;
  paymentMethod: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
  items: { productId: number; productName: string; unitPrice: number; quantity: number; lineTotal: number }[];
};

const API = "http://localhost:8081/api";
const categories = ["All", "Mobiles", "Electronics", "Audio", "Fashion", "Home", "Kitchen", "Appliances", "Wearables"];
const emptyProduct = {
  name: "",
  brand: "",
  category: "Electronics",
  description: "",
  price: 999,
  mrp: 1499,
  discountPercent: 20,
  stock: 10,
  rating: 4.2,
  reviewCount: 100,
  imageUrl: "/assets/laptop.svg",
  deliveryText: "Free delivery in 2 days",
  dealOfDay: false,
  primeEligible: true
};

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("0");
  const [view, setView] = useState<"shop" | "orders" | "admin" | "seller">("shop");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [toast, setToast] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [user, setUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem("shopverse-user");
    return saved ? JSON.parse(saved) : null;
  });
  const [customer, setCustomer] = useState({ customerName: "", email: "", phone: "", address: "" });
  const [authForm, setAuthForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    role: "CUSTOMER" as AppUser["role"],
    password: ""
  });
  const [profileForm, setProfileForm] = useState({ fullName: "", email: "", phone: "", address: "", alternateAddress: "" });
  const [productForm, setProductForm] = useState(emptyProduct);

  async function loadProducts(nextQuery = query, nextCategory = category) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (nextQuery.trim()) params.set("query", nextQuery.trim());
      if (nextCategory !== "All") params.set("category", nextCategory);
      const [productResponse, dealResponse] = await Promise.all([
        fetch(`${API}/products?${params.toString()}`),
        fetch(`${API}/products/deals`)
      ]);
      setProducts(await productResponse.json());
      setDeals(await dealResponse.json());
    } finally {
      setLoading(false);
    }
  }

  async function loadOrders() {
    if (!user) return;
    const response = await fetch(`${API}/orders?userId=${user.id}&email=${encodeURIComponent(user.email)}`);
    setOrders(await response.json());
  }

  useEffect(() => {
    loadProducts("", "All");
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 1200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (view === "orders") loadOrders();
  }, [view, user]);

  const visibleProducts = useMemo(() => products.filter((product) => {
    const min = minPrice ? Number(minPrice) : 0;
    const max = maxPrice ? Number(maxPrice) : Number.MAX_SAFE_INTEGER;
    return product.price >= min && product.price <= max && product.rating >= Number(minRating);
  }), [products, minPrice, maxPrice, minRating]);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const savings = useMemo(() => cart.reduce((sum, item) => sum + (item.mrp - item.price) * item.quantity, 0), [cart]);
  const sellerStats = useMemo(() => ({
    products: products.length,
    lowStock: products.filter((product) => product.stock < 20).length,
    inventoryValue: products.reduce((sum, product) => sum + product.price * product.stock, 0)
  }), [products]);

  function addToCart(product: Product) {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);
      return found
        ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, quantity: 1 }];
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
      setCustomer({ customerName: user.fullName, email: user.email, phone: user.phone, address: user.address || "" });
    }
    setCheckoutOpen(true);
  }

  async function submitAuth(event: React.FormEvent) {
    event.preventDefault();
    setAuthMessage("");
    const endpoint = authMode === "login" ? "login" : "register";
    const payload = authMode === "login" ? { email: authForm.email, password: authForm.password } : authForm;
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
    setToast(`${authMode === "login" ? "Welcome back" : "Account created"}, ${nextUser.fullName}`);
  }

  function logout() {
    setUser(null);
    setOrders([]);
    localStorage.removeItem("shopverse-user");
    setProfileOpen(false);
    setView("shop");
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
    const nextUser = { ...user, fullName: profileForm.fullName, phone: profileForm.phone, address: profileForm.address };
    setUser(nextUser);
    localStorage.setItem("shopverse-user", JSON.stringify(nextUser));
    localStorage.setItem(`shopverse-alt-address-${user.id}`, profileForm.alternateAddress);
    setProfileOpen(false);
    setToast("Profile updated");
  }

  async function placeOrder(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch(`${API}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...customer,
        userId: user?.id,
        paymentMethod,
        items: cart.map((item) => ({ productId: item.id, quantity: item.quantity }))
      })
    });
    if (!response.ok) {
      const error = await response.json();
      setToast(error.message || "Order failed");
      return;
    }
    const order = await response.json();
    setToast(`Order #${order.id} placed. Total: ${money(order.totalAmount)}`);
    setCart([]);
    setCheckoutOpen(false);
    await loadProducts();
    await loadOrders();
  }

  async function saveProduct(event: React.FormEvent) {
    event.preventDefault();
    const url = editingProductId ? `${API}/products/${editingProductId}` : `${API}/products`;
    await fetch(url, {
      method: editingProductId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.token || ""}` },
      body: JSON.stringify(productForm)
    });
    setProductForm(emptyProduct);
    setEditingProductId(null);
    setToast(editingProductId ? "Product updated" : "Product added");
    await loadProducts("", "All");
  }

  async function deleteProduct(id: number) {
    await fetch(`${API}/products/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${user?.token || ""}` } });
    setToast("Product deleted");
    await loadProducts("", "All");
  }

  function editProduct(product: Product) {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      price: product.price,
      mrp: product.mrp,
      discountPercent: product.discountPercent,
      stock: product.stock,
      rating: product.rating,
      reviewCount: product.reviewCount,
      imageUrl: product.imageUrl,
      deliveryText: product.deliveryText,
      dealOfDay: product.dealOfDay,
      primeEligible: product.primeEligible
    });
    setView("seller");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main>
      <header className="top-header">
        <div className="brand-row">
          <button className="icon-button" aria-label="Menu"><Menu size={22} /></button>
          <a className="brand" href="#" onClick={() => setView("shop")}>ShopVerse</a>
          <div className="location"><MapPin size={18} /><span>Deliver to India</span></div>
        </div>
        <form className="search-bar" onSubmit={(event) => { event.preventDefault(); loadProducts(); setView("shop"); }}>
          <select value={category} onChange={(event) => { setCategory(event.target.value); loadProducts(query, event.target.value); }}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search mobiles, laptops, headphones and more" />
          <button type="submit" aria-label="Search"><Search size={20} /></button>
        </form>
        <button className="cart-button" onClick={() => setCartOpen(true)}><ShoppingCart size={22} /><span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span></button>
        {user ? (
          <button className="account-button" onClick={openProfile}><User size={18} /><span>{user.fullName.split(" ")[0]}</span></button>
        ) : (
          <button className="account-button" onClick={() => { setAuthMode("login"); setAuthOpen(true); }}><User size={18} /><span>Sign in</span></button>
        )}
      </header>

      <nav className="deal-nav">
        <button onClick={() => setView("shop")}>Today's Deals</button>
        <button onClick={() => setView("orders")}><History size={15} /> Orders</button>
        <button onClick={() => setView("seller")}><Store size={15} /> Seller</button>
        <button onClick={() => setView("admin")}><ShieldCheck size={15} /> Admin</button>
        <button onClick={() => { setCategory("Mobiles"); loadProducts("", "Mobiles"); setView("shop"); }}>Mobiles</button>
        <button onClick={() => { setCategory("Fashion"); loadProducts("", "Fashion"); setView("shop"); }}>Fashion</button>
      </nav>

      {view === "shop" && (
        <>
          <section className="hero marketplace-hero">
            <div className="hero-copy">
              <span><Sparkles size={16} />Big billion style sale</span>
              <h1>Smart shopping, real checkout, MySQL orders</h1>
              <p>ShopVerse now has login, order history, payment choice, product filters, seller tools, admin controls, and local product assets.</p>
              <button onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>Explore deals <ChevronRight size={18} /></button>
            </div>
            <div className="hero-showcase">
              {deals.slice(0, 3).map((product) => (
                <article key={product.id}><img src={imageFor(product)} alt={product.name} /><strong>{product.discountPercent}% off</strong><span>{product.brand}</span></article>
              ))}
            </div>
          </section>

          <section className="category-strip">
            {categories.slice(1).map((item) => <button key={item} onClick={() => { setCategory(item); loadProducts("", item); }}>{item}</button>)}
          </section>

          <section className="promo-grid">
            <article><BadgePercent size={28} /><h2>Marketplace deals</h2><p>Discount badges, ratings, delivery labels, and stock from the API.</p></article>
            <article><CreditCard size={28} /><h2>Payment options</h2><p>UPI, card, net banking, EMI, and cash-on-delivery UI.</p></article>
            <article><PackageCheck size={28} /><h2>Saved orders</h2><p>Checkout creates MySQL order records and history pages.</p></article>
          </section>

          <section className="filter-band">
            <strong><SlidersHorizontal size={18} />Filters</strong>
            <input placeholder="Min price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            <input placeholder="Max price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            <select value={minRating} onChange={(e) => setMinRating(e.target.value)}>
              <option value="0">Any rating</option><option value="4">4 stars & above</option><option value="4.5">4.5 stars & above</option>
            </select>
          </section>

          <ProductGrid loading={loading} products={visibleProducts} addToCart={addToCart} editProduct={editProduct} />
        </>
      )}

      {view === "orders" && <OrdersView user={user} orders={orders} openLogin={() => setAuthOpen(true)} reload={loadOrders} />}
      {view === "admin" && <AdminView products={products} orders={orders} user={user} editProduct={editProduct} deleteProduct={deleteProduct} reloadOrders={loadOrders} />}
      {view === "seller" && <SellerView stats={sellerStats} form={productForm} setForm={setProductForm} saveProduct={saveProduct} editing={editingProductId !== null} />}

      {cartOpen && <CartDrawer cart={cart} subtotal={subtotal} savings={savings} close={() => setCartOpen(false)} changeQuantity={changeQuantity} openCheckout={openCheckout} />}

      {authOpen && (
        <div className="modal-backdrop">
          <form className="checkout-modal" onSubmit={submitAuth}>
            <div className="drawer-head"><h2>{authMode === "login" ? "Sign in" : "Create account"}</h2><button type="button" className="icon-button dark" onClick={() => setAuthOpen(false)}><X size={20} /></button></div>
            {authMode === "register" && (
              <>
                <input required placeholder="Full name" value={authForm.fullName} onChange={(e) => setAuthForm({ ...authForm, fullName: e.target.value })} />
                <input required placeholder="Phone" value={authForm.phone} onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })} />
                <textarea placeholder="Address" value={authForm.address} onChange={(e) => setAuthForm({ ...authForm, address: e.target.value })} />
                <select value={authForm.role} onChange={(e) => setAuthForm({ ...authForm, role: e.target.value as AppUser["role"] })}>
                  <option value="CUSTOMER">Customer</option><option value="SELLER">Seller</option><option value="ADMIN">Admin</option>
                </select>
              </>
            )}
            <input required type="email" placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} />
            <input required type="password" minLength={6} placeholder="Password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} />
            {authMessage && <p className="form-error">{authMessage}</p>}
            <button type="submit">{authMode === "login" ? "Sign in" : "Register"}</button>
            <button type="button" className="text-button" onClick={() => { setAuthMode(authMode === "login" ? "register" : "login"); setAuthMessage(""); }}>
              {authMode === "login" ? "New customer? Create an account" : "Already have an account? Sign in"}
            </button>
          </form>
        </div>
      )}

      {profileOpen && user && (
        <div className="modal-backdrop">
          <form className="checkout-modal profile-modal" onSubmit={saveProfile}>
            <div className="drawer-head"><h2>My profile</h2><button type="button" className="icon-button dark" onClick={() => setProfileOpen(false)}><X size={20} /></button></div>
            <div className="profile-summary"><User size={24} /><div><strong>{user.fullName}</strong><span>{user.email} · {user.role}</span></div></div>
            <input required placeholder="Full name" value={profileForm.fullName} onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })} />
            <input disabled type="email" value={profileForm.email} />
            <input required placeholder="Phone" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
            <textarea placeholder="Primary address" value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} />
            <textarea placeholder="Alternate address" value={profileForm.alternateAddress} onChange={(e) => setProfileForm({ ...profileForm, alternateAddress: e.target.value })} />
            <button type="submit">Save profile</button>
            <button type="button" className="danger-button" onClick={logout}><LogOut size={16} />Logout</button>
          </form>
        </div>
      )}

      {checkoutOpen && (
        <div className="modal-backdrop">
          <form className="checkout-modal" onSubmit={placeOrder}>
            <div className="drawer-head"><h2>Checkout</h2><button type="button" className="icon-button dark" onClick={() => setCheckoutOpen(false)}><X size={20} /></button></div>
            <input required placeholder="Full name" value={customer.customerName} onChange={(e) => setCustomer({ ...customer, customerName: e.target.value })} />
            <input required type="email" placeholder="Email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
            <input required placeholder="Phone" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
            <textarea required placeholder="Delivery address" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
            <div className="payment-grid">
              {["UPI", "CARD", "NET_BANKING", "EMI", "CASH_ON_DELIVERY"].map((method) => (
                <button type="button" className={paymentMethod === method ? "selected" : ""} key={method} onClick={() => setPaymentMethod(method)}>
                  <CreditCard size={16} />{method.replace(/_/g, " ")}
                </button>
              ))}
            </div>
            <strong>Total: {money(subtotal)}</strong>
            <button type="submit">Place order</button>
          </form>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}

function ProductGrid({ loading, products, addToCart, editProduct }: { loading: boolean; products: Product[]; addToCart: (product: Product) => void; editProduct: (product: Product) => void }) {
  return (
    <>
      <section className="section-head" id="products"><div><p>Marketplace catalog</p><h2>Top picks for you</h2></div><span>{products.length} products</span></section>
      <section className="product-grid">
        {loading ? <p className="status-text">Loading products...</p> : products.map((product) => (
          <article className="product-card" key={product.id}>
            <button className="wish" aria-label="Wishlist"><Heart size={18} /></button>
            {product.dealOfDay && <span className="deal-badge">Deal</span>}
            <div className="image-wrap"><img src={imageFor(product)} alt={product.name} /></div>
            <div className="product-info">
              <span className="brand-name">{product.brand}</span>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="rating"><Star size={15} fill="currentColor" />{product.rating} <span>({product.reviewCount})</span></div>
              <div className="price-row"><strong>{money(product.price)}</strong><s>{money(product.mrp)}</s><span>{product.discountPercent}% off</span></div>
              <div className="delivery"><Truck size={16} />{product.deliveryText}</div>
              {product.primeEligible && <div className="prime"><CheckCircle2 size={15} />Prime eligible</div>}
            </div>
            <div className="card-actions"><button className="add-cart" onClick={() => addToCart(product)}><ShoppingCart size={17} />Add</button><button onClick={() => editProduct(product)}>Edit</button></div>
          </article>
        ))}
      </section>
    </>
  );
}

function OrdersView({ user, orders, openLogin, reload }: { user: AppUser | null; orders: Order[]; openLogin: () => void; reload: () => void }) {
  if (!user) return <section className="workspace-panel"><h2>Order history</h2><p>Sign in to view your orders.</p><button onClick={openLogin}>Sign in</button></section>;
  return (
    <section className="workspace-panel">
      <div className="workspace-head"><div><p>My account</p><h2>Order history</h2></div><button onClick={reload}><History size={16} />Refresh</button></div>
      <div className="order-list">
        {orders.length === 0 ? <p className="status-text">No orders yet.</p> : orders.map((order) => (
          <article className="order-card" key={order.id}>
            <div><strong>Order #{order.id}</strong><span>{new Date(order.createdAt).toLocaleString()}</span></div>
            <div><span>{order.orderStatus}</span><span>{order.paymentMethod}</span><strong>{money(order.totalAmount)}</strong></div>
            <p>{order.items.map((item) => `${item.productName} x${item.quantity}`).join(", ")}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminView({ products, orders, user, editProduct, deleteProduct, reloadOrders }: { products: Product[]; orders: Order[]; user: AppUser | null; editProduct: (p: Product) => void; deleteProduct: (id: number) => void; reloadOrders: () => void }) {
  return (
    <section className="workspace-panel">
      <div className="workspace-head"><div><p>Admin panel</p><h2>Marketplace control room</h2></div><button onClick={reloadOrders}><BarChart3 size={16} />Refresh orders</button></div>
      <div className="admin-metrics"><article><strong>{products.length}</strong><span>Products</span></article><article><strong>{orders.length}</strong><span>Your orders</span></article><article><strong>{user?.role || "Guest"}</strong><span>Current role</span></article></div>
      <div className="admin-table">
        {products.map((product) => <div key={product.id}><span>{product.name}</span><b>{money(product.price)}</b><em>{product.stock} stock</em><button onClick={() => editProduct(product)}>Edit</button><button className="danger-inline" onClick={() => deleteProduct(product.id)}>Delete</button></div>)}
      </div>
    </section>
  );
}

function SellerView({ stats, form, setForm, saveProduct, editing }: { stats: { products: number; lowStock: number; inventoryValue: number }; form: typeof emptyProduct; setForm: (form: typeof emptyProduct) => void; saveProduct: (event: React.FormEvent) => void; editing: boolean }) {
  return (
    <section className="workspace-panel">
      <div className="workspace-head"><div><p>Seller dashboard</p><h2>Inventory and listing tools</h2></div></div>
      <div className="admin-metrics"><article><strong>{stats.products}</strong><span>Listings</span></article><article><strong>{stats.lowStock}</strong><span>Low stock</span></article><article><strong>{money(stats.inventoryValue)}</strong><span>Inventory value</span></article></div>
      <form className="seller-form" onSubmit={saveProduct}>
        <input required placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select>
        <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        <input type="number" placeholder="MRP" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: Number(e.target.value) })} />
        <input type="number" placeholder="Discount" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })} />
        <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
        <input placeholder="Local image path" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        <input placeholder="Delivery text" value={form.deliveryText} onChange={(e) => setForm({ ...form, deliveryText: e.target.value })} />
        <label><input type="checkbox" checked={form.dealOfDay} onChange={(e) => setForm({ ...form, dealOfDay: e.target.checked })} /> Deal of day</label>
        <label><input type="checkbox" checked={form.primeEligible} onChange={(e) => setForm({ ...form, primeEligible: e.target.checked })} /> Prime eligible</label>
        <button type="submit">{editing ? "Update product" : "Add product"}</button>
      </form>
    </section>
  );
}

function CartDrawer({ cart, subtotal, savings, close, changeQuantity, openCheckout }: { cart: CartLine[]; subtotal: number; savings: number; close: () => void; changeQuantity: (id: number, delta: number) => void; openCheckout: () => void }) {
  return (
    <aside className="cart-drawer">
      <div className="drawer-head"><h2>Your cart</h2><button className="icon-button dark" onClick={close}><X size={20} /></button></div>
      <div className="cart-lines">
        {cart.length === 0 ? <p className="status-text">Your cart is empty.</p> : cart.map((item) => (
          <article className="cart-line" key={item.id}><img src={imageFor(item)} alt={item.name} /><div><strong>{item.name}</strong><span>{money(item.price)}</span><div className="quantity"><button onClick={() => changeQuantity(item.id, -1)}><Minus size={14} /></button><b>{item.quantity}</b><button onClick={() => changeQuantity(item.id, 1)}><Plus size={14} /></button></div></div></article>
        ))}
      </div>
      <div className="cart-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>You save</span><strong>{money(savings)}</strong></div><button disabled={cart.length === 0} onClick={openCheckout}>Checkout</button></div>
    </aside>
  );
}

function money(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function imageFor(product: Product) {
  if (product.imageUrl && !product.imageUrl.startsWith("http")) return product.imageUrl;
  const byCategory: Record<string, string> = {
    Electronics: "/assets/laptop.svg",
    Mobiles: "/assets/phone.svg",
    Audio: "/assets/headphones.svg",
    Wearables: "/assets/watch.svg",
    Appliances: "/assets/appliance.svg",
    Home: "/assets/home.svg",
    Fashion: "/assets/shoes.svg",
    Kitchen: "/assets/coffee.svg"
  };
  return byCategory[product.category] || "/assets/laptop.svg";
}

createRoot(document.getElementById("root")!).render(<App />);
