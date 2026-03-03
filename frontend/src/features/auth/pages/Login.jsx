import React, { useState } from "react";
import { Link } from "react-router";
import styles from "./Login.module.scss";

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login Data:", form);
    };

    return (
        <main className={styles.wrapper}>
            <section className={styles.card}>
                <header className={styles.header}>
                    <h1>Welcome Back</h1>
                    <p>Please enter your details to sign in</p>
                </header>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.button}>
                        Sign In
                    </button>
                </form>

                <footer className={styles.footer}>
                    <p>
                        Don’t have an account?{" "}
                        <Link to="/register">Create account</Link>
                    </p>
                </footer>
            </section>
        </main>
    );
}

export default Login;