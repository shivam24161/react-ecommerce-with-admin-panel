import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Edit, Visibility, Add, Delete } from '@mui/icons-material';
import { productAPI } from '../services/api';
import { cartAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import useCheckAdmin from '../components/useCheckAdmin';

const ProductList = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const { isAdmin } = useCheckAdmin();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAllProducts();
      if (response.success) {
        setProducts(response.data);
      } else {
        setError('Failed to load products');
      }
    } catch (error) {
      setError(error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      if (!user?._id) {
        setCartMessage('Please login to add to cart');
        return;
      }
      const response = await cartAPI.addToCart(user._id, productId, 1);
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

  const handleProductStatus = async (productId, status = false) => {
    try {
      const response = await productAPI.updateProductStatus(productId, status);
      if (response.success) {
        fetchProducts();
      }
      else {
        setError('Failed to load products');
      }
    } catch (error) {
      setError(error.message || 'Failed to load products');
    }
  }

  const handleDeleteItem = async (productId) => {
    try {
      const response = await productAPI.deleteProduct(productId);
      if (response.success) {
        fetchProducts();
      }
      else {
        setError('Failed to load products');
      }
    } catch (error) {
      setError(error.message || 'Failed to load products');
    }
  }

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Products
        </Typography>
        {user?.isAdmin && (
          <Button
            variant="contained"
            startIcon={<Add />}
            component={Link}
            to="/product/add"
          >
            Add Product
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {cartMessage && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {cartMessage}
        </Alert>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
        {products.map((product) => (
          <Card key={product._id} className="card-shadow" sx={{ display: 'flex', flexDirection: 'column', maxHeight: 420, width: '100%', boxShadow: 3, borderRadius: 3, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 8px 32px rgba(25, 118, 210, 0.18)' } }}>
            <CardMedia
              component="img"
              image={product.img}
              alt={product.title}
              sx={{ height: 160, maxHeight: 160, minHeight: 160, objectFit: 'contain', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
            />
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2, minHeight: 180, maxHeight: 180 }}>
              <Box>
                <Typography gutterBottom variant="h6" component="h2" noWrap sx={{ fontWeight: 600 }}>
                  {product.title}
                </Typography>
                <div style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {product.desc.length > 80
                      ? `${product.desc.substring(0, 80)}...`
                      : product.desc
                    }
                  </Typography>
                  {isAdmin && <>{product.active ? <Typography variant='body2' color='success'>Active</Typography> : <Typography variant='body2' color='warning'>Inactive</Typography>}</>}
                </div>
                <div style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
                  <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {product.categories && product.categories.map((category, index) => (
                      <Chip
                        key={index}
                        label={category}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                  {isAdmin && <Typography variant='body2' color='info'>Stock: {product?.stock}</Typography>}
                </div>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                  ${product.price}
                </Typography>
                <Box>
                  {product.size && (
                    <Chip label={product.size} size="small" sx={{ mr: 0.5 }} />
                  )}
                  {product.color && (
                    <Chip label={product.color} size="small" />
                  )}
                </Box>
              </Box>
            </CardContent>
            <Box sx={{ display: 'flex', gap: 1, p: 2, pt: 0 }}>
              <Tooltip title="View Details">
                <IconButton
                  component={Link}
                  to={`/product/${product._id}`}
                  size="small"
                  color="primary"
                >
                  <Visibility />
                </IconButton>
              </Tooltip>
              {isAdmin && (
                <>
                  <Tooltip title="Edit Product">
                    <IconButton
                      component={Link}
                      to={`/product/edit/${product._id}`}
                      size="small"
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => handleProductStatus(product._id, !product?.active)}
                    sx={{ flex: 1, fontWeight: 600 }}
                    style={{ color: product.active ? "#ed6c02" : "#2e7d32" }}
                  >
                    {product.active ? "Deactivate" : "Activate"}
                  </Button>
                  <IconButton
                    component={Link}
                    size="small"
                    color="warning"
                    onClick={() => handleDeleteItem(product._id)}
                  >
                    <Delete />
                  </IconButton>
                </>
              )}
              {!isAdmin && <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => handleAddToCart(product._id)}
                sx={{ flex: 1, fontWeight: 600 }}
              >
                Add to Cart
              </Button>}
            </Box>
          </Card>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ProductList; 