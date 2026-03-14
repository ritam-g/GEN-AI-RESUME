import React, { useEffect } from 'react'
import { useState } from 'react'
import { createContext } from 'react'
import { getUser } from '../services/auth.api'

export const context = createContext()

function AuthContext({ children }) {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    useEffect(() => {
        async function getAndSetUser() {
            const storedUser = localStorage.getItem('user')
            if (storedUser) {
                try {
                    const res = await getUser()
                    setUser(res.user)
                } catch (err) {
                    localStorage.removeItem('user')
                }
            }
            setLoading(false)
        }
        getAndSetUser()
    }, [])

    return (
        <context.Provider value={{ loading, setLoading, user, setUser }}>
            {children}
        </context.Provider>
    )
}

export default AuthContext
