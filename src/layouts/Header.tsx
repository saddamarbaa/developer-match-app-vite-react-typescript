import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Link, useNavigate } from 'react-router'
import { AxiosError } from 'axios'

import { setLogOutState } from '../features/user/userSlice'
import { useMutation } from '@tanstack/react-query'
import { logoutUser } from '../utils/api'

export default function Header() {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { user } = useSelector((state: RootState) => state.user)

	const { mutate, isError, isSuccess, error, isPending } = useMutation<
		unknown,
		AxiosError,
		unknown
	>({
		mutationFn: logoutUser,
		onSuccess: () => {
			dispatch(setLogOutState())
			setTimeout(() => {
				navigate('/sign-in')
			}, 1000)
		},
		onError: (err: AxiosError) => {
			console.error('Login failed:', err)
		},
	})

	async function handleLogout() {
		mutate({})
		// dispatch(setLogOutState())
		// navigate('/sign-in')
	}

	return (
		<div className="navbar bg-base-300">
			<div className="flex-1">
				<Link to={'/'}>
					<a className="btn btn-ghost text-xl">👦 Dev Tinder</a>
				</Link>
			</div>

			{user && (
				<div className="flex-none ">
					{user && <h1>Welcome {user?.firstName}</h1>}
					<div className="dropdown dropdown-end mx-8">
						<div
							tabIndex={0}
							role="button"
							className="btn btn-ghost btn-circle avatar">
							<div className="w-10 rounded-full">
								{user && (
									<img
										alt="Tailwind CSS Navbar component"
										src={
											user?.profileUrl ||
											'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
										}
									/>
								)}
							</div>
						</div>
						<ul
							tabIndex={0}
							className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
							<li>
								<Link to={'/profile'}>
									<a className="justify-between">Profile</a>
								</Link>
							</li>
							<li onClick={handleLogout}>
								<a>Logout</a>
							</li>
						</ul>
					</div>
				</div>
			)}
		</div>
	)
}
