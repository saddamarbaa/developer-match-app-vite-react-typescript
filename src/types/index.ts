export interface IUser {
	firstName: string
	lastName: string
	email: string
	bio?: string
	skills: string[]
	profileUrl: string
	acceptTerms: boolean
	isAdmin: boolean
	role: string
	_id: string
}
