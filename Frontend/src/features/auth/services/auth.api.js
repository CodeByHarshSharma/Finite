import axios from "axios";

const api = axios.create({
    baseURL: "/api/auth",
    withCredentials: true
})

export async function register(username, email, password){
    try {
        const response = await api.post('/register',{
            username,
            email,
            password,
        })

        return response.data
    } catch (error) {
        throw error
    }
}

export async function login(username, password){
    try {
        const response = await api.post('/login',{
            username,
            password,
        })

        return response.data
    } catch (error) {
        throw error
    }
}

export async function getMe() {
    try {
        const response = await api.get('/get-me')
        return response.data
    } catch (error) {
        throw error
    }
}

export async function logout() {
    try {
        const response = await api.post('/logout')
        return response.data
    } catch (error) {
        throw error
    }
}