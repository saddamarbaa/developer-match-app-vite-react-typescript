import { Outlet } from 'react-router'

export default function PrivateRoute() {
	return (
		<section>
			<Outlet />
		</section>
	)
}
