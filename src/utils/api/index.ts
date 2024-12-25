import axios from 'axios'

axios.defaults.withCredentials = true

export const BASE_API_URL = 'http://localhost:5000/api/v1'

const apiService = axios.create({
	baseURL: BASE_API_URL,
	withCredentials: true,
})

// Generic function to login a user
export async function loginUser(credentials: {
	email: string
	password: string
}) {
	const response = await axios.post(
		'http://localhost:5001/api/v1/auth/login',
		credentials,
		{ withCredentials: true },
	)
	return response.data
}

export async function logoutUser() {
	const response = await axios.post(
		'http://localhost:5001/api/v1/auth/logout',
		{},
		{ withCredentials: true },
	)
	return response.data
}

export async function getUserProfile() {
	const response = await axios.get('http://localhost:5001/api/v1/auth/me', {
		withCredentials: true,
	})
	return response.data
}

// Function to register a new user
export async function registerUser(userDetails: {
	firstName: string
	lastName: string
	email: string
	password: string
	confirmPassword: string
}) {
	const response = await axios.post(
		'http://localhost:5001/api/v1/auth/signup',
		userDetails,
		{ withCredentials: true },
	)
	return response.data
}

export default apiService
