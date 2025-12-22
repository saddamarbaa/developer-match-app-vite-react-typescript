import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code2, Mail, Lock, User, Loader2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

type AuthMode = 'login' | 'signup'

const loginSchema = z.object({
	email: z
		.string()
		.trim()
		.email('Enter a valid email')
		.max(128, "Email can't be greater than 128 characters"),
	password: z
		.string()
		.min(6, 'Password must be at least 6 characters')
		.max(100, 'Password is too long'),
})

const signupSchema = loginSchema
	.extend({
		firstName: z
			.string()
			.trim()
			.min(3, 'First name must be at least 3 characters')
			.max(15, "First name can't be greater than 15 characters"),
		lastName: z
			.string()
			.trim()
			.max(15, "Surname can't be greater than 15 characters")
			.optional()
			.refine((val) => !val || val.length >= 3, {
				message: "Surname can't be smaller than 3 characters",
			}),
		confirmPassword: z
			.string()
			.min(6, 'Password must be at least 6 characters')
			.max(100, 'Password is too long'),
		gender: z.enum(['male', 'female', 'other']).optional().or(z.literal('')),
		bio: z
			.string()
			.trim()
			.max(500, "Bio can't be longer than 500 characters")
			.optional()
			.or(z.literal('')),
		skills: z
			.string()
			.trim()
			.max(200, 'Skills entry is too long')
			.optional()
			.or(z.literal('')),
		acceptTerms: z
			.boolean()
			.refine((val) => val, { message: 'Please accept the terms' }),
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Passwords must match',
				path: ['confirmPassword'],
			})
		}
	})

type FormValues = z.infer<typeof signupSchema>

const Auth = () => {
	const [mode, setMode] = useState<AuthMode>('login')
	const { login, signup, isLoading } = useAuth()
	const navigate = useNavigate()

	const schema = useMemo(
		() => (mode === 'login' ? loginSchema : signupSchema),
		[mode],
	)

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset,
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: '',
			password: '',
			firstName: '',
			lastName: '',
			confirmPassword: '',
			gender: '',
			bio: '',
			skills: '',
			acceptTerms: false,
		},
	})

	const switchMode = (newMode: AuthMode) => {
		setMode(newMode)
		reset({
			email: '',
			password: '',
			firstName: '',
			lastName: '',
			confirmPassword: '',
			gender: '',
			bio: '',
			skills: '',
			acceptTerms: false,
		})
	}

	const onSubmit = async (values: FormValues) => {
		if (mode === 'login') {
			const result = await login(values.email, values.password)

			if (result.error) {
				toast({
					title: 'Error',
					description: result.error,
					variant: 'destructive',
				})
				return
			}

			toast({
				title: 'Welcome back!',
				description: 'Redirecting to your feed...',
			})
			navigate('/')
			return
		}

		const skillsArray =
			values.skills
				?.split(',')
				.map((s) => s.trim())
				.filter(Boolean) || []

		const result = await signup({
			email: values.email,
			password: values.password,
			confirmPassword: values.confirmPassword,
			firstName: values.firstName.trim(),
			lastName: values.lastName?.trim() || undefined,
			gender: values.gender || undefined,
			bio: values.bio?.trim() || undefined,
			skills: skillsArray.length ? skillsArray : undefined,
			acceptTerms: values.acceptTerms,
		})

		if (result.error) {
			toast({
				title: 'Error',
				description: result.error,
				variant: 'destructive',
			})
		} else {
			toast({
				title: 'Account created!',
				description: 'Redirecting to your feed...',
			})
			navigate('/')
		}
	}

	return (
		<div className="flex flex-col justify-center items-center bg-background p-4 min-h-screen">
			{/* Background gradient */}
			<div
				className="fixed inset-0 opacity-30 pointer-events-none"
				style={{ background: 'var(--gradient-radial)' }}
			/>

			<motion.div
				className="z-10 relative space-y-8 w-full max-w-sm"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}>
				{/* Logo */}
				<div className="text-center">
					<div className="flex justify-center items-center gap-2 mb-4">
						<Code2 className="w-10 h-10 text-primary neon-text" />
						<span className="font-bold text-3xl">
							<span className="gradient-text">Dev</span>
							<span className="text-foreground">Match</span>
						</span>
					</div>
					<p className="text-muted-foreground text-sm">
						{mode === 'login'
							? 'Welcome back, developer!'
							: 'Join the developer community'}
					</p>
				</div>

				{/* Form */}
				<motion.form
					className="space-y-5 p-6 glass-card"
					onSubmit={handleSubmit(onSubmit)}
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.1 }}>
					{mode === 'signup' && (
						<>
							<div className="space-y-2">
								<Label
									htmlFor="firstName"
									className="text-muted-foreground text-sm">
									First name
								</Label>
								<div className="relative">
									<User className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
									<Input
										id="firstName"
										type="text"
										placeholder="Alex"
										{...register('firstName')}
										className={cn(
											'bg-secondary pl-10',
											errors.firstName &&
												'border-destructive bg-destructive/10 focus-visible:ring-0 focus-visible:ring-destructive focus-visible:ring-offset-0',
										)}
										aria-invalid={Boolean(errors.firstName)}
									/>
								</div>
								{errors.firstName?.message && (
									<p className="text-destructive text-xs">
										{errors.firstName.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="lastName"
									className="text-muted-foreground text-sm">
									Last name (optional)
								</Label>
								<Input
									id="lastName"
									type="text"
									placeholder="Chen"
									{...register('lastName')}
									className={cn(
										'bg-secondary',
										errors.lastName &&
											'border-destructive bg-destructive/10 focus-visible:ring-0 focus-visible:ring-destructive focus-visible:ring-offset-0',
									)}
									aria-invalid={Boolean(errors.lastName)}
								/>
								{errors.lastName?.message && (
									<p className="text-destructive text-xs">
										{errors.lastName.message}
									</p>
								)}
							</div>
						</>
					)}

					<div className="space-y-2">
						<Label htmlFor="email" className="text-muted-foreground text-sm">
							Email
						</Label>
						<div className="relative">
							<Mail className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								{...register('email')}
								className={cn(
									'bg-secondary pl-10',
									errors.email &&
										'border-destructive bg-destructive/10 focus-visible:ring-1 focus-visible:ring-destructive focus-visible:ring-offset-0',
								)}
								aria-invalid={Boolean(errors.email)}
							/>
						</div>
						{errors.email?.message && (
							<p className="text-destructive text-xs">{errors.email.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="password" className="text-muted-foreground text-sm">
							Password
						</Label>
						<div className="relative">
							<Lock className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								{...register('password')}
								className={cn(
									'bg-secondary pl-10',
									errors.password &&
										'border-destructive bg-destructive/10 focus-visible:ring-1 focus-visible:ring-destructive focus-visible:ring-offset-0',
								)}
								aria-invalid={Boolean(errors.password)}
							/>
						</div>
						{errors.password?.message && (
							<p className="text-destructive text-xs">
								{errors.password.message}
							</p>
						)}
					</div>

					{mode === 'signup' && (
						<div className="space-y-2">
							<Label
								htmlFor="confirmPassword"
								className="text-muted-foreground text-sm">
								Confirm Password
							</Label>
							<div className="relative">
								<Lock className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
								<Input
									id="confirmPassword"
									type="password"
									placeholder="••••••••"
									{...register('confirmPassword')}
									className={cn(
										'bg-secondary pl-10',
										errors.confirmPassword &&
											'border-destructive bg-destructive/10 focus-visible:ring-1 focus-visible:ring-destructive focus-visible:ring-offset-0',
									)}
									aria-invalid={Boolean(errors.confirmPassword)}
								/>
							</div>
							{errors.confirmPassword?.message && (
								<p className="text-destructive text-xs">
									{errors.confirmPassword.message}
								</p>
							)}
						</div>
					)}

					{mode === 'signup' && (
						<>
							<div className="space-y-2">
								<Label
									htmlFor="gender"
									className="text-muted-foreground text-sm">
									Gender (optional)
								</Label>
								<select
									id="gender"
									{...register('gender')}
									className={cn(
										'bg-secondary px-3 py-2 border border-input rounded-md w-full text-sm',
										errors.gender &&
											'border-destructive bg-destructive/10 focus-visible:ring-1 focus-visible:ring-destructive focus-visible:ring-offset-0',
									)}
									aria-invalid={Boolean(errors.gender)}>
									<option value="">Select gender</option>
									<option value="male">Male</option>
									<option value="female">Female</option>
									<option value="other">Other</option>
								</select>
								{errors.gender?.message && (
									<p className="text-destructive text-xs">
										{errors.gender.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="bio" className="text-muted-foreground text-sm">
									Bio (optional)
								</Label>
								<Textarea
									id="bio"
									placeholder="Tell others about your background and interests"
									{...register('bio')}
									className={cn(
										'bg-secondary',
										errors.bio &&
											'border-destructive bg-destructive/10 focus-visible:ring-1 focus-visible:ring-destructive focus-visible:ring-offset-0',
									)}
									aria-invalid={Boolean(errors.bio)}
									rows={3}
								/>
								{errors.bio?.message && (
									<p className="text-destructive text-xs">
										{errors.bio.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="skills"
									className="text-muted-foreground text-sm">
									Skills (comma separated, optional)
								</Label>
								<Input
									id="skills"
									type="text"
									placeholder="e.g. React, TypeScript, Node.js"
									{...register('skills')}
									className={cn(
										'bg-secondary',
										errors.skills &&
											'border-destructive bg-destructive/10 focus-visible:ring-1 focus-visible:ring-destructive focus-visible:ring-offset-0',
									)}
									aria-invalid={Boolean(errors.skills)}
								/>
								{errors.skills?.message && (
									<p className="text-destructive text-xs">
										{errors.skills.message}
									</p>
								)}
							</div>

							<Controller
								name="acceptTerms"
								control={control}
								render={({ field }) => (
									<div className="flex items-center gap-2">
										<Checkbox
											id="acceptTerms"
											checked={!!field.value}
											onCheckedChange={(checked) =>
												field.onChange(Boolean(checked))
											}
											className={cn(
												errors.acceptTerms &&
													'border-destructive focus-visible:ring-1 focus-visible:ring-destructive focus-visible:ring-offset-0',
											)}
										/>
										<Label
											htmlFor="acceptTerms"
											className="text-muted-foreground text-sm">
											I accept the terms and conditions
										</Label>
									</div>
								)}
							/>
							{errors.acceptTerms?.message && (
								<p className="text-destructive text-xs">
									{errors.acceptTerms.message}
								</p>
							)}
						</>
					)}

					<Button
						type="submit"
						variant="neon"
						className="w-full"
						disabled={isLoading}>
						{isLoading ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : mode === 'login' ? (
							'Sign In'
						) : (
							'Create Account'
						)}
					</Button>
				</motion.form>

				{/* Toggle mode */}
				<p className="text-muted-foreground text-sm text-center">
					{mode === 'login' ? (
						<>
							Don't have an account?{' '}
							<button
								type="button"
								onClick={() => switchMode('signup')}
								className="font-medium text-primary hover:underline">
								Sign up
							</button>
						</>
					) : (
						<>
							Already have an account?{' '}
							<button
								type="button"
								onClick={() => switchMode('login')}
								className="font-medium text-primary hover:underline">
								Sign in
							</button>
						</>
					)}
				</p>

				{/* Demo hint */}
				<p className="text-muted-foreground/60 text-xs text-center">
					Mock auth - use any email & 6+ char password
				</p>
			</motion.div>
		</div>
	)
}

export default Auth
