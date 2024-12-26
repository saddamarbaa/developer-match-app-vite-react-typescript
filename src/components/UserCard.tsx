import { useMutation } from '@tanstack/react-query'
import { IUser } from '../types'
import { AxiosError } from 'axios'
import { fetchConnections } from '../utils/api'

type Props = {
	user: IUser
}
export default function UserCard({ user }: Props) {
	const { mutate, isError, isSuccess, error, isPending } = useMutation<
		unknown,
		AxiosError,
		{ status: string; requestId: string },
		unknown
	>({
		mutationFn: fetchConnections,
		onSuccess: () => {},
		onError: (err: AxiosError) => {
			console.error('Login failed:', err)
		},
	})

	const handleClick = async (status: 'ignore' | 'interested') => {
		mutate({ status, requestId: user._id })
	}

	return (
		<div className="card card-compact bg-base-300 w-96 shadow-xl">
			<figure>
				<img src={user?.profileUrl} alt="user" />
			</figure>
			<div className="card-body">
				<h2 className="card-title">{user?.firstName + '' + user?.lastName}</h2>
				{/* <p>{user?.age}</p>
				<p>{user?.gender}</p> */}
				<p>{user?.bio}</p>
				<div className="card-actions space-x-4 flex items-center justify-center cursor-pointer">
					<button className="btn  btn-primary">Ignore</button>
					<button
						className="btn btn-secondary"
						onClick={() => {
							handleClick('interested')
						}}>
						Interested
					</button>
				</div>
			</div>
		</div>
	)
}
