import { AxiosError } from 'axios'

import Spinner from '../components/Spinner'
import { getRequests, requestReview } from '../utils/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export default function RequestScreen() {
	const queryClient = useQueryClient()
	const { mutate } = useMutation<
		unknown,
		AxiosError,
		{ status: string; requestId: string },
		unknown
	>({
		mutationFn: requestReview,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['userRequests'] })
		},
		onError: (err: AxiosError) => {
			console.error('Login failed:', err)
		},
	})

	const { data, error, isLoading, isSuccess, isError } = useQuery({
		queryKey: ['userRequests'],
		queryFn: getRequests,
	})

	const users = data?.data || []

	if (isLoading) {
		return <Spinner />
	}

	const handleClick = async (
		status: 'accepted' | 'rejected',
		requestId: string,
	) => {
		mutate({ status, requestId: requestId })
	}

	return (
		<div className="flex flex-col items-center space-y-6">
			<h1 className="text-4xl font-bold mb-11">Requests</h1>
			{isSuccess && !users.length && (
				<div className="card bg-base-300 w-96 shadow-xl">
					<div className="card-body">
						<p className="text-center">No requests found</p>
					</div>
				</div>
			)}
			{/* Error Message */}
			{isError && (
				<div className="toast toast-top toast-end">
					<div className="alert alert-error">
						<span>
							{error instanceof AxiosError
								? error.response?.data?.message || 'An error occurred'
								: 'An error occurred'}
						</span>
					</div>
				</div>
			)}

			{users?.map((request: any) => {
				const { profileUrl, firstName, bio, lastName } = request?.fromUserId
				return (
					<div className="card card-compact bg-base-300 w-full max-w-xl shadow-xl cursor-pointer">
						<figure className="h-56">
							<img src={profileUrl} alt="user" />
						</figure>
						<div className="card-body">
							<h2 className="card-title">{firstName + ' ' + lastName}</h2>
							<p>{bio}</p>
						</div>
						<div className="card-actions space-x-4 flex items-center justify-center cursor-pointer">
							<button
								className="btn  btn-primary"
								onClick={() => {
									handleClick('rejected', request._id)
								}}>
								Reject
							</button>
							<button
								className="btn btn-secondary "
								onClick={() => {
									handleClick('accepted', request._id)
								}}>
								Accept
							</button>
						</div>
					</div>
				)
			})}
		</div>
	)
}
