import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Typography } from "@mui/material";
import axios from 'axios';
import { useRouter } from 'next/router';
import { setTokenCookie } from '@/lib/auth-cookie';

const LoginModal: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/router?path=api/auth/login', {
                username,
                password
            });
            setTokenCookie(null, response.data.token);
            let isSameDomain = false;
            try {
                isSameDomain = new URL(window.document.referrer).origin === window.location.origin;
            } catch (err) {
                console.warn("Invalid or empty referrer");
            }
            if (typeof window !== 'undefined' && window.history.length > 2 && isSameDomain) {
                router.back();
            } else {
                router.push('/');
            }
        } catch (err: any) {
            console.log(err.message);
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <Dialog open={true} onClose={() => { }}>
            <DialogTitle>
                <img
                    src={"/images/toyota.png"}
                    alt="Logo"
                    style={{ width: '75%', height: '200px', marginLeft: '40px' }}
                />
                <h2>Login</h2>
                <p>Sign In to your account</p>
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Username"
                    type="text"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <Typography color="error">{error}</Typography>}
            </DialogContent>
            <DialogActions>
                <Button
                    style={{
                        borderRadius: 15,
                        backgroundColor: "#E96820",
                        fontSize: "13px"
                    }}
                    onClick={handleLogin}
                    variant="contained"
                >
                    Login
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default LoginModal;
