import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Box, Button, CircularProgress, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { cartAPI } from '../services/api';
import { productAPI, orderAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsInfo, setProductsInfo] = useState({});
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!user?._id) return;
        const data = await cartAPI.getCart(user._id);
        let cartObj = null;
        if (Array.isArray(data.data) && data.data.length > 0) {
          cartObj = data.data[0];
        } else if (data.cart) {
          cartObj = data.cart;
        }
        setCart(cartObj);
        // Fetch product details for each product in cart
        if (cartObj && cartObj.products && cartObj.products.length > 0) {
          const productDetails = {};
          await Promise.all(
            cartObj.products.map(async (item) => {
              try {
                const prod = await productAPI.getProduct(item.productId);
                productDetails[item.productId] = prod.product || prod.data || prod;
              } catch (e) {
                productDetails[item.productId] = { name: 'Unknown', price: 0 };
              }
            })
          );
          setProductsInfo(productDetails);
        } else {
          setProductsInfo({});
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch cart');
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) fetchCart();
  }, [user]);

  // Calculate total price
  const totalPrice = cart && cart.products && cart.products.length > 0
    ? cart.products.reduce((sum, item) => {
        const prod = productsInfo[item.productId];
        return sum + ((prod?.price || 0) * item.quantity);
      }, 0)
    : 0;

  // Place order handler
  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    setOrderError(null);
    try {
      if (!address) {
        setOrderError('Please enter a delivery address.');
        setPlacingOrder(false);
        return;
      }
      const orderData = {
        userId: user._id,
        products: cart.products.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        amount: totalPrice,
        address,
      };
      await orderAPI.createOrder(orderData);
      setOrderSuccess(true);
      // Clear cart after order
      if (cart && cart.products && cart.products.length > 0) {
        await Promise.all(
          cart.products.map(item => cartAPI.removeFromCart(user._id, item.productId))
        );
      }
      setCart({ ...cart, products: [] });
      setTimeout(() => {
        navigate('/products');
      }, 1200);
    } catch (err) {
      setOrderError(err.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : !cart || !cart.products || cart.products.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" paragraph>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/products"
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <Box>
          <List>
            {cart.products.map((item, idx) => {
              const prod = productsInfo[item.productId] || {};
              return (
                <React.Fragment key={item.productId || idx}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <>
                          {prod.name || `Product ID: ${item.productId}`} - Qty: {item.quantity} - Price: ₹{prod.price || 0} - Subtotal: ₹{(prod.price || 0) * item.quantity}
                        </>
                      }
                    />
                  </ListItem>
                  {idx < cart.products.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
          <Box sx={{ mt: 3, mb: 2, textAlign: 'right' }}>
            <Typography variant="h6">Total: ₹{totalPrice}</Typography>
          </Box>
          {orderSuccess ? (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography color="success.main">Order placed successfully!</Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <input
                type="text"
                placeholder="Enter delivery address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                style={{ padding: '8px', width: '60%', marginBottom: 8 }}
                disabled={placingOrder}
              />
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                sx={{ mt: 1 }}
              >
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </Button>
              {orderError && (
                <Typography color="error" sx={{ mt: 1 }}>{orderError}</Typography>
              )}
            </Box>
          )}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              component={Link}
              to="/products"
            >
              Continue Shopping
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Cart; 