import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { productAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ProductAdd = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState({
    title: '',
    desc: '',
    img: '',
    price: '',
    stock: '',
    categories: [],
    size: '',
    color: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Available categories and sizes for dropdowns
  const availableCategories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty'];
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Purple', 'Orange'];

  // Check if user is admin
  if (!user?.isAdmin) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Access denied. Admin privileges required.</Alert>
      </Container>
    );
  }

  const handleInputChange = (field, value) => {
    setProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setProduct(prev => ({
      ...prev,
      categories: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!product.title || !product.desc || !product.img || !product.price) {
        throw new Error('Please fill in all required fields');
      }

      // Convert price and stock to numbers
      const productData = {
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock) || 0
      };

      const response = await productAPI.addProduct(productData);

      if (response.success || response._id) {
        setSuccess('Product added successfully!');
        setTimeout(() => {
          navigate('/products');
        }, 2000);
      } else {
        setError('Failed to add product');
      }
    } catch (error) {
      setError(error.message || 'Failed to add product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/products')}
            sx={{ mr: 2 }}
          >
            Back to Products
          </Button>
          <Typography variant="h4" component="h1">
            Add New Product
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <TextField
              fullWidth
              label="Product Title *"
              value={product.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Description *"
              value={product.desc}
              onChange={(e) => handleInputChange('desc', e.target.value)}
              multiline
              rows={4}
              required
            />
            <TextField
              fullWidth
              label="Image URL *"
              value={product.img}
              onChange={(e) => handleInputChange('img', e.target.value)}
              required
              helperText="Enter the URL of the product image"
            />
            <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
              <TextField
                fullWidth
                label="Price *"
                type="number"
                value={product.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
              <TextField
                fullWidth
                label="Stock *"
                type="number"
                value={product.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                required
                inputProps={{ min: 0, step: 1 }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
              <FormControl fullWidth>
                <InputLabel>Size</InputLabel>
                <Select
                  value={product.size}
                  label="Size"
                  onChange={(e) => handleInputChange('size', e.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  {availableSizes.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Color</InputLabel>
                <Select
                  value={product.color}
                  label="Color"
                  onChange={(e) => handleInputChange('color', e.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  {availableColors.map((color) => (
                    <MenuItem key={color} value={color}>
                      {color}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Categories</InputLabel>
                <Select
                  multiple
                  value={product.categories}
                  onChange={handleCategoryChange}
                  input={<OutlinedInput label="Categories" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {availableCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/products')}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} /> : <Save />}
              disabled={saving}
            >
              {saving ? 'Adding...' : 'Add Product'}
            </Button>
          </Box>
        </form>

      </Paper>
    </Container>
  );
};

export default ProductAdd; 