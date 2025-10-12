import axios from "axios"

import { API_BASE_URL, API_TIMEOUT } from "@/config/api"

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
})

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("ni.token")
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.dispatchEvent(new CustomEvent("ni:unauthorized"))
        }
        return Promise.reject(error)
    }
)
