import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Search,
  Wallet,
  ArrowRight,
  MapPin,
  ShoppingCart,
  Leaf,
  CreditCard,
  Truck,
} from 'lucide-react';
import './index.css';
import logo from './assets/Revalue-logo.jpeg';

const dashboardStats = [
  { label: 'Organik', value: 70, tone: 'emerald' },
  { label: 'Anorganik', value: 52, tone: 'sky' },
  { label: 'B3', value: 30, tone: 'amber' },
  { label: 'Total', value: 90, tone: 'teal' },
];

const wasteCatalog = [
  { id: 1, category: 'Anorganik', name: 'Plastik PET', price: 3500, unit: 'kg' },
  { id: 2, category: 'Organik', name: 'Sampah Dapur', price: 1000, unit: 'kg' },
  { id: 3, category: 'B3 Medis', name: 'Limbah Masker', price: 0, unit: 'SOP' },
  { id: 4, category: 'Logam', name: 'Kaleng Alumunium', price: 5500, unit: 'kg' },
];

const productCards = [
  { id: 1, name: 'Kompos Premium REVALUE', price: 25000, tag: 'Popular', tone: 'green' },
  { id: 2, name: 'Kompos Semai', price: 12500, tag: 'New', tone: 'dark' },
  { id: 3, name: 'Pupuk Cair', price: 18000, tag: 'Best', tone: 'amber' },
  { id: 4, name: 'Kompos Buah', price: 22000, tag: 'Hot', tone: 'teal' },
];

const dropoffLocations = [
  { name: 'Pusat Daur Ulang', x: '32%', y: '44%' },
  { name: 'Unit Kompos', x: '54%', y: '48%' },
  { name: 'RS 3', x: '68%', y: '62%' },
  { name: 'Bank Sampah', x: '72%', y: '28%' },
  { name: 'Pengepul', x: '24%', y: '30%' },
  { name: 'Kota Baru', x: '46%', y: '70%' },
];

const currency = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
const apiUrl = import.meta.env.VITE_API_URL || '/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [saldo, setSaldo] = useState(0);
  const [cart, setCart] = useState([]);
  const [selectedWaste, setSelectedWaste] = useState(wasteCatalog[0]);
  const [withdrawMessage, setWithdrawMessage] = useState('');
  const [authMode, setAuthMode] = useState(null);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authMessage, setAuthMessage] = useState('');
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('revalue_user')); } catch { return null; }
  });

  useEffect(() => {
    const token = localStorage.getItem('revalue_token');
    if (!token) return;

    fetch(`${apiUrl}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Profil gagal dimuat.');
        return data;
      })
      .then((data) => {
        setUser(data.user);
        setSaldo(Number(data.user.walletBalance || 0));
        localStorage.setItem('revalue_user', JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem('revalue_token');
        localStorage.removeItem('revalue_user');
        setUser(null);
        setSaldo(0);
      });
  }, []);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Keranjang masih kosong.');
      return;
    }

    if (saldo < cartTotal) {
      alert(`Saldo tidak cukup. Saldo Anda saat ini ${currency(saldo)}.`);
      return;
    }

    alert(`Pembayaran berhasil! Total ${currency(cartTotal)} telah dibayar.`);
    setCart([]);
    setCurrentPage('dashboard');
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthMessage('Memproses...');
    try {
      const endpoint = authMode === 'register' ? '/auth/register' : '/auth/login';
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Autentikasi gagal.');
      localStorage.setItem('revalue_token', data.token);
      localStorage.setItem('revalue_user', JSON.stringify(data.user));
      setUser(data.user);
      setSaldo(Number(data.user.walletBalance || 0));
      setAuthMode(null);
      setAuthForm({ name: '', email: '', password: '' });
      setAuthMessage('');
    } catch (error) {
      setAuthMessage(error.message.includes('Failed to fetch') ? 'Server belum berjalan. Jalankan npm run server.' : error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('revalue_token');
    localStorage.removeItem('revalue_user');
    setUser(null);
    setSaldo(0);
  };

  const handleWithdraw = () => {
    if (!user) {
      setAuthMode('login');
      return;
    }

    setWithdrawMessage(saldo > 0
      ? 'Permintaan tarik saldo membutuhkan endpoint backend agar saldo dan transaksi tetap tercatat di database.'
      : 'Saldo Anda belum tersedia untuk ditarik.');
  };

  const renderAuth = () => authMode && (
    <div className="auth-overlay" role="dialog" aria-modal="true">
      <form className="auth-card" onSubmit={handleAuthSubmit}>
        <div className="auth-heading">
          <img className="brand-logo auth-logo" src={logo} alt="Revalue" />
          <div>
            <h2>{authMode === 'register' ? 'Buat akun Revalue' : 'Masuk ke Revalue'}</h2>
            <p>{authMode === 'register' ? 'Mulai kelola sampah dan saldo Anda.' : 'Lanjutkan aktivitas daur ulang Anda.'}</p>
          </div>
        </div>
        {authMode === 'register' && <label>Nama lengkap<input required value={authForm.name} onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })} /></label>}
        <label>Email<input required type="email" value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} /></label>
        <label>Password<input required minLength="6" type="password" value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} /></label>
        {authMessage && <p className="auth-message">{authMessage}</p>}
        <button className="confirm-btn" type="submit">{authMode === 'register' ? 'Daftar' : 'Masuk'}</button>
        <button className="auth-switch" type="button" onClick={() => { setAuthMode(authMode === 'register' ? 'login' : 'register'); setAuthMessage(''); }}>{authMode === 'register' ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}</button>
        <button className="auth-close" type="button" onClick={() => setAuthMode(null)}>Tutup</button>
      </form>
    </div>
  );

  const pageNav = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'setoran', label: 'Setoran' },
    { key: 'map', label: 'Drop-off' },
    { key: 'marketplace', label: 'Marketplace' },
    { key: 'checkout', label: 'Checkout' },
  ];

  const renderDashboard = () => (
    <div className="page-card shell-dashboard">
      <header className="topbar">
        <div className="brand-wrap">
          <img className="brand-logo" src={logo} alt="Revalue" />
        </div>

        <nav className="nav-tabs">
          {pageNav.map((item) => (
            <button
              key={item.key}
              type="button"
              className={currentPage === item.key ? 'nav-active' : ''}
              onClick={() => setCurrentPage(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="nav-tools">
          {user ? <button type="button" className="profile-button" onClick={handleLogout}>{user.name?.split(' ')[0]} · Keluar</button> : <button type="button" className="profile-button" onClick={() => setAuthMode('login')}>Masuk</button>}
          <button type="button" className="icon-button"><Search size={15} /></button>
          <button type="button" className="icon-button"><Bell size={15} /></button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="hero-panel">
          <div className="hero-copy">
            <span className="hero-badge">Homepage untuk Masyarakat</span>
            <h1>Welcome to Dashboard</h1>
            <p>
              Platform digital penghubung masyarakat, pengepul, dan industri daur ulang untuk pengelolaan sampah berkelanjutan di kota Anda.
            </p>
          </div>

          <div className="wallet-box">
            <div className="wallet-head">
              <span>Dompet Digital</span>
              <Wallet size={16} />
            </div>
            <strong>{currency(saldo)}</strong>
            <button type="button" onClick={handleWithdraw}>Tarik Saldo</button>
            {withdrawMessage && <p className="wallet-message">{withdrawMessage}</p>}
          </div>
        </section>

        <section className="action-grid">
          <button type="button" className="action-card primary-green" onClick={() => setCurrentPage('setoran')}>
            <span>Setor Sampah</span>
            <ArrowRight size={18} />
          </button>

          <button type="button" className="action-card primary-blue" onClick={() => setCurrentPage('marketplace')}>
            <span>Beli Kompos</span>
            <ArrowRight size={18} />
          </button>
        </section>

        <section className="stats-row">
          <div className="panel-card chart-card">
            <div className="card-title">Dashboard Dampak Lingkungan</div>
            <div className="chart-box">
              {dashboardStats.map((item) => (
                <div key={item.label} className="chart-col">
                  <div className={`bar bar-${item.tone}`} style={{ height: `${item.value}%` }} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-card impact-card">
            <div className="card-title">Carbon Offset Calculator</div>
            <div className="impact-box">
              <p>Total Karbon Terhindar:</p>
              <strong>50 kg <small>CO2e</small></strong>
            </div>
            <div className="impact-meta">
              <span>Pohon Setara: 2.5</span>
              <span>TPA: Terreduksi</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );

  const renderSetoran = () => (
    <div className="page-card shell-light">
      <header className="topbar slim">
        <div className="brand-wrap">
          <img className="brand-logo" src={logo} alt="Revalue" />
        </div>

        <div className="subnav">
          <button type="button" className="subnav-pill active">Setoran</button>
          <button type="button" className="subnav-pill" onClick={() => setCurrentPage('map')}>Lokasi</button>
        </div>

        <div className="nav-tools">
          <button type="button" className="icon-button"><Wallet size={15} /></button>
        </div>
      </header>

      <main className="setoran-page">
        <div className="section-head">
          <div>
            <h2>Katalog Harga Sampah</h2>
            <p>Harga real-time berdasarkan jenis sampah</p>
          </div>
          <button type="button" className="secondary-btn" onClick={() => setCurrentPage('map')}>Lihat Lokasi</button>
        </div>

        <div className="waste-grid">
          {wasteCatalog.map((item) => (
            <article
              key={item.id}
              className={`waste-card ${selectedWaste.id === item.id ? 'selected' : ''}`}
              onClick={() => setSelectedWaste(item)}
            >
              <span className="waste-tag">{item.category}</span>
              <h3>{item.name}</h3>
              <strong>
                {item.price === 0 ? 'SOP Khusus' : `${currency(item.price)} / ${item.unit}`}
              </strong>
              <button type="button" className="mini-btn" onClick={(e) => {
                e.stopPropagation();
                setCurrentPage('dashboard');
              }}>
                Mulai Setor
              </button>
            </article>
          ))}
        </div>
      </main>
    </div>
  );

  const renderMap = () => (
    <div className="page-card shell-light">
      <header className="topbar slim">
        <div className="brand-wrap">
          <img className="brand-logo" src={logo} alt="Revalue" />
        </div>

        <div className="subnav">
          <button type="button" className="subnav-pill" onClick={() => setCurrentPage('setoran')}>Setoran</button>
          <button type="button" className="subnav-pill active">Drop-off</button>
        </div>

        <div className="nav-tools">
          <button type="button" className="icon-button"><Search size={15} /></button>
        </div>
      </header>

      <main className="map-page">
        <div className="map-toolbar">
          <button type="button" className="chip active">Daur Ulang</button>
          <button type="button" className="chip">Kompos</button>
          <button type="button" className="chip">Bahan</button>
        </div>

        <div className="map-panel">
          <div className="map-grid" />
          {dropoffLocations.map((loc) => (
            <div key={loc.name} className="map-dot" style={{ left: loc.x, top: loc.y }}>
              <span />
            </div>
          ))}
        </div>

        <div className="location-list">
          {dropoffLocations.map((loc, index) => (
            <div key={loc.name} className="location-row">
              <div className="location-icon"><MapPin size={12} /></div>
              <div>
                <strong>{loc.name}</strong>
                <small>{index % 2 === 0 ? 'Ready' : 'Busy'} • {index + 2} km</small>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );

  const renderMarketplace = () => (
    <div className="page-card shell-light">
      <header className="topbar slim">
        <div className="brand-wrap">
          <img className="brand-logo" src={logo} alt="Revalue" />
        </div>

        <div className="subnav">
          <button type="button" className="subnav-pill" onClick={() => setCurrentPage('dashboard')}>Home</button>
          <button type="button" className="subnav-pill active">Marketplace</button>
        </div>

        <div className="nav-tools">
          <button type="button" className="icon-button"><ShoppingCart size={15} /></button>
        </div>
      </header>

      <main className="market-main">
        <div className="section-head">
          <div>
            <h2>Marketplace Kompos</h2>
            <p>Pilih produk hasil olahan organik terbaik</p>
          </div>
          <button type="button" className="secondary-btn" onClick={() => setCurrentPage('checkout')}>Checkout</button>
        </div>

        <div className="market-grid">
          {productCards.map((product) => (
            <article key={product.id} className={`product-card ${product.tone}`}>
              <div className="product-art"><Leaf size={24} /></div>
              <span className="product-tag">{product.tag}</span>
              <h3>{product.name}</h3>
              <div className="product-bottom">
                <strong>{currency(product.price)}</strong>
                <button type="button" onClick={() => addToCart(product)}>
                  <ShoppingCart size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );

  const renderCheckout = () => (
    <div className="page-card shell-light">
      <header className="topbar slim">
        <div className="brand-wrap">
          <img className="brand-logo" src={logo} alt="Revalue" />
        </div>

        <div className="subnav">
          <button type="button" className="subnav-pill" onClick={() => setCurrentPage('marketplace')}>Belanja</button>
          <button type="button" className="subnav-pill active">Checkout</button>
        </div>

        <div className="nav-tools">
          <button type="button" className="icon-button"><CreditCard size={15} /></button>
        </div>
      </header>

      <main className="checkout-page">
        <div className="checkout-panel">
          <div className="checkout-header">
            <h2>Ringkasan Pembelian</h2>
            <span>{cart.reduce((sum, item) => sum + item.qty, 0)} item</span>
          </div>

          {cart.length === 0 ? (
            <div className="empty-box">Keranjang masih kosong.</div>
          ) : (
            <div className="checkout-list">
              {cart.map((item) => (
                <div key={item.id} className="checkout-item">
                  <div>
                    <strong>{item.name}</strong>
                    <small>{currency(item.price)} x {item.qty}</small>
                  </div>
                  <div className="checkout-controls">
                    <button type="button" onClick={() => updateQty(item.id, -1)}>-</button>
                    <span>{item.qty}</span>
                    <button type="button" onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="totals-box">
            <div className="row-total"><span>Subtotal</span><strong>{currency(cartTotal || 0)}</strong></div>
            <div className="row-total"><span>Saldo</span><strong>{currency(saldo)}</strong></div>
          </div>

          <div className="payment-methods">
            <button type="button" className="payment-option active"><CreditCard size={14} /> Dompet Digital</button>
            <button type="button" className="payment-option"><Truck size={14} /> Bayar Saat Ambil</button>
          </div>

          <button type="button" className="confirm-btn" onClick={handleCheckout}>Konfirmasi Pembayaran</button>
        </div>
      </main>
    </div>
  );

  const currentView = {
    dashboard: renderDashboard(),
    setoran: renderSetoran(),
    map: renderMap(),
    marketplace: renderMarketplace(),
    checkout: renderCheckout(),
  }[currentPage];

  return <div className="app-shell">{currentView}{renderAuth()}</div>;
}
