import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";
import AuthLayout from "../../components/AuthLayout/AuthLayout";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { handelUserLogin, loading, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handelUserLogin({ email, password });
            navigate("/");
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    return (
        <AuthLayout 
            title="Welcome Back" 
            subtitle="Enter your credentials to access your dashboard."
        >
            <form onSubmit={handleSubmit} className="auth__form">
                <div className="auth__field">
                    <div className="label-row">
                        <label htmlFor="email">Email Address</label>
                    </div>
                    <input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="auth__field">
                    <div className="label-row">
                        <label htmlFor="password">Password</label>
                        <Link to="/forgot-password" title="Forgot password?" className="forgot-link">Forgot password?</Link>
                    </div>
                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <label className="auth__checkbox">
                    <input type="checkbox" />
                    Keep me logged in
                </label>

                <button 
                    type="submit" 
                    className={`auth__submit ${loading ? 'loading' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div className="auth__divider">
                <span>OR CONTINUE WITH</span>
            </div>

            <div className="auth__social-group">
                <button type="button">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.svg" alt="Google" />
                    Google
                </button>
                <button type="button">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub" />
                    GitHub
                </button>
            </div>

            <div className="auth__footer-link">
                Don't have an account? <Link to="/register">Create Account</Link>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
