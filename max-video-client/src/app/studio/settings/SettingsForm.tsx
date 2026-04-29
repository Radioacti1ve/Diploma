'use client'

import { Controller } from 'react-hook-form'
import { X } from 'lucide-react'

import { Button } from '@/ui/button/Button'
import { Field } from '@/ui/field/Field'
import { Textarea } from '@/ui/field/Textarea'
import { UploadField } from '@/ui/upload-field/UploadField'

import { useSettings } from './useSettings'

export function SettingsForm() {
	const {
		formObject: {
			handleSubmit,
			register,
			formState: { errors },
			control
		},
		isLoading,
		isProfileLoading,
		onSubmit,
		profile,
		isVerifyModalOpen,
		setIsVerifyModalOpen,
		verificationCode,
		setVerificationCode,
		sendVerificationCode,
		verifyEmailCode,
		isSendingVerificationCode,
		isVerifyingEmailCode
	} = useSettings()

	if (isProfileLoading) return <div>Loading...</div>

	return (
		<div className='w-3/5'>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='grid grid-cols-2 gap-10'>
					<div>
						<Field
							label='Email'
							type='email'
							registration={register('email', { required: 'Email is required!' })}
							error={errors.email?.message}
							placeholder='Enter email:'
						/>
						{profile?.verificationToken && (
							<div className='mb-5 rounded border border-primary/50 bg-primary/10 p-4'>
								<div className='mb-1 font-semibold text-primary'>Email is not verified</div>
								<p className='mb-4 text-sm text-gray-400'>
									Send a 6-digit code to {profile.email} and confirm this email.
								</p>
								<Button
									type='button'
									variant='secondary'
									isLoading={isSendingVerificationCode}
									onClick={() => sendVerificationCode()}
								>
									Send code
								</Button>
							</div>
						)}
						<Field
							label='Password'
							type='password'
							registration={register('password')}
							error={errors.password?.message}
							placeholder='Enter password:'
						/>
						<Field
							label='Name'
							type='text'
							registration={register('name')}
							error={errors.name?.message}
							placeholder='Enter name:'
						/>
						<Field
							label='Slug (alias)'
							type='text'
							registration={register('channel.slug')}
							error={errors.channel?.slug?.message}
							placeholder='Enter slug:'
						/>
						<Textarea
							label='Description'
							registration={register('channel.description')}
							error={errors.channel?.description?.message}
							placeholder='Enter description:'
							rows={4}
						/>
					</div>

					<div>
						<Controller
							control={control}
							name='channel.avatarUrl'
							render={({ field: { onChange, value }, fieldState: { error } }) => (
								<UploadField
									label='Avatar:'
									onChange={onChange}
									value={value}
									error={error}
									folder='avatars'
									className='mb-5'
								/>
							)}
						/>

						<Controller
							control={control}
							name='channel.bannerUrl'
							render={({ field: { onChange, value }, fieldState: { error } }) => (
								<UploadField
									label='Banner:'
									onChange={onChange}
									value={value}
									error={error}
									folder='banners'
									sizePreview={[446, 250]}
									overlay='/overlay.png'
								/>
							)}
						/>
					</div>
				</div>
				<div className='text-center mt-10'>
					<Button
						type='submit'
						isLoading={isLoading}
					>
						Update
					</Button>
				</div>
			</form>

			{isVerifyModalOpen && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
					<div className='relative w-full max-w-md rounded-lg bg-gray-800 p-6'>
						<button
							type='button'
							className='absolute right-3 top-3 text-white'
							title='Close a modal'
							onClick={() => setIsVerifyModalOpen(false)}
						>
							<X />
						</button>

						<div className='mb-2 text-xl font-semibold'>Confirm email</div>
						<p className='mb-5 text-sm text-gray-400'>
							Enter the 6-digit code sent to {profile?.email}.
						</p>

						<input
							value={verificationCode}
							onChange={event =>
								setVerificationCode(event.target.value.replace(/\D/g, '').slice(0, 6))
							}
							className='mb-5 w-full rounded border border-border bg-transparent px-4 py-3 text-center text-2xl tracking-[0.4em] outline-none focus:border-primary'
							placeholder='000000'
							inputMode='numeric'
							autoComplete='one-time-code'
						/>

						<div className='flex flex-wrap items-center gap-3'>
							<Button
								type='button'
								isLoading={isVerifyingEmailCode}
								disabled={verificationCode.length !== 6}
								onClick={() => verifyEmailCode()}
							>
								Confirm
							</Button>
							<Button
								type='button'
								variant='secondary'
								isLoading={isSendingVerificationCode}
								onClick={() => sendVerificationCode()}
							>
								Send again
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
