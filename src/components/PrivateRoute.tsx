import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'

import { getUserProfile } from '../utils/api'
import Spinner from './Spinner'
import { setLogInState } from '../features/user/userSlice'
import { RootState } from '../redux/store'

export default function PrivateRoute() {
	const { user } = useSelector((state: RootState) => state.user)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { data, error, isLoading, isSuccess, isError } = useQuery({
		queryKey: ['userProfile'],
		queryFn: getUserProfile,
		// enabled: !user,
	})

	useEffect(() => {
		if (isSuccess && data?.data?.user) {
			const user = data.data.user
			dispatch(setLogInState({ authToken: user?.authToken || '', ...user }))
		}
	}, [isSuccess, data, dispatch])

	useEffect(() => {
		if (isError) {
			setTimeout(() => {
				// navigate('/sign-in')
			}, 1000)
		}
	}, [isError, navigate])

	if (isLoading) {
		return <Spinner />
	}

	if (isError || error) {
		const errorMessage = error?.response?.data?.message || 'An error occurred.'
		return (
			<div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center px-6 py-12">
				<div className="card bg-neutral text-neutral-content w-96">
					<div className="card-body items-center text-center">
						{errorMessage}
						<br />
						Redirecting to login...
					</div>
				</div>
			</div>
		)
	}

	return (
		<section className="py-20">
			<Outlet />
		</section>
	)
}
