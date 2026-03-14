import { useContext } from "react";
import { login, register, getUser, logout } from "../services/auth.api";
import { context } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";

import toast from "react-hot-toast";

export function useAuth() {
    const { loading, setLoading, user, setUser } = useContext(context)
    //NOTE - flow of the code 
    const navigate = useNavigate()
    /** loding will true call api loding false return api data */
    async function handelUserLogin({ email, password }) {
        try {
            setLoading(true)
            const data = await login({ email, password })
            setUser(data.user)
            // FIX: Store user in localStorage to persist session across page reloads
            // This prevents 401 errors because we can check localStorage before calling /api/auth/getme
            localStorage.setItem('user', JSON.stringify(data.user))
            toast.success("Welcome back!", { id: 'login-success' })
            return data.user
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed. Please check your credentials.")
            throw err
        } finally {
            setLoading(false)
        }
    }
    async function handelRegisterUser({ username, email, password }) {
        try {
            setLoading(true)
            const res = await register({ username, email, password })
            setUser(res.user)
            toast.success("Account created successfully!")
            return res.user
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed. Please try again.")
            throw err
        } finally {
            setLoading(false)
        }
    }
    async function handelUserLogout() {
        try {
            setLoading(true)
            const res = await logout()
            setUser(null)
            // FIX: Clear user from localStorage on logout
            localStorage.removeItem('user')
            toast.success("Logged out successfully")
        } catch (err) {
            toast.error("Logout failed")
            throw err
        } finally {
            setLoading(false)
        }
    }
    async function handelGetUser() {
        try {
            setLoading(true)
            const res = await getUser()
            setUser(res.user)
            return res.user
        } catch (err) {
            setUser(null)
            throw err
        } finally {
            setLoading(false)
        }
    }
    /** 
     * FIX: Before this fix, the app would make a /api/auth/getme call on every page load
     * even when the user was not logged in, causing 401 Unauthorized errors.
     * Now we check if user exists in localStorage before making the API call.
     */
    return { handelUserLogin, handelRegisterUser, loading, user, handelUserLogout, handelGetUser }

}
