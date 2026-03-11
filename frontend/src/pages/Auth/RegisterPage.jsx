import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";
import AuthLayout from "../../components/AuthLayout/AuthLayout";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { handelRegisterUser, loading, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            await handelRegisterUser({ username: name, email, password });
            navigate("/");
        } catch (err) {
            console.error("Registration failed:", err);
        }
    };

    return (
        <AuthLayout 
            title="Create Account" 
            subtitle="Start your journey with AI-powered career prep."
        >
            <form onSubmit={handleSubmit} className="auth__form">
                <div className="auth__field">
                    <div className="label-row">
                        <label htmlFor="name">Full Name</label>
                    </div>
                    <input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

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

                <div className="auth__field">
                    <div className="label-row">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                    </div>
                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className={`auth__submit ${loading ? 'loading' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>
            </form>

            <div className="auth__divider">
                <span>OR SIGN UP WITH</span>
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
                Already have an account? <Link to="/login">Login</Link>
            </div>
        </AuthLayout>
    );
};

export default RegisterPage;
