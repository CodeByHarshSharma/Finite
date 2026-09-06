import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, register, getMe } from '../services/auth.api.js'

export function useAuth() {
    const context = useContext(AuthContext)
    const { user, loading, setUser, setLoading } = context

    const handleLogin = async (username, password) => {
        setLoading(true)

        try {
            const response = await login(username, password)
            setUser(response.user)
            return response
        }
        finally {
            setLoading(false)
        }

    }

    const handleRegister = async (username, email, password) => {
        setLoading(true)

        try {
            const response = await register(username, email, password)
            setUser(response.user)
        }
        finally {
            setLoading(false)
        }

    }

    return {
        user, loading, handleLogin, handleRegister
    }

}