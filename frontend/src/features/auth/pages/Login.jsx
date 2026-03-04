import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import styles from "./Login.module.scss";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { handelUserLogin ,loading} = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await handelUserLogin({ email, password });
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };
  if(loading)return (<h2>loading</h2>)
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
              type="email"
              placeholder="you@example.com"
              value={email}               // State → UI
              onChange={(e) => setEmail(e.target.value)} // UI → State
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="button">
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