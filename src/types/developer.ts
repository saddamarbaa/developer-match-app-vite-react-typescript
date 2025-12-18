export interface Developer {
	id: string
	name: string
	age: number
	avatar: string
	title: string
	bio: string
	location: string
	experience: number
	skills: string[]
	username?: string
	lookingFor: 'collaborator' | 'mentor' | 'mentee' | 'cofounder' | 'friend'
	github?: string
	availability: 'full-time' | 'part-time' | 'weekends' | 'flexible'
}

export type SwipeDirection = 'left' | 'right' | 'up'
