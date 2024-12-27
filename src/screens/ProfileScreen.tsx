import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { useState, useEffect } from 'react'
import { AxiosError } from 'axios'
import { updateUserProfile } from '../utils/api'
import { useMutation } from '@tanstack/react-query'
import { setLogInState } from '../features/user/userSlice'

export default function ProfileScreen() {
	const dispatch = useDispatch()
	const { user } = useSelector((state: RootState) => state.user)

	// Local state for editable fields
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [bio, setBio] = useState('')
	const [profileUrl, setProfileUrl] = useState('')

	useEffect(() => {
		if (user) {
			setFirstName(user.firstName)
			setLastName(user.lastName)
			setBio(user.bio || '')
			setProfileUrl(user.profileUrl || '')
		}
	}, [user])

	const {
		mutate,
		isError,
		isSuccess,
		error,
		isPending: isUpdating,
	} = useMutation<
		unknown,
		AxiosError,
		{
			firstName: string
			lastName: string
			bio: string
			profileUrl: string
		}
	>({
		mutationFn: (updatedUserDetails) => {
			if (user) {
				return updateUserProfile(user._id, updatedUserDetails)
			}
			throw new Error('User not found')
		},
		onSuccess: (data) => {
			if (data?.data?.user) {
				const user = data.data.user
				dispatch(setLogInState({ authToken: user?.authToken || '', ...user }))
			}
		},
	})

	const handleProfileUpdate = () => {
		// Prepare updated data
		const updatedUserInfo = {
			firstName,
			lastName,
			bio,
			profileUrl,
		}
		mutate(updatedUserInfo)
	}

	return (
		<div className="flex items-center justify-center m-28">
			<div className="card bg-base-300 w-full max-w-xl shadow-xl">
				<div className="card-body flex flex-col gap-5 items-center ">
					<h2 className="card-title text-center">Profile</h2>

					{/* Profile Picture (URL) */}
					<div className="flex flex-col items-center">
						<img
							src={profileUrl || '/default-profile.png'}
							alt="Profile"
							className="w-24 h-24 rounded-full mb-4"
						/>
					</div>

					<label className="form-control w-full">
						<div className="label">
							<span className="label-text">Profile Picture URL</span>
						</div>
						<input
							type="text"
							value={profileUrl}
							onChange={(e) => setProfileUrl(e.target.value)}
							className="input input-bordered"
						/>
					</label>

					{/* First Name Input */}
					<label className="form-control w-full">
						<div className="label">
							<span className="label-text">First Name</span>
						</div>
						<input
							type="text"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							className="input input-bordered"
						/>
					</label>

					{/* Last Name Input */}
					<label className="form-control w-full">
						<div className="label">
							<span className="label-text">Last Name</span>
						</div>
						<input
							type="text"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							className="input input-bordered"
						/>
					</label>

					{/* Email Input (Disabled) */}
					<label className="form-control w-full">
						<div className="label">
							<span className="label-text">Email</span>
						</div>
						<input
							type="email"
							value={user?.email || ''}
							disabled
							className="input input-bordered"
						/>
					</label>

					{/* Bio Input */}
					<label className="form-control w-full">
						<div className="label">
							<span className="label-text">Bio</span>
						</div>
						<textarea
							value={bio}
							onChange={(e) => setBio(e.target.value)}
							className="textarea textarea-bordered"
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
							Profile updated successfully!
						</p>
					)}
					<div className="card-actions justify-end">
						<button
							className="btn btn-primary px-8"
							onClick={handleProfileUpdate}
							disabled={isUpdating}>
							{isUpdating ? (
								<svg
									className="animate-spin h-5 w-5 mr-3 bg-indigo-500"
									viewBox="0 0 24 24"></svg>
							) : null}
							{isUpdating ? 'Updating Profile...' : 'Update Profile'}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
