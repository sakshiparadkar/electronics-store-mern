import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  Button,
  Stack,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

function formatDate(dateString) {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return null;
  }
}

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const fallbackMeta = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('fusionLastOrder')) || null;
    } catch {
      return null;
    }
  }, []);

  const stateMeta = location.state || {};

  const orderNumber = stateMeta.orderNumber || fallbackMeta?.orderNumber;
  const email = stateMeta.email || fallbackMeta?.email;
  const estimatedDelivery = stateMeta.estimatedDelivery;
  const items = Array.isArray(stateMeta.items) ? stateMeta.items : [];
  const total = typeof stateMeta.total === 'number' ? stateMeta.total : null;

  const formattedETA = formatDate(estimatedDelivery);

  const handleTrackOrder = () => {
    if (!orderNumber || !email) {
      navigate('/order-tracking');
      return;
    }
    const params = new URLSearchParams({ orderNumber, email }).toString();
    navigate(`/order-tracking?${params}`);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 10 }}>
      <Paper
        elevation={0}
        sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', borderRadius: 4, maxWidth: 640 }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />

        <Typography variant="h4" gutterBottom fontWeight={700}>
          Order Successful!
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Thank you for your purchase. We’re prepping your order and will send tracking updates shortly.
        </Typography>

        {orderNumber && (
          <Stack spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
            <Chip label={`Order #: ${orderNumber}`} color="primary" variant="outlined" />

            {email && (
              <Typography variant="caption" color="text.secondary">
                Confirmation sent to {email}
              </Typography>
            )}

            {formattedETA && (
              <Stack direction="row" spacing={1} alignItems="center">
                <LocalShippingIcon fontSize="small" color="primary" />
                <Typography variant="caption" color="text.secondary">
                  Estimated delivery: {formattedETA}
                </Typography>
              </Stack>
            )}
          </Stack>
        )}

        {items.length > 0 && (
          <Box sx={{ textAlign: 'left', mb: 4 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Items in this shipment
            </Typography>

            <List dense>
              {items.map((item, index) => (
                <ListItem
                  key={`${item.productId || index}`}
                  disableGutters
                  sx={{ py: 0.5 }}
                >
                  <ListItemText
                    primary={item.name || 'Unnamed product'}
                    secondary={`Qty ${item.quantity || 1} • ₹${Number(
                      item.price || 0
                    ).toLocaleString('en-IN')}`}
                  />
                </ListItem>
              ))}
            </List>

            {typeof total === 'number' && <Divider sx={{ my: 2 }} />}

            {typeof total === 'number' && (
              <Typography variant="subtitle2" fontWeight={600}>
                Order total: ₹{total.toLocaleString('en-IN')}
              </Typography>
            )}
          </Box>
        )}

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/shop')}
          >
            Continue shopping
          </Button>

          <Button variant="outlined" onClick={handleTrackOrder}>
            Track order
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/support')}
          >
            Need support?
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default OrderSuccess;
