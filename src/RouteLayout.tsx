import { Navigate, Route, Routes, useLocation } from 'react-router'

import HomeScreen from './screens/HomeScreen'
import NotFoundScreen from './screens/NotFoundScreen'
import SignUpScreen from './screens/SignUpScreen'
import SignInScreen from './screens/SignInScreen'
import PrivateRoute from './components/PrivateRoute'
import ProfileScreen from './screens/ProfileScreen'

export default function RouteLayout() {
	const location = useLocation()

	return (
		<Routes key={location.pathname} location={location}>
			<Route path="/dev" element={<Navigate to="/" />} />
			<Route path="/" element={<HomeScreen />} />

			<Route path="/profile" element={<PrivateRoute />}>
				<Route path="/profile" element={<ProfileScreen />} />
			</Route>
			<Route path="/sign-up" element={<SignUpScreen />} />
			<Route path="/sign-in" element={<SignInScreen />} />
			<Route path="*" element={<NotFoundScreen />} />
		</Routes>
	)
}
