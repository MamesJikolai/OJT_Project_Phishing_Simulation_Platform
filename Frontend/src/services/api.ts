import axios from 'axios'

// Toggle this flag when you are ready to connect to Django

// The base URL will point to your React dev server for public files,
// or your Django server when the mock is disabled.
const BASE_URL = 'http://localhost:8000/api/v1/'

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request Interceptor: Attach the JWT access token
apiClient.interceptors.request.use(
    (config) => {
        // Grab the access token from local storage
        const token = localStorage.getItem('access_token')

        // If it exists, attach it to the Authorization header
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response Interceptor: Handle 401s and Token Refresh
apiClient.interceptors.response.use(
    (response) => {
        // Any status code that lies within the range of 2xx causes this function to trigger
        return response
    },
    async (error) => {
        // Any status codes that fall outside the range of 2xx cause this function to trigger
        const originalRequest = error.config

        // If the error is 401 Unauthorized and we haven't already retried this request
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true // Mark as retried to prevent infinite loops

            try {
                const refreshToken = localStorage.getItem('refresh_token')

                if (!refreshToken) {
                    throw new Error('No refresh token available')
                }

                // Call the RefreshView endpoint using standard axios to avoid triggering our interceptors again
                const response = await axios.post(`${BASE_URL}auth/refresh/`, {
                    refresh: refreshToken,
                })

                // Save the brand new access token
                const newAccessToken = response.data.access
                localStorage.setItem('access_token', newAccessToken)

                // Update the Authorization header on the failed request and retry it
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return apiClient(originalRequest)
            } catch (refreshError) {
                // If the refresh token is expired or invalid, clear everything
                console.error('Session expired. Please log in again.')
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')

                // Redirect to login page (adjust the path to match your router)
                window.location.href = '/login'

                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)
