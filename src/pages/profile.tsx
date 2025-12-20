import { useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	ArrowLeft,
	Save,
	User,
	Mail,
	FileText,
	Code,
	Users,
	Camera,
	AlertCircle,
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

interface ValidationErrors {
	firstName?: string
	lastName?: string
	email?: string
	bio?: string
}

const validateEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}

export default function Profile() {
	const navigate = useNavigate()
	const { user, refreshProfile } = useAuth()
	const { toast } = useToast()

	const [isEditing, setIsEditing] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [isUploading, setIsUploading] = useState(false)
	const [errors, setErrors] = useState<ValidationErrors>({})
	const [touched, setTouched] = useState<Record<string, boolean>>({})
	const fileInputRef = useRef<HTMLInputElement>(null)
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

	const validateForm = useMemo(() => {
		const newErrors: ValidationErrors = {}

		if (!formData.firstName.trim()) {
			newErrors.firstName = 'First name is required'
		} else if (formData.firstName.trim().length < 2) {
			newErrors.firstName = 'First name must be at least 2 characters'
		} else if (formData.firstName.trim().length > 50) {
			newErrors.firstName = 'First name must be less than 50 characters'
		}

		if (!formData.lastName.trim()) {
			newErrors.lastName = 'Last name is required'
		} else if (formData.lastName.trim().length < 2) {
			newErrors.lastName = 'Last name must be at least 2 characters'
		} else if (formData.lastName.trim().length > 50) {
			newErrors.lastName = 'Last name must be less than 50 characters'
		}

		if (!formData.email.trim()) {
			newErrors.email = 'Email is required'
		} else if (!validateEmail(formData.email.trim())) {
			newErrors.email = 'Please enter a valid email address'
		}

		if (formData.bio.length > 500) {
			newErrors.bio = 'Bio must be less than 500 characters'
		}

		return newErrors
	}, [formData.firstName, formData.lastName, formData.email, formData.bio])

	const isFormValid = Object.keys(validateForm).length === 0

	const handleBlur = (field: string) => {
		setTouched((prev) => ({ ...prev, [field]: true }))
		setErrors(validateForm)
	}

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		// Validate file type
		if (!file.type.startsWith('image/')) {
			toast({
				title: 'Invalid file type',
				description: 'Please select an image file.',
				variant: 'destructive',
			})
			return
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast({
				title: 'File too large',
				description: 'Please select an image under 5MB.',
				variant: 'destructive',
			})
			return
		}

		setIsUploading(true)

		// Convert to base64
		const reader = new FileReader()
		reader.onloadend = async () => {
			const base64String = reader.result as string

			// Update profile with new image
			const response = await authApi.updateProfile(user?.id || '', {
				profileUrl: base64String,
			})

			if (response.success) {
				toast({
					title: 'Avatar updated',
					description: 'Your profile picture has been updated.',
				})
				await refreshProfile()
				setFormData((prev) => ({ ...prev, profileUrl: base64String }))
			} else {
				toast({
					title: 'Upload failed',
					description: response.message || 'Failed to update avatar.',
					variant: 'destructive',
				})
			}
			setIsUploading(false)
		}
		reader.onerror = () => {
			toast({
				title: 'Upload failed',
				description: 'Failed to read the image file.',
				variant: 'destructive',
			})
			setIsUploading(false)
		}
		reader.readAsDataURL(file)
	}

	const handleSave = async () => {
		// Mark all fields as touched
		setTouched({ firstName: true, lastName: true, email: true, bio: true })
		const validationErrors = validateForm
		setErrors(validationErrors)

		if (Object.keys(validationErrors).length > 0) {
			toast({
				title: 'Validation Error',
				description: 'Please fix the errors before saving.',
				variant: 'destructive',
			})
			return
		}

		setIsLoading(true)

		const skillsArray = formData.skills
			.split(',')
			.map((s) => s.trim())
			.filter((s) => s.length > 0)

		const response = await authApi.updateProfile(user?.id || '', {
			firstName: formData.firstName.trim(),
			lastName: formData.lastName.trim(),
			email: formData.email.trim(),
			gender: formData.gender,
			bio: formData.bio.trim(),
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
			setTouched({})
			setErrors({})
		} else {
			toast({
				title: 'Update failed',
				description: response.message || 'Failed to update profile.',
				variant: 'destructive',
			})
		}

		setIsLoading(false)
	}

	const handleCancel = () => {
		setIsEditing(false)
		setTouched({})
		setErrors({})
		setFormData({
			firstName: user?.firstName || '',
			lastName: user?.lastName || '',
			email: user?.email || '',
			gender: user?.gender || '',
			bio: user?.bio || '',
			skills: user?.skills?.join(', ') || '',
			profileUrl: user?.avatar || '',
		})
	}

	const ErrorMessage = ({ message }: { message?: string }) => {
		if (!message) return null
		return (
			<p className="flex items-center gap-1 mt-1 text-destructive text-sm">
				<AlertCircle className="w-3 h-3" />
				{message}
			</p>
		)
	}

	return (
		<div className="bg-background min-h-screen">
			<header className="flex items-center gap-4 p-4 border-border/50 border-b">
				<Button variant="ghost" size="icon" onClick={() => navigate('/')}>
					<ArrowLeft className="w-5 h-5" />
				</Button>
				<h1 className="font-bold text-xl gradient-text">Profile</h1>
			</header>

			<main className="space-y-6 mx-auto p-4 max-w-2xl">
				{/* Avatar Section */}
				<div className="flex flex-col items-center gap-4">
					<div className="group relative">
						<Avatar className="border-2 border-primary w-24 h-24">
							<AvatarImage src={user?.avatar} alt={user?.name} />
							<AvatarFallback className="bg-secondary text-2xl">
								{initials}
							</AvatarFallback>
						</Avatar>
						<button
							onClick={() => fileInputRef.current?.click()}
							disabled={isUploading}
							className="absolute inset-0 flex justify-center items-center bg-background/80 opacity-0 group-hover:opacity-100 rounded-full transition-opacity cursor-pointer disabled:cursor-not-allowed">
							{isUploading ? (
								<div className="border-2 border-primary border-t-transparent rounded-full w-6 h-6 animate-spin" />
							) : (
								<Camera className="w-6 h-6 text-primary" />
							)}
						</button>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleImageUpload}
							className="hidden"
						/>
					</div>
					<div className="text-center">
						<h2 className="font-bold text-2xl">{user?.name}</h2>
						<p className="text-muted-foreground">{user?.email}</p>
						<p className="mt-1 text-muted-foreground text-xs">
							Click avatar to upload new photo
						</p>
					</div>
				</div>

				{/* Profile Card */}
				<Card className="glass-card">
					<CardHeader className="flex flex-row justify-between items-center">
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
								<Button variant="ghost" onClick={handleCancel}>
									Cancel
								</Button>
								<Button
									onClick={handleSave}
									disabled={isLoading || !isFormValid}>
									<Save className="mr-2 w-4 h-4" />
									{isLoading ? 'Saving...' : 'Save'}
								</Button>
							</div>
						)}
					</CardHeader>
					<CardContent className="space-y-6">
						{isEditing ? (
							<>
								<div className="gap-4 grid grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="firstName">
											First Name <span className="text-destructive">*</span>
										</Label>
										<Input
											id="firstName"
											value={formData.firstName}
											onChange={(e) =>
												setFormData({ ...formData, firstName: e.target.value })
											}
											onBlur={() => handleBlur('firstName')}
											placeholder="Enter first name"
											className={
												touched.firstName && errors.firstName
													? 'border-destructive'
													: ''
											}
										/>
										{touched.firstName && (
											<ErrorMessage message={errors.firstName} />
										)}
									</div>
									<div className="space-y-2">
										<Label htmlFor="lastName">
											Last Name <span className="text-destructive">*</span>
										</Label>
										<Input
											id="lastName"
											value={formData.lastName}
											onChange={(e) =>
												setFormData({ ...formData, lastName: e.target.value })
											}
											onBlur={() => handleBlur('lastName')}
											placeholder="Enter last name"
											className={
												touched.lastName && errors.lastName
													? 'border-destructive'
													: ''
											}
										/>
										{touched.lastName && (
											<ErrorMessage message={errors.lastName} />
										)}
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="email">
										Email <span className="text-destructive">*</span>
									</Label>
									<Input
										id="email"
										type="email"
										value={formData.email}
										onChange={(e) =>
											setFormData({ ...formData, email: e.target.value })
										}
										onBlur={() => handleBlur('email')}
										placeholder="Enter email"
										className={
											touched.email && errors.email ? 'border-destructive' : ''
										}
									/>
									{touched.email && <ErrorMessage message={errors.email} />}
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
									<div className="flex justify-between">
										<Label htmlFor="bio">Bio</Label>
										<span
											className={`text-xs ${
												formData.bio.length > 500
													? 'text-destructive'
													: 'text-muted-foreground'
											}`}>
											{formData.bio.length}/500
										</span>
									</div>
									<Textarea
										id="bio"
										value={formData.bio}
										onChange={(e) =>
											setFormData({ ...formData, bio: e.target.value })
										}
										onBlur={() => handleBlur('bio')}
										placeholder="Tell us about yourself..."
										rows={4}
										className={
											touched.bio && errors.bio ? 'border-destructive' : ''
										}
									/>
									{touched.bio && <ErrorMessage message={errors.bio} />}
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
									{user?.firstName && (
										<div className="flex items-start gap-3">
											<User className="mt-0.5 w-5 h-5 text-muted-foreground" />
											<div>
												<p className="text-muted-foreground text-sm">
													First Name
												</p>
												<p className="font-medium">{user.firstName}</p>
											</div>
										</div>
									)}

									{user?.lastName && (
										<div className="flex items-start gap-3">
											<User className="mt-0.5 w-5 h-5 text-muted-foreground" />
											<div>
												<p className="text-muted-foreground text-sm">
													Last Name
												</p>
												<p className="font-medium">{user.lastName}</p>
											</div>
										</div>
									)}

									<div className="flex items-start gap-3">
										<Mail className="mt-0.5 w-5 h-5 text-muted-foreground" />
										<div>
											<p className="text-muted-foreground text-sm">Email</p>
											<p className="font-medium">{user?.email}</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<Users className="mt-0.5 w-5 h-5 text-muted-foreground" />
										<div>
											<p className="text-muted-foreground text-sm">Gender</p>
											<p className="font-medium capitalize">
												{user?.gender || 'Not specified'}
											</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<FileText className="mt-0.5 w-5 h-5 text-muted-foreground" />
										<div>
											<p className="text-muted-foreground text-sm">Bio</p>
											<p className="font-medium">
												{user?.bio || 'No bio added yet'}
											</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<Code className="mt-0.5 w-5 h-5 text-muted-foreground" />
										<div>
											<p className="text-muted-foreground text-sm">Skills</p>
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
