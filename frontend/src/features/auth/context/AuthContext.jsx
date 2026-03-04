import React from 'react'
import { useState } from 'react'
import { createContext } from 'react'
export const context = createContext()
function AuthContext({ children }) {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)
    return (
        <context.Provider value={{ loading, setLoading, user, setUser }}>
            {children}
        </context.Provider>
    )
}

export default AuthContext
