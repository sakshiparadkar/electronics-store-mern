import React from 'react';
import {
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Typography,
  Divider,
  Paper,
  Stack,
  Box,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useNavigate } from 'react-router-dom';
import { useNotifier } from '../context/NotificationProvider';
import { usdToInr } from '../utils/currency';

function Cart({ cart, setCart }) {
  const navigate = useNavigate();
  const { notify } = useNotifier();

  const removeFromCart = productId => {
    setCart(cart.filter(item => item.id !== productId));
    notify({ severity: 'info', message: 'Removed from cart.' });
  };

  const calculateTotal = () =>
    cart.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : 0;
      return total + price;
    }, 0);

  const handleCheckout = () => {
    if (!cart.length) {
      notify({ severity: 'warning', message: 'Add items before checking out.' });
      return;
    }
    navigate('/checkout');
  };

  const handleTrackOrder = () => {
    try {
      const lastOrder = JSON.parse(localStorage.getItem('fusionLastOrder')) || {};
      const params = new URLSearchParams();
      if (lastOrder.orderNumber) params.set('orderNumber', lastOrder.orderNumber);
      if (lastOrder.email) params.set('email', lastOrder.email);
      const query = params.toString();
      navigate(query ? `/order-tracking?${query}` : '/order-tracking');
    } catch {
      navigate('/order-tracking');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pb: 8 }}>
      {/* ── Top header row ── */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" sx={{ my: 2 }}>
          Shopping Cart
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/shop')}
          >
            Continue shopping
          </Button>

          {/* ── Track Order button in header ── */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<LocalShippingIcon />}
            onClick={handleTrackOrder}
            sx={{ borderRadius: 2 }}
          >
            Track Order
          </Button>

          <Chip
            icon={<ShoppingBagIcon />}
            label={`${cart.length} items`}
            color="primary"
            variant="outlined"
          />
        </Stack>
      </Stack>

      {/* ── Empty state ── */}
      {cart.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
          <Typography variant="h6" gutterBottom>
            Your cart is empty.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Start exploring our latest arrivals and exclusive bundles.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" onClick={() => navigate('/shop')}>
              Browse products
            </Button>
            <Button
              variant="outlined"
              startIcon={<LocalShippingIcon />}
              onClick={handleTrackOrder}
            >
              Track an Order
            </Button>
          </Stack>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4 }}>
          <List>
            {cart.map(item => (
              <React.Fragment key={item.id}>
                <ListItem
                  secondaryAction={
                    <Button
                      onClick={() => removeFromCart(item.id)}
                      startIcon={<DeleteIcon />}
                      color="error"
                    >
                      Remove
                    </Button>
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={item.image} alt={item.name} variant="rounded" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={usdToInr(item.price)}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>

          {/* ── Bottom action row ── */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 4,
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="h6">
              Total: {usdToInr(calculateTotal())}
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={() => navigate('/shop')}>
                Continue shopping
              </Button>
              <Button
                variant="outlined"
                startIcon={<LocalShippingIcon />}
                onClick={handleTrackOrder}
              >
                Track Order
              </Button>
              <Button variant="contained" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </Stack>
          </Box>
        </Paper>
      )}
    </Container>
  );
}

export default Cart;