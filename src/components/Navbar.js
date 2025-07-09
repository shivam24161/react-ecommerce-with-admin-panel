import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import { ShoppingCart, Add, ExitToApp, AdminPanelSettings, Dashboard, Inventory } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAdminMenuOpen = (event) => {
    setAdminMenuAnchor(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminMenuAnchor(null);
  };

  return (
    <AppBar position="static" elevation={2} sx={{ bgcolor: 'primary.main' }}>
      <Toolbar sx={{ minHeight: 64, px: { xs: 1, sm: 3 } }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'common.white',
            fontWeight: 700,
            letterSpacing: 1,
            '&:hover': { color: 'secondary.light' },
          }}
        >
          E-Commerce Store
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <Button color="inherit" component={Link} to="/" sx={{ fontWeight: 500, '&:hover': { bgcolor: 'primary.dark', color: 'secondary.main' } }}>
            Home
          </Button>
          <Button color="inherit" component={Link} to="/products" sx={{ fontWeight: 500, '&:hover': { bgcolor: 'primary.dark', color: 'secondary.main' } }}>
            Products
          </Button>

          {user?.isAdmin && (
            <>
              <Button
                color="inherit"
                startIcon={<AdminPanelSettings />}
                onClick={handleAdminMenuOpen}
                sx={{ fontWeight: 500, '&:hover': { bgcolor: 'primary.dark', color: 'secondary.main' } }}
              >
                Admin
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/product/add"
                startIcon={<Add />}
                sx={{ fontWeight: 500, '&:hover': { bgcolor: 'primary.dark', color: 'secondary.main' } }}
              >
                Add Product
              </Button>
              <Menu
                anchorEl={adminMenuAnchor}
                open={Boolean(adminMenuAnchor)}
                onClose={handleAdminMenuClose}
              >
                <MenuItem onClick={() => { handleAdminMenuClose(); navigate('/admin/dashboard'); }}>
                  <Dashboard sx={{ mr: 1 }} />
                  Dashboard
                </MenuItem>
                <MenuItem onClick={() => { handleAdminMenuClose(); navigate('/admin/users'); }}>
                  <AdminPanelSettings sx={{ mr: 1 }} />
                  Manage Users
                </MenuItem>
                <MenuItem onClick={() => { handleAdminMenuClose(); navigate('/admin/orders'); }}>
                  <ShoppingCart sx={{ mr: 1 }} />
                  Manage Orders
                </MenuItem>
                <MenuItem onClick={() => { handleAdminMenuClose(); navigate('/admin/products'); }}>
                  <Inventory sx={{ mr: 1 }} />
                  Product Analytics
                </MenuItem>
              </Menu>
            </>
          )}

          {!user?.isAdmin && <IconButton color="inherit" component={Link} to="/cart" sx={{ '&:hover': { bgcolor: 'primary.dark', color: 'secondary.main' } }}>
            <Badge badgeContent={0} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>}

          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'common.white', fontWeight: 500 }}>
                Welcome, {user.username}
              </Typography>
              <IconButton color="inherit" onClick={handleLogout} sx={{ '&:hover': { bgcolor: 'primary.dark', color: 'secondary.main' } }}>
                <ExitToApp />
              </IconButton>
            </Box>
          ) : (
            <Button color="inherit" component={Link} to="/login" sx={{ fontWeight: 500, '&:hover': { bgcolor: 'primary.dark', color: 'secondary.main' } }}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 