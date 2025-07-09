import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { productAPI } from '../services/api';
import { cartAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import useCheckAdmin from '../components/useCheckAdmin';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const { user } = useContext(AuthContext);
  const { isAdmin } = useCheckAdmin();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productAPI.getProduct(id);
        if (response.success) {
          setProduct(response.data);
        } else {
          setError('Failed to load product');
        }
      } catch (error) {
        setError(error.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      if (!user?._id) {
        setCartMessage('Please login to add to cart');
        return;
      }
      const response = await cartAPI.addToCart(user._id, product._id, 1);
      if (response.success) {
        setCartMessage('Added to cart!');
      } else {
        setCartMessage(response.message || 'Failed to add to cart');
      }
    } catch (err) {
      setCartMessage('Failed to add to cart');
    }
    setTimeout(() => setCartMessage(''), 2000);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Product not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {cartMessage && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {cartMessage}
        </Alert>
      )}
      <Button
        startIcon={<ArrowBack />}
        component={Link}
        to="/products"
        sx={{ mb: 3 }}
      >
        Back to Products
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card className="card-shadow" sx={{ transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 8px 32px rgba(25, 118, 210, 0.18)' } }}>
            <CardMedia
              component="img"
              height="400"
              image={product.img}
              alt={product.title}
              sx={{ objectFit: 'cover' }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.title}
            </Typography>

            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price}
            </Typography>

            <Typography variant="body1" paragraph>
              {product.desc}
            </Typography>

            {product.categories && product.categories.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Categories:
                </Typography>
                {product.categories.map((category, index) => (
                  <Chip
                    key={index}
                    label={category}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            )}

            {(product.size || product.color) && (
              <Box sx={{ mb: 3 }}>
                {product.size && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Size:</strong> {product.size}
                  </Typography>
                )}
                {product.color && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Color:</strong> {product.color}
                  </Typography>
                )}
              </Box>
            )}

            {!isAdmin && <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{ mb: 2 }}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail; 