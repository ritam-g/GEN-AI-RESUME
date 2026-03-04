import { useContext } from "react";
import { login, register, getUser, logout } from "../services/auth.api";
import { context } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";

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

            return data.user
        } catch (err) {
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

            return res.user
        } catch (err) {
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
        } catch (err) {
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
    useEffect(() => {
        async function getAndSetUser() {
            await handelGetUser()
        }
        getAndSetUser()
    }, [])

    return { handelUserLogin, handelRegisterUser, loading, user, handelUserLogout, handelGetUser }

}
