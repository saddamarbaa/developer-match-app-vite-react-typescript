import { AxiosError } from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'

import { loginUser } from '../utils/api'
import { useDispatch } from 'react-redux'
import { setLogInState } from '../features/user/userSlice'

export default function SignInScreen() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { mutate, isError, isSuccess, error, isPending } = useMutation<
		unknown,
		AxiosError,
		{ email: string; password: string },
		unknown
	>({
		mutationFn: loginUser,
		onSuccess: (data: any) => {
			const user = data?.data?.user

			if (user) {
				const data = {
					authToken: user?.authToken || '',
					...user?.user,
				}

				dispatch(setLogInState(data))

				setTimeout(() => {
					navigate('/')
				}, 1000)
			}
		},
		onError: (err: AxiosError) => {
			console.error('Login failed:', err)
		},
	})

	const handleLogin = () => {
		if (!email || !password) {
			alert('Please provide both email and password')
			return
		}

		const data = { email, password }
		mutate(data)
	}

	return (
		<div className="flex items-center justify-center m-28">
			<div className="card bg-base-300 w-full max-w-lg shadow-xl">
				<div className="card-body flex flex-col gap-5 items-center ">
					<h2 className="card-title text-center">Sign Up</h2>

					{/* Email Input */}
					<label className="form-control  w-full">
						<div className="label">
							<span className="label-text">Email</span>
						</div>
						<input
							required
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="input input-bordered"
						/>
					</label>

					{/* Password Input */}
					<label className="form-control  w-full">
						<div className="label">
							<span className="label-text">Password</span>
						</div>
						<input
							required
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="input input-bordered"
						/>
					</label>

					{/* Error Message */}
					{isError && (
						<p className="text-red-500 text-sm mt-2">
							{error instanceof AxiosError
								? error.response?.data?.message || 'An error occurred'
								: 'An error occurred'}
						</p>
					)}

					{/* Success Message */}
					{isSuccess && (
						<p className="text-green-500 text-sm mt-2">
							Account login successfully! Redirecting...
						</p>
					)}

					<div className="card-actions justify-end">
						<button className="btn btn-primary px-8" onClick={handleLogin}>
							{isPending ? (
								<svg
									className="animate-spin h-5 w-5 mr-3  bg-indigo-500"
									viewBox="0 0 24 24"></svg>
							) : null}{' '}
							{isPending ? 'Sign In...' : 'Sign In'}
						</button>
					</div>

					{/* Link to SignIn */}
					<div className="flex flex-row flex-wrap items-center justify-between space-y-2 whitespace-nowrap text-sm sm:space-y-0 sm:text-base">
						<p>
							Don't have an account?
							<Link
								to="/sign-up"
								className="ml-1 text-red-600 transition duration-200 ease-in-out hover:text-red-700">
								Register
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
