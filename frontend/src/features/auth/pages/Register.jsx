import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import styles from "./Register.module.scss";
import { useAuth } from "../hooks/useAuth";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const { handelRegisterUser } = useAuth()
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            username,
            email,
            password,
        };

        console.log("Form Data:", formData);

        // TODO: Call API here
        await handelRegisterUser(formData)
        navigate("/");
    };

    return (
        <main className={styles.register}>
            <div className={styles.card}>
                <h2>Create Account</h2>

                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            value={username}                  // State → UI
                            onChange={(e) => setUsername(e.target.value)} // UI → State
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="button">
                        Register
                    </button>
                </form>

                <p className={styles.loginText}>
                    Already have an account?
                    <Link to="/login"> Login</Link>
                </p>
            </div>
        </main>
    );
}

export default Register;