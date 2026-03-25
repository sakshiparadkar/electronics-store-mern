import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, CircularProgress, Box } from '@mui/material';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { useNotifier } from '../context/NotificationProvider';

function CheckoutForm({ onSubmit, submitting = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    shippingAddress: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: '',
  });

  const [cardFocused, setCardFocused] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const { notify } = useNotifier();

  // Handle input changes
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle focus for card preview
  const handleInputFocus = e => {
    setCardFocused(e.target.name);
  };

  // Form submit
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      await onSubmit(formData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const msg = error.message || 'Error occurred';
      setErrorMessage(msg);
      notify({ severity: 'error', message: msg });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Billing Information */}
      <Typography variant="h4" gutterBottom>Billing Information</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            name="name"
            label="Full Name"
            fullWidth
            variant="standard"
            value={formData.name}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            name="email"
            label="Email Address"
            fullWidth
            variant="standard"
            value={formData.email}
            onChange={handleInputChange}
            error={!!validationErrors.email}
            helperText={validationErrors.email}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            name="shippingAddress"
            label="Shipping Address"
            fullWidth
            variant="standard"
            value={formData.shippingAddress}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* Payment Details */}
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>Payment Details</Typography>
      <Box sx={{ mb: 2 }}>
        <Cards
          number={formData.cardNumber}
          name={formData.cardName}
          expiry={formData.expiry}
          cvc={formData.cvc}
          focused={cardFocused}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            required
            name="cardNumber"
            label="Card Number"
            fullWidth
            variant="standard"
            value={formData.cardNumber}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            required
            name="cardName"
            label="Name on Card"
            fullWidth
            variant="standard"
            value={formData.cardName}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <TextField
            required
            name="expiry"
            label="Expiry Date"
            placeholder="MM/YY"
            fullWidth
            variant="standard"
            value={formData.expiry}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <TextField
            required
            name="cvc"
            label="CVC"
            fullWidth
            variant="standard"
            value={formData.cvc}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </Grid>
      </Grid>

      {/* Loader & Error */}
      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {errorMessage && <Typography color="error" sx={{ mt: 2 }}>{errorMessage}</Typography>}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 4, mb: 4 }}
        disabled={loading || submitting}
      >
        Place Order
      </Button>
    </form>
  );
}

export default CheckoutForm;
