import { Navigate, Route, Routes, useLocation } from 'react-router'

import HomeScreen from './screens/HomeScreen'
import NotFoundScreen from './screens/NotFoundScreen'
import SignUpScreen from './screens/SignUpScreen'
import SignInScreen from './screens/SignInScreen'
import PrivateRoute from './components/PrivateRoute'
import ProfileScreen from './screens/ProfileScreen'
import ConnectionScreen from './screens/ConnectionScreen'
import RequestScreen from './screens/RequestScreen'

export default function RouteLayout() {
	const location = useLocation()

	return (
		<Routes key={location.pathname} location={location}>
			<Route path="/" element={<Navigate to="/feed" />} />

			<Route path="/feed" element={<PrivateRoute />}>
				<Route path="/feed" element={<HomeScreen />} />
			</Route>

			<Route path="/profile" element={<PrivateRoute />}>
				<Route path="/profile" element={<ProfileScreen />} />
			</Route>
			<Route path="/connections" element={<PrivateRoute />}>
				<Route path="/connections" element={<ConnectionScreen />} />
			</Route>

			<Route path="/requests" element={<PrivateRoute />}>
				<Route path="/requests" element={<RequestScreen />} />
			</Route>

			<Route path="/sign-up" element={<SignUpScreen />} />
			<Route path="/sign-in" element={<SignInScreen />} />
			<Route path="*" element={<NotFoundScreen />} />
		</Routes>
	)
}
