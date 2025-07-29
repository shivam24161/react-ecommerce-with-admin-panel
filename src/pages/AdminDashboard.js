import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  People,
  ShoppingCart,
  Inventory,
  AttachMoney,
  TrendingUp,
  Visibility
} from '@mui/icons-material';
import { adminAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) return;
    fetchDashboardStats();
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      } else {
        setError('Failed to fetch dashboard statistics');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!user?.isAdmin) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Access denied. Admin privileges required.</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading dashboard...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={fetchDashboardStats} variant="contained">
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="card-shadow" sx={{ transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 8px 32px rgba(25, 118, 210, 0.18)' } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats?.totalUsers || 0}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Users
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/admin/users')}>
                View Users
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="card-shadow" sx={{ transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 8px 32px rgba(25, 118, 210, 0.18)' } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Inventory sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats?.totalProducts || 0}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Products
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/products')}>
                View Products
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="card-shadow" sx={{ transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 8px 32px rgba(25, 118, 210, 0.18)' } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ShoppingCart sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats?.totalOrders || 0}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Orders
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/admin/orders')}>
                View Orders
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="card-shadow" sx={{ transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 8px 32px rgba(25, 118, 210, 0.18)' } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoney sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {formatCurrency(stats?.totalRevenue || 0)}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Revenue
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/admin/orders')}>
                View Orders
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Orders</Typography>
              <Button variant="outlined" onClick={() => navigate('/admin/orders')}>
                View All Orders
              </Button>
            </Box>
            
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>{order._id.slice(-8)}</TableCell>
                        <TableCell>{order.userId?.username || 'N/A'}</TableCell>
                        <TableCell>{formatCurrency(order.amount)}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            color={getStatusColor(order.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <Tooltip title="View Order">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/admin/orders/${order._id}`)}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="text.secondary" align="center">
                No recent orders
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Inventory />}
                onClick={() => navigate('/product/add')}
                fullWidth
              >
                Add New Product
              </Button>
              <Button
                variant="outlined"
                startIcon={<People />}
                onClick={() => navigate('/admin/users')}
                fullWidth
              >
                Manage Users
              </Button>
              <Button
                variant="outlined"
                startIcon={<ShoppingCart />}
                onClick={() => navigate('/admin/orders')}
                fullWidth
              >
                Manage Orders
              </Button>
              <Button
                variant="outlined"
                startIcon={<TrendingUp />}
                onClick={() => navigate('/admin/products')}
                fullWidth
              >
                Product Analytics
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 