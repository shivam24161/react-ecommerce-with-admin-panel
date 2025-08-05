import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    CircularProgress,
} from '@mui/material';
import { LockReset } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { forgotPassword } = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [helpText, setHelpText] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const result = await forgotPassword({ username, helpText, password: newPassword });
            if (result.success) {
                setSuccess(result.message);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Forgot Password
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Provide your details to reset your password
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {success}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        fullWidth
                        label="Help Text (Verification)"
                        value={helpText}
                        onChange={(e) => setHelpText(e.target.value)}
                        required
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        sx={{ mb: 3 }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={loading ? <CircularProgress size={20} /> : <LockReset />}
                        disabled={loading}
                        sx={{ mb: 2 }}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2">
                            Remembered your password?{' '}
                            <Link to="/login" style={{ textDecoration: 'none' }} className="text-link-primary">
                                Go back to login
                            </Link>
                        </Typography>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default ForgotPassword;
