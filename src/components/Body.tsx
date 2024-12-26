import { useQuery } from '@tanstack/react-query'
import { getFeet } from '../utils/api'
import Spinner from './Spinner'
import UserCard from './UserCard'

export default function Body() {
	const { data, error, isLoading, isSuccess, isError } = useQuery({
		queryKey: ['userFeed'],
		queryFn: getFeet,
	})

	const feeds = data?.data
	const users = feeds?.users || []

	if (isLoading) {
		return <Spinner />
	}

	return (
		<div className="flex flex-col items-center space-y-6">
			{users?.map((user: any) => {
				return <UserCard user={user} key={user?._id} />
			})}
		</div>
	)
}
