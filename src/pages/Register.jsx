import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Paper,
  IconButton,
  InputAdornment,
  Stack,
  Dialog,
  DialogContent,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { useNotifier } from '../context/NotificationProvider';

const TOKEN_KEY = 'swastikToken';

function SuccessDialog({ open }) {
  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: { borderRadius: 4, p: 2, textAlign: 'center', minWidth: 300 },
      }}
    >
      <DialogContent>
        <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'success.main', mb: 1 }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Account Created!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You have registered successfully. Redirecting you home…
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const { notify } = useNotifier();
  const navigate = useNavigate();

  const handleRegister = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      notify({ severity: 'error', message: 'Passwords do not match.' });
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post('auth/register', { name, email, password });
      const token = response.data.token;

      localStorage.setItem(TOKEN_KEY, token);

      // Show success popup then redirect after 2 seconds
      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        navigate('/', { replace: true });
      }, 2000);
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors.map(e => e.msg).join(', ');
        setError(errorMessages);
        notify({ severity: 'error', message: errorMessages });
      } else {
        const message = err.response?.data?.msg || 'Registration failed';
        setError(message);
        notify({ severity: 'error', message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 8 }}>
      {/* ✅ Success popup dialog */}
      <SuccessDialog open={successOpen} />

      <Paper elevation={3} sx={{ p: { xs: 4, md: 5 }, borderRadius: 3 }}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h4" align="center" fontWeight={700}>
            Create your account
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary">
            Save wishlists, track orders, and unlock member-only drops.
          </Typography>
        </Stack>

        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleRegister}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(p => !p)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(p => !p)} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button type="submit" variant="contained" size="large" fullWidth>
                Register
              </Button>
            )}
          </Box>
        </form>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account? <a href="/login">Login here</a>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;