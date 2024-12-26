import { AxiosError } from 'axios'
import Spinner from '../components/Spinner'
import { getConnections } from '../utils/api'
import { useQuery } from '@tanstack/react-query'

export default function ConnectionScreen() {
	const { data, error, isLoading, isSuccess, isError } = useQuery({
		queryKey: ['userConnection'],
		queryFn: getConnections,
	})

	const users = data?.data || []

	if (isLoading) {
		return <Spinner />
	}

	return (
		<div className="flex flex-col items-center space-y-6">
			<h1 className="text-4xl font-bold mb-11">Connectors</h1>
			{isSuccess && !users.length && (
				<div className="card bg-base-300 w-96 shadow-xl">
					<div className="card-body">
						<p className="text-center">No connections found</p>
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

			{users?.map((user: any) => {
				return (
					<div className="card card-compact bg-base-300 w-full max-w-3xl shadow-xl cursor-pointer">
						<figure>
							<img src={user?.profileUrl} alt="user" />
						</figure>
						<div className="card-body">
							<h2 className="card-title">
								{user?.firstName + '' + user?.lastName}
							</h2>
							<p>{user?.bio}</p>
						</div>
					</div>
				)
			})}
		</div>
	)
}
