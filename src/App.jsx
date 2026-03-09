import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, Container, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFoundPage from './pages/NotFoundPage';
import Footer from './components/Footer';
import About from './pages/About';
import Support from './pages/Support';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import ShippingReturns from './pages/ShippingReturns';
import OrderTracking from './pages/OrderTracking';
import ScrollToTop from './components/ScrollToTop';
import { apiClient, withRetry } from './services/apiClient';
import { useNotifier } from './context/NotificationProvider';

const TOKEN_KEY = 'swastikToken';

// ✅ Decode userId from JWT to build a per-user cart key
function getUserId() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.user?.id || payload?.id || payload?.sub || null;
  } catch {
    return null;
  }
}

function getCartKey(userId) {
  const id = userId || getUserId();
  return id ? `fusionCart_${id}` : null;
}

function loadCart() {
  const key = getCartKey();
  if (!key) return [];
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function saveCart(cartItems, userId) {
  const key = getCartKey(userId);
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify(cartItems));
  } catch {
    console.warn('Could not save cart');
  }
}

const theme = createTheme({
  palette: {
    primary: { main: '#0B3D91' },
    secondary: { main: '#3B82F6' },
    background: { default: '#EAF1FB', paper: '#FFFFFF' },
    text: { primary: '#0F172A', secondary: '#475569' },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, textTransform: 'none', paddingInline: 20 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 18, boxShadow: '0 16px 30px rgba(40, 116, 240, 0.08)' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 18, boxShadow: '0 18px 42px rgba(15, 23, 42, 0.08)' },
      },
    },
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: '#f4f7fb' } },
    },
  },
});

function App() {
  const [products, setProducts] = React.useState([]);
  const [cart, setCart] = React.useState(() => loadCart());
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const { notify } = useNotifier();

  // ✅ Persist cart on every change — scoped to current user
  React.useEffect(() => {
    saveCart(cart);
  }, [cart]);

  // ✅ THE FIX: compute cart key FIRST (while token still exists),
  // clear that key, THEN remove token
  const handleLogout = React.useCallback(() => {
    const userId = getUserId();           // read userId BEFORE token is removed
    const cartKey = getCartKey(userId);   // build key while we still can
    if (cartKey) localStorage.removeItem(cartKey); // clear this user's cart
    localStorage.removeItem(TOKEN_KEY);   // NOW remove token
    localStorage.removeItem('fusionLastOrder');
    setCart([]);                          // clear UI
  }, []);

  // ✅ Detect new login and load that user's cart
  const prevTokenRef = React.useRef(localStorage.getItem(TOKEN_KEY));
  React.useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem(TOKEN_KEY);
      if (currentToken && currentToken !== prevTokenRef.current) {
        prevTokenRef.current = currentToken;
        setCart(loadCart()); // load newly logged-in user's cart
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      setError(null);
      try {
        const { data } = await withRetry(() => apiClient.get('products'));
        if (!Array.isArray(data)) throw new Error('Unexpected products response.');

        const normalized = data.map(product => {
          const canonicalId = product?._id || product?.id;
          return { ...product, _id: canonicalId, id: canonicalId };
        });

        if (active) {
          setProducts(normalized);

          let removedCount = 0;
          setCart(prevCart => {
            if (!Array.isArray(prevCart) || !prevCart.length) return prevCart;
            const validIds = new Set(normalized.map(item => String(item.id)));
            const sanitized = prevCart.filter(item => {
              const itemId = item?._id || item?.id;
              return itemId && validIds.has(String(itemId));
            });
            removedCount = prevCart.length - sanitized.length;
            return sanitized;
          });

          if (removedCount > 0) {
            notify({ severity: 'info', message: 'We refreshed your cart to remove items no longer available.' });
          }
        }
      } catch (err) {
        if (!active) return;
        console.error('Error fetching products:', err);
        setProducts([]);
        setError(err);
        notify({ severity: 'error', message: 'Unable to load products. Please try again shortly.' });
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProducts();
    return () => { active = false; };
  }, [notify]);

  const addToCart = React.useCallback(
    product => {
      if (!product) return false;
      const canonicalId = product._id || product.id;
      if (!canonicalId) {
        notify({ severity: 'error', message: 'Unable to add this product right now.' });
        return false;
      }

      if (!localStorage.getItem(TOKEN_KEY)) {
        notify({ severity: 'warning', message: 'Please sign in to add items to your cart.' });
        return false;
      }

      let added = false;
      setCart(prevCart => {
        const alreadyInCart = prevCart.some(
          item => item.id === canonicalId || item._id === canonicalId
        );
        if (alreadyInCart) {
          notify({ severity: 'info', message: 'Item is already in your cart.' });
          return prevCart;
        }
        added = true;
        notify({ severity: 'success', message: 'Added to cart!' });
        return [...prevCart, { ...product, id: canonicalId, _id: canonicalId }];
      });
      return added;
    },
    [notify]
  );

  const handleOrderComplete = React.useCallback(() => {
    const userId = getUserId();
    const cartKey = getCartKey(userId);
    if (cartKey) localStorage.removeItem(cartKey);
    setCart([]);
    notify({ severity: 'success', message: 'Thank you for your order!' });
  }, [notify]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <ScrollToTop />
        <NavigationBar cartItemCount={cart.length} onLogout={handleLogout} />
        <Box component="main" sx={{ minHeight: 'calc(100vh - 200px)' }}>
          <Container maxWidth="xl" sx={{ pb: 8 }}>
            <Routes>
              <Route path="/" element={<Home products={products} loading={loading} error={error} addToCart={addToCart} />} />
              <Route path="/shop" element={<Shop products={products} addToCart={addToCart} loading={loading} error={error} />} />
              <Route path="/about" element={<About />} />
              <Route path="/support" element={<Support />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/shipping-returns" element={<ShippingReturns />} />
              <Route path="/order-tracking" element={<OrderTracking />} />
              <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
              <Route path="/checkout" element={<Checkout cartItems={cart} onOrderComplete={handleOrderComplete} />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Container>
        </Box>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;