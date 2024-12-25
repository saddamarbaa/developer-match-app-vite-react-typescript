import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { registerUser } from '../utils/api'

export default function SignUpScreen() {
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const navigate = useNavigate()

	// useMutation hook to handle the sign-up process
	const { mutate, isError, isSuccess, error, isPending } = useMutation<
		unknown,
		AxiosError,
		{
			firstName: string
			lastName: string
			email: string
			password: string
			confirmPassword: string
		},
		unknown
	>({
		mutationFn: registerUser,
		onSuccess: () => {
			setTimeout(() => {
				navigate('/sign-in')
			}, 2000)
		},
	})

	async function handleSignUp() {
		if (!firstName || !lastName || !email || !password || !confirmPassword) {
			alert('Please fill in all fields')
			return
		}

		if (password !== confirmPassword) {
			alert('Passwords do not match')
			return
		}

		const userDetails = {
			firstName,
			lastName,
			email,
			password,
			confirmPassword,
		}

		// Trigger the mutation with userDetails
		mutate(userDetails)
	}

	return (
		<div className="flex items-center justify-center m-28">
			<div className="card bg-base-300 w-full max-w-xl shadow-xl">
				<div className="card-body flex flex-col gap-5 items-center ">
					<h2 className="card-title text-center">Sign Up</h2>

					{/* First Name Input */}
					<label className="form-control w-full">
						<div className="label">
							<span className="label-text">First Name</span>
						</div>
						<input
							required
							type="text"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							className="input input-bordered"
						/>
					</label>

					{/* Last Name Input */}
					<label className="form-control  w-full">
						<div className="label">
							<span className="label-text">Last Name</span>
						</div>
						<input
							required
							type="text"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							className="input input-bordered"
						/>
					</label>

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

					{/* Confirm Password Input */}
					<label className="form-control w-full">
						<div className="label">
							<span className="label-text">Confirm Password</span>
						</div>
						<input
							required
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
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
							Account created successfully! Redirecting...
						</p>
					)}

					{/* SignUp Button */}
					<div className="card-actions justify-end">
						<button className="btn btn-primary px-8" onClick={handleSignUp}>
							{isPending ? (
								<svg
									className="animate-spin h-5 w-5 mr-3  bg-indigo-500"
									viewBox="0 0 24 24"></svg>
							) : null}{' '}
							{isPending ? 'Signing Up...' : 'Sign Up'}
						</button>
					</div>

					{/* Link to SignIn */}
					<div className="flex flex-row flex-wrap items-center justify-between space-y-2 whitespace-nowrap text-sm sm:space-y-0 sm:text-base">
						<p>
							Already have an account?
							<Link
								to="/sign-in"
								className="ml-1 text-red-600 transition duration-200 ease-in-out hover:text-red-700">
								Login
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
