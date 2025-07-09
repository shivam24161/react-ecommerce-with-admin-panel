import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import useCheckAdmin from '../components/useCheckAdmin';

const Home = () => {
  const { isAdmin } = useCheckAdmin();
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace={true} />
  }
  else return <Navigate to="/products" replace={true} />
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Our E-Commerce Store
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Discover amazing products at great prices
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/products"
          sx={{ mt: 2 }}
        >
          Browse Products
        </Button>
      </Box>
    </Container>
  );
};

export default Home; 