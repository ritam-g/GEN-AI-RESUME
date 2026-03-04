import { useContext } from "react";
import { login, register, getUser, logout } from "../services/auth.api";
import { context } from "../context/AuthContext";

export function useAuth() {
    const { loading, setLoading, user, setUser } = useContext(context)
    async function handelUserLogin({ email, password }) {
        try {
            setLoading(true)
            const data = await login({ email, password })
            setUser(data.user)
            
            return data.user
        } catch (err) {
            throw err
        }finally{
            setLoading(false)
        }
    }
    async function handelRegisterUser({ username, email, password }) {
        try {
            setLoading(true)
            const res = await register({ username, email, password })
            setUser(res.user)
            
            return res.user
        } catch (err) {
            throw err
        }finally{
            setLoading(false)
        }
    }
    async function handelUserLogout() {
        try {
            setLoading(true)
            const res = await logout()
            setUser(null)
            

        } catch (err) {
            throw err
        }finally{
            setLoading(false)
        }
    }
    return { handelUserLogin, handelRegisterUser, loading }

}