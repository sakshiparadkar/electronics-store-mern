import * as React from 'react';
import {
  Typography,
  Grid,
  Box,
  Container,
  Button,
  Paper,
  Stack,
  Avatar,
  Divider,
  useMediaQuery,
  Chip,
} from '@mui/material';
import ProductCard from '../components/ProductCard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import LockIcon from '@mui/icons-material/Lock';
import SyncIcon from '@mui/icons-material/Sync';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { useNavigate } from 'react-router-dom';

const normalizeProduct = p => {
  const canonical = p._id || p.id;
  return { ...p, id: canonical, _id: canonical };
};

const valueProps = [
  {
    title: 'Fast & Free Delivery',
    description: 'Get your orders delivered quickly with zero extra shipping charges.',
    icon: <LocalShippingIcon />,
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    title: '24/7 Human Support',
    description: 'Our expert team is always ready to help you anytime.',
    icon: <HeadsetMicIcon />,
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    title: 'Trusted & Protected',
    description: 'Shop confidently with industry-leading encryption and safeguards.',
    icon: <LockIcon />,
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    title: 'Easy 30-Day Returns',
    description: 'Not satisfied? Return your product within 30 days hassle-free.',
    icon: <SyncIcon />,
    color: '#D97706',
    bg: '#FFFBEB',
  },
];

const testimonials = [
  {
    name: 'Apurva Gore',
    role: 'Content Creator',
    initials: 'AG',
    quote: "Swastik Electronics curates gear I didn't even know I needed. The quality and delivery speed are unmatched.",
    stars: 5,
  },
  {
    name: 'Sayli Sanjeev',
    role: 'Startup Founder',
    initials: 'SS',
    quote: 'From smart home tech to productivity gadgets, everything arrives perfectly packaged and ready to go.',
    stars: 5,
  },
  {
    name: 'Jui Joshi',
    role: 'Product Designer',
    initials: 'JJ',
    quote: 'Their support team is next level. They helped me switch out a device overnight before a big launch.',
    stars: 5,
  },
];

/* ─── Keyframe Animations ─── */
const fadeUp = {
  '@keyframes fadeUp': {
    from: { opacity: 0, transform: 'translateY(28px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
};

const floatAnim = {
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-10px)' },
  },
};

const pulseDot = {
  '@keyframes pulseDot': {
    '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
    '50%': { opacity: 1, transform: 'scale(1.15)' },
  },
};

/* ─── Enhanced Hero Carousel ─── */
function HeroCarousel({ products, navigate, addToCart }) {
  const slides = React.useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];
    return [...products].filter(p => p.image || p.imageUrl || p.img).slice(0, 10);
  }, [products]);

  const [active, setActive] = React.useState(0);
  const [animating, setAnimating] = React.useState(false);

  const goTo = React.useCallback((i) => {
    setAnimating(true);
    setTimeout(() => { setActive(i); setAnimating(false); }, 320);
  }, []);

  React.useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      goTo((active + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [slides.length, active, goTo]);

  if (slides.length === 0) return null;

  const current = slides[active];
  const imgSrc = current.image || current.imageUrl || current.img;
  const price = current.price != null ? `₹${Number(current.price).toLocaleString('en-IN')}` : '';
  const originalPrice = current.originalPrice || current.mrp;
  const discount = originalPrice && current.price
    ? Math.round((1 - current.price / originalPrice) * 100)
    : null;

  return (
    <Box sx={{ flex: '0 0 360px', animation: 'fadeUp 0.9s ease 0.2s both' }}>

      {/* ── Main Card ── */}
      <Box sx={{
        borderRadius: 5,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.15)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 40px 100px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05)',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 50px 120px rgba(0,0,0,0.5), 0 0 40px rgba(96,165,250,0.15)',
        },
      }}>

        {/* ── Image area ── */}
        <Box sx={{
          width: '100%', height: 320,
          position: 'relative', overflow: 'hidden',
          bgcolor: 'rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Box
            component="img"
            src={imgSrc}
            alt={current.name || current.title}
            onClick={() => navigate('/shop')}
            sx={{
              width: '100%', height: '100%',
              objectFit: 'contain', p: 3,
              opacity: animating ? 0 : 1,
              transform: animating ? 'scale(0.92) translateY(10px)' : 'scale(1) translateY(0)',
              transition: 'opacity 0.32s ease, transform 0.32s ease',
            }}
          />

          {/* Gradient overlay bottom */}
          <Box sx={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 80,
            background: 'linear-gradient(to top, rgba(10,31,68,0.6) 0%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          {/* NEW badge */}
          <Box sx={{
            position: 'absolute', top: 14, left: 14,
            bgcolor: '#2563EB', color: 'white',
            fontSize: '0.6rem', fontWeight: 800,
            px: 1.3, py: 0.5, borderRadius: 99, letterSpacing: 1.2,
            boxShadow: '0 4px 12px rgba(37,99,235,0.5)',
          }}>NEW</Box>

          {/* Discount badge */}
          {discount && discount > 0 && (
            <Box sx={{
              position: 'absolute', top: 14, right: 14,
              bgcolor: '#dc2626', color: 'white',
              fontSize: '0.6rem', fontWeight: 800,
              px: 1.3, py: 0.5, borderRadius: 99, letterSpacing: 0.5,
              boxShadow: '0 4px 12px rgba(220,38,38,0.45)',
            }}>{discount}% OFF</Box>
          )}

          {/* Slide number bottom-right */}
          <Box sx={{
            position: 'absolute', bottom: 12, right: 14,
            color: 'rgba(255,255,255,0.45)', fontSize: '0.65rem', letterSpacing: 1,
          }}>
            {active + 1}/{slides.length}
          </Box>
        </Box>

        {/* ── Info area ── */}
        <Box sx={{ p: 2.8 }}>
          {/* Category pill */}
          {current.category && (
            <Chip
              label={current.category}
              size="small"
              sx={{
                mb: 1.2, height: 22,
                bgcolor: 'rgba(96,165,250,0.15)',
                color: '#93c5fd',
                border: '1px solid rgba(96,165,250,0.25)',
                fontSize: '0.62rem', fontWeight: 700,
                letterSpacing: 0.5,
              }}
            />
          )}

          {/* Product name */}
          <Typography
            sx={{
              color: 'white', fontWeight: 800,
              fontSize: '1rem', mb: 0.6, lineHeight: 1.35,
              opacity: animating ? 0 : 1,
              transform: animating ? 'translateY(6px)' : 'translateY(0)',
              transition: 'opacity 0.32s ease, transform 0.32s ease',
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}
          >
            {current.name || current.title}
          </Typography>

          {/* Price row */}
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <Typography sx={{ color: '#60a5fa', fontWeight: 900, fontSize: '1.25rem', lineHeight: 1 }}>
              {price}
            </Typography>
            {originalPrice && (
              <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', textDecoration: 'line-through' }}>
                ₹{Number(originalPrice).toLocaleString('en-IN')}
              </Typography>
            )}
            {current.rating && (
              <Stack direction="row" alignItems="center" spacing={0.3} sx={{ ml: 'auto' }}>
                <StarRoundedIcon sx={{ color: '#f59e0b', fontSize: 14 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 700 }}>
                  {current.rating}
                </Typography>
              </Stack>
            )}
          </Stack>

          {/* Add to Cart button */}
          <Button
            variant="contained"
            fullWidth
            size="medium"
            onClick={e => { e.stopPropagation(); addToCart && addToCart(current); }}
            sx={{
              bgcolor: '#2563EB',
              borderRadius: 99,
              fontWeight: 700,
              fontSize: '0.88rem',
              textTransform: 'none',
              py: 1.1,
              boxShadow: '0 6px 24px rgba(37,99,235,0.4)',
              '&:hover': {
                bgcolor: '#1d4ed8',
                boxShadow: '0 8px 28px rgba(37,99,235,0.55)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Add to Cart
          </Button>
        </Box>
      </Box>

    </Box>
  );
}

/* ─── Scrolling Brand Marquee ─── */
const brands = [
  'Sony', 'Apple', 'Samsung', 'OnePlus', 'Bose',
  'LG', 'Philips', 'Boat', 'JBL', 'Xiaomi',
  'Dell', 'Lenovo', 'Asus', 'HP', 'Canon',
];

function MarqueeBrands() {
  const doubled = [...brands, ...brands];
  return (
    <Box
      sx={{
        overflow: 'hidden',
        py: 2.5,
        mb: 6,
        borderTop: '1px solid rgba(0,0,0,0.06)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        bgcolor: 'white',
        '@keyframes marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: 'max-content',
          animation: 'marquee 28s linear infinite',
          '&:hover': { animationPlayState: 'paused' },
        }}
      >
        {doubled.map((brand, i) => (
          <Stack key={i} direction="row" alignItems="center" spacing={0} sx={{ flexShrink: 0 }}>
            <Typography
              sx={{
                px: 4,
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#64748b',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s',
                '&:hover': { color: '#0A1F44' },
              }}
            >
              {brand}
            </Typography>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#cbd5e1', flexShrink: 0 }} />
          </Stack>
        ))}
      </Box>
    </Box>
  );
}


function SectionHeading({ overline, title, subtitle }) {
  return (
    <Box sx={{ mb: 1 }}>
      {overline && (
        <Typography
          variant="overline"
          sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2, fontSize: '0.7rem', display: 'block', mb: 0.5 }}
        >
          {overline}
        </Typography>
      )}
      <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1.2, letterSpacing: '-0.5px' }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.75 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

function Home({ products, addToCart }) {
  const navigate = useNavigate();
  const isSmall = useMediaQuery('(max-width:900px)');

  const newArrivals = React.useMemo(() => {
    if (!Array.isArray(products)) return [];
    return [...products]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 8)
      .map(normalizeProduct);
  }, [products]);

  const featuredProducts = React.useMemo(() => {
    if (!Array.isArray(products)) return [];
    return [...products]
      .filter(p => p.rating >= 4)
      .slice(0, 4)
      .map(normalizeProduct);
  }, [products]);

  return (
    <Box sx={{ backgroundColor: '#F4F7FB', minHeight: '100vh', ...fadeUp, ...floatAnim, ...pulseDot }}>

      {/* ── HERO ── */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: { xs: 0, md: '0 0 40px 40px' },
          background: 'linear-gradient(135deg, #061329 0%, #0A1F44 45%, #0e2f5e 100%)',
          minHeight: isSmall ? 460 : 580,
          display: 'flex',
          alignItems: 'center',
          mb: 6,
        }}
      >
        {/* Decorative blobs */}
        <Box sx={{
          position: 'absolute', width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
          top: -80, left: -80, pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          bottom: -60, right: -40, pointerEvents: 'none',
          animation: 'float 6s ease-in-out infinite',
        }} />

        {/* Dot grid pattern */}
        <Box sx={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* Live badge */}
        <Box sx={{
          position: 'absolute', top: 28, right: 32,
          display: 'flex', alignItems: 'center', gap: 0.8,
          bgcolor: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 99, px: 1.8, py: 0.7,
          backdropFilter: 'blur(6px)',
        }}>
          <Box sx={{
            width: 8, height: 8, borderRadius: '50%', bgcolor: '#4ade80',
            animation: 'pulseDot 2s ease-in-out infinite',
          }} />
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem', fontWeight: 600 }}>
            New Arrivals In Stock
          </Typography>
        </Box>

        {/* Hero content — split layout */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, px: { xs: 2, md: 4 } }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems="center"
            justifyContent="space-between"
            spacing={{ xs: 5, md: 4 }}
          >
            {/* LEFT: Text */}
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' }, animation: 'fadeUp 0.7s ease both' }}>
              <Chip
                label="✦ Premium Electronics Store"
                size="small"
                sx={{
                  mb: 3,
                  bgcolor: 'rgba(59,130,246,0.18)',
                  color: '#93c5fd',
                  border: '1px solid rgba(59,130,246,0.3)',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  letterSpacing: 0.8,
                  backdropFilter: 'blur(4px)',
                }}
              />
              <Typography
                fontWeight={900}
                color="white"
                sx={{
                  lineHeight: 1.1,
                  letterSpacing: '-1.5px',
                  textShadow: '0 2px 40px rgba(0,0,0,0.3)',
                  mb: 2.5,
                  fontSize: { xs: '2.4rem', md: '3.4rem' },
                }}
              >
                Where Smart
                <Box component="span" sx={{
                  display: 'block',
                  background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Meets Style.
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  maxWidth: 420,
                  mx: { xs: 'auto', md: 0 },
                  lineHeight: 1.85,
                  fontSize: '1rem',
                  mb: 4,
                }}
              >
                Curated innovation, reliable performance, and sleek design — delivered right to your door.
              </Typography>

              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/shop')}
                sx={{
                  bgcolor: '#2563EB',
                  px: 4, py: 1.4,
                  borderRadius: 99,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  boxShadow: '0 8px 32px rgba(37,99,235,0.45)',
                  '&:hover': { bgcolor: '#1d4ed8', transform: 'translateY(-2px)', boxShadow: '0 12px 36px rgba(37,99,235,0.55)' },
                  transition: 'all 0.25s ease',
                }}
              >
                Shop Now
              </Button>

              {/* Stats row */}
              <Stack
                direction="row"
                spacing={4}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
                sx={{ mt: 5, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}
              >
                {[['10K+', 'Happy Customers'], ['500+', 'Products'], ['4.9★', 'Avg Rating']].map(([val, lbl]) => (
                  <Box key={lbl}>
                    <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.4rem', lineHeight: 1 }}>{val}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', mt: 0.4, letterSpacing: 0.5 }}>{lbl}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* RIGHT: Enhanced Hero Carousel */}
            {!isSmall && (
              <HeroCarousel products={newArrivals} navigate={navigate} addToCart={addToCart} />
            )}
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl">

        {/* ── VALUE PROPS ── */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {valueProps.map((card, i) => (
            <Grid item xs={12} sm={6} md={3} key={card.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  height: '100%',
                  borderRadius: 4,
                  border: '1px solid rgba(0,0,0,0.06)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  transition: 'all 0.3s ease',
                  animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.09)',
                  },
                }}
              >
                <Avatar sx={{ bgcolor: card.bg, color: card.color, width: 50, height: 50, flexShrink: 0, borderRadius: 3 }}>
                  {card.icon}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.4 }}>{card.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{card.description}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* ── BRAND MARQUEE ── */}
        <MarqueeBrands />

        {/* ── NEW ARRIVALS ── */}
        <Box sx={{ mb: 8 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            sx={{ mb: 3 }}
          >
            <SectionHeading overline="Just Landed" title="New Arrivals" subtitle="Fresh drops from brands we love." />
            <Button variant="outlined" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/shop')} size="small"
              sx={{ borderRadius: 99, textTransform: 'none', fontWeight: 600, mt: { xs: 2, md: 0 }, px: 2.5 }}>
              View all
            </Button>
          </Stack>
          <Grid container spacing={3}>
            {newArrivals.map(product => (
              <Grid item key={product.id} xs={12} sm={6} md={3}>
                <ProductCard product={product} addToCart={addToCart} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ── FEATURED PRODUCTS ── */}
        <Box sx={{ mb: 8 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            sx={{ mb: 3 }}
          >
            <Box>
              <SectionHeading overline="Editor's Pick" title="Featured Products" subtitle="Handpicked favourites rated 4★ and above by our customers." />
              <Chip icon={<StarRoundedIcon sx={{ fontSize: 14 }} />} label="Top Rated" color="warning" size="small"
                sx={{ fontWeight: 700, borderRadius: 99, mt: 0.5 }} />
            </Box>
            <Button variant="outlined" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/shop')} size="small"
              sx={{ borderRadius: 99, textTransform: 'none', fontWeight: 600, mt: { xs: 2, md: 0 }, px: 2.5 }}>
              View all
            </Button>
          </Stack>
          <Grid container spacing={3}>
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <Grid item key={product.id} xs={12} sm={6} md={3}>
                  <ProductCard product={product} addToCart={addToCart} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No featured products found. Make sure your products have a <strong>rating</strong> field of 4 or above.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* ── CTA BANNER ── */}
        <Paper
          elevation={0}
          sx={{
            mb: 8, borderRadius: 5, overflow: 'hidden',
            background: 'linear-gradient(120deg, #0A1F44 0%, #1e3a8a 100%)',
            px: { xs: 4, md: 8 }, py: { xs: 5, md: 6 },
            display: 'flex', flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center', justifyContent: 'space-between',
            gap: 3, position: 'relative',
          }}
        >
          <Box sx={{ position: 'absolute', right: -40, top: -40, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <Box>
            <Typography variant="h5" fontWeight={800} color="white" sx={{ mb: 1 }}>Exclusive deals, just for you.</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', maxWidth: 440, lineHeight: 1.7 }}>
              Sign up and get early access to flash sales, new drops, and member-only discounts.
            </Typography>
          </Box>
          <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/shop')}
            sx={{ bgcolor: 'white', color: '#0A1F44', px: 4, py: 1.4, borderRadius: 99, fontWeight: 800, textTransform: 'none', flexShrink: 0, fontSize: '0.95rem', '&:hover': { bgcolor: '#e2e8f0', transform: 'scale(1.03)' }, transition: 'all 0.2s ease' }}>
            Explore Deals
          </Button>
        </Paper>

        
        {/* ── TESTIMONIALS ── */}
        <Box sx={{
          mb: 10, mx: { xs: -2, md: -4 }, px: { xs: 2, md: 4 }, py: 8,
          background: 'linear-gradient(135deg, #061329 0%, #0A1F44 50%, #0e2f5e 100%)',
          borderRadius: 5,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Blob decorations */}
          <Box sx={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', top: -80, right: -60, pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', bottom: -60, left: -40, pointerEvents: 'none' }} />

          <Box sx={{ textAlign: 'center', mb: 5, position: 'relative', zIndex: 1 }}>
            <Typography variant="overline" sx={{ color: '#60a5fa', fontWeight: 700, letterSpacing: 2, fontSize: '0.7rem' }}>
              Reviews
            </Typography>
            <Typography variant="h4" fontWeight={800} color="white" sx={{ letterSpacing: '-0.5px', mt: 0.5 }}>
              What Our Customers Say
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.75 }}>
              Trusted by creators, founders and designers.
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
            {testimonials.map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box sx={{
                  p: 4, borderRadius: 4, height: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    background: 'rgba(255,255,255,0.09)',
                    border: '1px solid rgba(96,165,250,0.3)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                  },
                }}>
                  {/* Stars */}
                  <Stack direction="row" spacing={0.3} sx={{ mb: 2.5 }}>
                    {Array.from({ length: item.stars }).map((_, i) => (
                      <StarRoundedIcon key={i} sx={{ color: '#f59e0b', fontSize: 18 }} />
                    ))}
                  </Stack>

                  <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 3, lineHeight: 1.75, color: 'rgba(255,255,255,0.7)' }}>
                    "{item.quote}"
                  </Typography>

                  <Divider sx={{ mb: 2.5, borderColor: 'rgba(255,255,255,0.1)' }} />

                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar sx={{
                      background: 'linear-gradient(135deg, #2563EB, #7c3aed)',
                      color: 'white', width: 38, height: 38,
                      fontSize: '0.8rem', fontWeight: 700,
                      boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
                    }}>
                      {item.initials}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={700} fontSize="0.9rem" color="white">{item.name}</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)' }}>{item.role}</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ mb: 6 }} />

      </Container>
    </Box>
  );
}

export default Home;