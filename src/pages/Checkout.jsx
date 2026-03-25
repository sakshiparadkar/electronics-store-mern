import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutForm from '../components/CheckoutForm';
import {
  Typography,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Divider,
  Box,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Checkbox,
  Tooltip,
} from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import LockIcon from '@mui/icons-material/Lock';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useNotifier } from '../context/NotificationProvider';
import { apiClient, withRetry } from '../services/apiClient';

function Checkout({ cartItems = [], onOrderComplete }) {
  const navigate = useNavigate();
  const [orderCreated, setOrderCreated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { notify } = useNotifier();

  const [showCartSummary, setShowCartSummary] = useState(false);
  const [selectedItems, setSelectedItems] = useState(() => {
    const defaults = cartItems.map(item => item._id || item.id).filter(Boolean);
    return new Set(defaults);
  });

  const handleSubmit = async formData => {
    if (!selectedItems.size) {
      notify({ severity: 'warning', message: 'Select at least one item.' });
      return;
    }

    const itemsToPurchase = cartItems.filter(item =>
      selectedItems.has(item._id || item.id)
    );

    if (!itemsToPurchase.length) {
      notify({ severity: 'warning', message: 'Selected items unavailable.' });
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // Calculate total
      const total = itemsToPurchase.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
      );

      // ✅ FIXED: Proper payload matching backend schema
      const orderPayload = {
        name: formData.name,
        email: formData.email,
        shippingAddress: formData.shippingAddress,
        items: itemsToPurchase.map(item => ({
          productId: item._id || item.id,
          name: item.name || 'Unnamed product',
          price: item.price || 0,
          quantity: item.quantity || 1,
          image: item.image || '',
        })),
        total: total,
      };

      // ✅ FIXED: Changed endpoint from 'checkout/create-order' to 'orders'
      const { data } = await withRetry(() =>
        apiClient.post('orders', orderPayload)
      );

      setLoading(false);
      setOrderCreated(true);
      onOrderComplete?.();

      notify({ severity: 'success', message: 'Order placed successfully!' });

      navigate('/order-success', {
        state: {
          orderNumber: data?.orderNumber,
          total: data?.total,
          email: formData.email,
        },
      });
    } catch (error) {
      setLoading(false);
      const message =
        error?.response?.data?.error ||
        'Something went wrong while placing your order.';
      setErrorMessage(message);
      notify({ severity: 'error', message });
    }
  };

  const itemsToShow = cartItems.filter(item =>
    selectedItems.has(item._id || item.id)
  );

  const total = itemsToShow.reduce(
    (sum, item) => sum + (item.price || 0),
    0
  );

  const allSelected = cartItems.every(item =>
    selectedItems.has(item._id || item.id)
  );

  return (
    <Container maxWidth="md" sx={{ pb: 10 }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <ShoppingCartCheckoutIcon color="primary" fontSize="large" />
          <Box>
            <Typography variant="h4">Checkout</Typography>
            <Typography variant="body2" color="text.secondary">
              Total due ₹{total.toLocaleString('en-IN')}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        <List>
          {itemsToShow.map(item => (
            <ListItem key={item._id || item.id}>
              <ListItemAvatar>
                <Avatar
                  src={item.image}
                  alt={item.name || 'Product'}
                  variant="rounded"
                />
              </ListItemAvatar>
              <ListItemText
                primary={item.name || 'Unnamed product'}
                secondary={`₹${(item.price || 0).toLocaleString('en-IN')}`}
              />
            </ListItem>
          ))}
        </List>

        {loading && <CircularProgress sx={{ mt: 2 }} />}

        <CheckoutForm onSubmit={handleSubmit} submitting={loading} />

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mt: 2, color: 'text.secondary' }}
        >
          <LockIcon fontSize="small" />
          <Typography variant="caption">
            Payments processed securely.
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Checkout;