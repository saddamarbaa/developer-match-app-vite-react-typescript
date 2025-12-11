import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	ArrowLeft,
	Save,
	User,
	Mail,
	FileText,
	Code,
	Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { authApi } from '@/lib/api'

export default function Profile() {
	const navigate = useNavigate()
	const { user, refreshProfile } = useAuth()
	const { toast } = useToast()

	const [isEditing, setIsEditing] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState({
		firstName: user?.firstName || '',
		lastName: user?.lastName || '',
		email: user?.email || '',
		gender: user?.gender || '',
		bio: user?.bio || '',
		skills: user?.skills?.join(', ') || '',
		profileUrl: user?.avatar || '',
	})

	const initials =
		user?.name
			?.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase() || 'U'

	const handleSave = async () => {
		setIsLoading(true)

		const skillsArray = formData.skills
			.split(',')
			.map((s) => s.trim())
			.filter((s) => s.length > 0)

		const response = await authApi.updateProfile(user?.id || '', {
			firstName: formData.firstName,
			lastName: formData.lastName,
			email: formData.email,
			gender: formData.gender,
			bio: formData.bio,
			skills: skillsArray,
			profileUrl: formData.profileUrl,
		})

		if (response.success) {
			toast({
				title: 'Profile updated',
				description: 'Your profile has been updated successfully.',
			})
			await refreshProfile()
			setIsEditing(false)
		} else {
			toast({
				title: 'Update failed',
				description: response.message || 'Failed to update profile.',
				variant: 'destructive',
			})
		}

		setIsLoading(false)
	}

	return (
		<div className="min-h-screen bg-background">
			<header className="flex items-center gap-4 p-4 border-b border-border/50">
				<Button variant="ghost" size="icon" onClick={() => navigate('/')}>
					<ArrowLeft className="w-5 h-5" />
				</Button>
				<h1 className="text-xl font-bold gradient-text">Profile</h1>
			</header>

			<main className="max-w-2xl mx-auto p-4 space-y-6">
				{/* Avatar Section */}
				<div className="flex flex-col items-center gap-4">
					<Avatar className="h-24 w-24 border-2 border-primary">
						<AvatarImage src={user?.avatar} alt={user?.name} />
						<AvatarFallback className="bg-secondary text-2xl">
							{initials}
						</AvatarFallback>
					</Avatar>
					<div className="text-center">
						<h2 className="text-2xl font-bold">{user?.name}</h2>
						<p className="text-muted-foreground">{user?.email}</p>
					</div>
				</div>

				{/* Profile Card */}
				<Card className="glass-card">
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle className="flex items-center gap-2">
							<User className="w-5 h-5 text-primary" />
							Profile Details
						</CardTitle>
						{!isEditing ? (
							<Button variant="outline" onClick={() => setIsEditing(true)}>
								Edit Profile
							</Button>
						) : (
							<div className="flex gap-2">
								<Button variant="ghost" onClick={() => setIsEditing(false)}>
									Cancel
								</Button>
								<Button onClick={handleSave} disabled={isLoading}>
									<Save className="w-4 h-4 mr-2" />
									{isLoading ? 'Saving...' : 'Save'}
								</Button>
							</div>
						)}
					</CardHeader>
					<CardContent className="space-y-6">
						{isEditing ? (
							<>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="firstName">First Name</Label>
										<Input
											id="firstName"
											value={formData.firstName}
											onChange={(e) =>
												setFormData({ ...formData, firstName: e.target.value })
											}
											placeholder="Enter first name"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="lastName">Last Name</Label>
										<Input
											id="lastName"
											value={formData.lastName}
											onChange={(e) =>
												setFormData({ ...formData, lastName: e.target.value })
											}
											placeholder="Enter last name"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										value={formData.email}
										onChange={(e) =>
											setFormData({ ...formData, email: e.target.value })
										}
										placeholder="Enter email"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="gender">Gender</Label>
									<Select
										value={formData.gender}
										onValueChange={(value) =>
											setFormData({ ...formData, gender: value })
										}>
										<SelectTrigger>
											<SelectValue placeholder="Select gender" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="male">Male</SelectItem>
											<SelectItem value="female">Female</SelectItem>
											<SelectItem value="other">Other</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="profileUrl">Profile Picture URL</Label>
									<Input
										id="profileUrl"
										value={formData.profileUrl}
										onChange={(e) =>
											setFormData({ ...formData, profileUrl: e.target.value })
										}
										placeholder="https://example.com/avatar.jpg"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="bio">Bio</Label>
									<Textarea
										id="bio"
										value={formData.bio}
										onChange={(e) =>
											setFormData({ ...formData, bio: e.target.value })
										}
										placeholder="Tell us about yourself..."
										rows={4}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="skills">Skills (comma separated)</Label>
									<Input
										id="skills"
										value={formData.skills}
										onChange={(e) =>
											setFormData({ ...formData, skills: e.target.value })
										}
										placeholder="React, Node.js, TypeScript"
									/>
								</div>
							</>
						) : (
							<>
								<div className="space-y-4">
									<div className="flex items-start gap-3">
										<Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
										<div>
											<p className="text-sm text-muted-foreground">Email</p>
											<p className="font-medium">{user?.email}</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<Users className="w-5 h-5 text-muted-foreground mt-0.5" />
										<div>
											<p className="text-sm text-muted-foreground">Gender</p>
											<p className="font-medium capitalize">
												{user?.gender || 'Not specified'}
											</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
										<div>
											<p className="text-sm text-muted-foreground">Bio</p>
											<p className="font-medium">
												{user?.bio || 'No bio added yet'}
											</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<Code className="w-5 h-5 text-muted-foreground mt-0.5" />
										<div>
											<p className="text-sm text-muted-foreground">Skills</p>
											<div className="flex flex-wrap gap-2 mt-1">
												{user?.skills && user.skills.length > 0 ? (
													user.skills.map((skill) => (
														<Badge key={skill} variant="secondary">
															{skill}
														</Badge>
													))
												) : (
													<p className="text-muted-foreground">
														No skills added yet
													</p>
												)}
											</div>
										</div>
									</div>
								</div>
							</>
						)}
					</CardContent>
				</Card>
			</main>
		</div>
	)
}
