import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '../../types'

// const [user, setUser] = useState();
const initialState = {
	user: null,
}

const userSlice = createSlice({
	name: 'user',
	initialState,

	reducers: {
		setLogInState: (
			state: { user: IUser | null },
			action: PayloadAction<IUser>,
		) => {
			// setUser(action.payload);
			state.user = action.payload
		},

		setLogOutState: (state: { user: IUser | null }) => {
			// setUser(null);
			state.user = null
		},
	},
})

export const { setLogInState, setLogOutState } = userSlice.actions

export const selectUser = (state: { user: { user: IUser | null } }) =>
	state.user.user

export default userSlice.reducer
