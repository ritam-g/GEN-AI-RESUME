import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/auth` : `http://localhost:3000/api/auth/`,
    withCredentials: true
})

export async function login({ email, password }) {
    const res = await api.post('/login', { email, password })
    return res.data
}
export async function register({ username, email, password }) {
    const res = await api.post('/register', { username, email, password })
    return res.data
}
export async function getUser() {
    const res = await api.get('/getme')
    return res.data
}
export async function logout() {
    const res = await api.get('/logout')
    return res.data
}