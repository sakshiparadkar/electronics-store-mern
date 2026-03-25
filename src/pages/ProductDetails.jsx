import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Collapse,
  Container,
  Grid,
  Paper,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { apiClient, withRetry } from '../services/apiClient';
import { useNotifier } from '../context/NotificationProvider';

const formatINR = value =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`;

function SimilarProductsError({ onRetry }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Alert
      severity="warning"
      variant="outlined"
      icon={<CloudOffIcon fontSize="inherit" />}
      sx={{ borderRadius: 2, borderWidth: 2 }}
      action={
        <Stack direction="row" spacing={1}>
          <Button size="small" startIcon={<RefreshIcon />} onClick={onRetry}>
            Retry
          </Button>
          <Button
            size="small"
            component="a"
            href="https://weaviate.io"
            target="_blank"
            rel="noopener"
            endIcon={<OpenInNewIcon />}
          >
            Docs
          </Button>
        </Stack>
      }
    >
      <AlertTitle>Similar products unavailable</AlertTitle>
      Recommendations are temporarily unavailable.
      <Box sx={{ mt: 1 }}>
        <Button
          size="small"
          endIcon={
            <ExpandMoreIcon
              sx={{
                transform: showDetails ? 'rotate(180deg)' : 'none',
                transition: '0.2s',
              }}
            />
          }
          onClick={() => setShowDetails(v => !v)}
        >
          {showDetails ? 'Hide details' : 'Show details'}
        </Button>
        <Collapse in={showDetails}>
          <Paper
            variant="outlined"
            sx={{ p: 1.5, mt: 1, fontSize: 12, fontFamily: 'monospace' }}
          >
            Vector database unavailable. Configure your own cluster to enable recommendations.
          </Paper>
        </Collapse>
      </Box>
    </Alert>
  );
}

function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useNotifier();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [recommended, setRecommended] = useState([]);
  const [recLoading, setRecLoading] = useState(true);
  const [similarError, setSimilarError] = useState(false);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await withRetry(() => apiClient.get(`products/${id}`));
      setProduct(data);
      setUserRating(data.rating || 0);
      fetchRecommended();
    } catch (err) {
      setError(err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchRecommended = useCallback(async () => {
    setRecLoading(true);
    setSimilarError(false);
    try {
      const { data } = await withRetry(() =>
        apiClient.get(`products/${id}/similar`)
      );
      setRecommended(Array.isArray(data) ? data : []);
    } catch {
      setSimilarError(true);
      setRecommended([]);
    } finally {
      setRecLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = () => {
    if (product) addToCart(product);
  };

  const handleRatingChange = async (_e, newRating) => {
    setUserRating(newRating);
    try {
      await apiClient.put(`products/${id}/rating`, { rating: newRating });
      notify({ severity: 'success', message: 'Thanks for the feedback!' });
    } catch {
      notify({ severity: 'error', message: 'Rating update failed.' });
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', height: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5">Product not available</Typography>
          <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate('/shop')}>
            Back to shop
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, pb: 6 }}>
      {/* Main Product Info */}
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', maxHeight: 400, objectFit: 'contain' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4">{product.name}</Typography>
            <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
              {formatINR(product.price)}
            </Typography>
            <Typography sx={{ mt: 2 }}>{product.description}</Typography>
            <Rating
              value={userRating}
              precision={0.5}
              onChange={handleRatingChange}
              sx={{ mt: 2 }}
            />
            <Button variant="contained" sx={{ mt: 3 }} onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Recommended Products */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Recommended for you
        </Typography>

        {recLoading ? (
          <CircularProgress size={32} />
        ) : recommended.length === 0 ? (
          similarError ? (
            <SimilarProductsError onRetry={fetchRecommended} />
          ) : (
            <Typography>No recommendations available.</Typography>
          )
        ) : (
          <Grid container spacing={3}>
            {recommended.map(rec => (
              <Grid item xs={12} sm={6} md={3} key={rec._id || rec.id}>
                <Card>
                  <CardActionArea onClick={() => navigate(`/product/${rec._id || rec.id}`)}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={rec.image}
                      alt={rec.name}
                      sx={{ objectFit: 'contain', p: 2 }}
                    />
                    <CardContent>
                      <Typography noWrap>{rec.name}</Typography>
                      <Typography color="primary" variant="h6">
                        {formatINR(rec.price)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}

export default ProductDetails;
