import React from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, Typography, Divider, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { usdToInr } from '../utils/currency'; // if you want INR conversion

function ShoppingCart({ cart, setCart }) {
  const navigate = useNavigate();

  const removeFromCart = id => setCart(cart.filter(item => item.id !== id));

  const calculateTotal = () => cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => navigate('/checkout');

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Shopping Cart</Typography>

      {cart.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          <List>
            {cart.map(item => (
              <React.Fragment key={item.id}>
                <ListItem
                  secondaryAction={
                    <Button onClick={() => removeFromCart(item.id)} startIcon={<DeleteIcon />} color="error">
                      Remove
                    </Button>
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={item.image} alt={item.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`₹${usdToInr(item.price)}`} // INR conversion
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Total: ₹{usdToInr(calculateTotal())}
          </Typography>

          <Button variant="contained" onClick={handleCheckout} sx={{ mt: 2 }}>
            Proceed to Checkout
          </Button>
        </>
      )}
    </Box>
  );
}

export default ShoppingCart;
