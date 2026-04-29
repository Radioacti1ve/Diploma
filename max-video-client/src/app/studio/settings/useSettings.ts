import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

import { useProfile } from '@/hooks/useProfile'

import type { ISettingsData } from './settings.types'
import { userService } from '@/services/studio/user.service'

export function useSettings() {
	const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)
	const [verificationCode, setVerificationCode] = useState('')

	const form = useForm<ISettingsData>({
		mode: 'onChange'
	})

	const { profile, isSuccess, isLoading, refetch } = useProfile()

	useEffect(() => {
		if (!isSuccess) return

		const channel = profile?.channel
			? {
					avatarUrl: profile?.channel?.avatarUrl,
					bannerUrl: profile?.channel?.bannerUrl,
					description: profile?.channel?.description,
					slug: profile?.channel?.slug
				}
			: {}

		form.reset({
			channel,
			email: profile?.email,
			name: profile?.name
		})
	}, [form, isSuccess, profile])

	const { mutate, isPending } = useMutation({
		mutationKey: ['update-settings'],
		mutationFn: (data: ISettingsData) => userService.updateProfile(data),
		onSuccess() {
			refetch()
		}
	})

	const onSubmit: SubmitHandler<ISettingsData> = data => {
		mutate(data)
	}

	const { mutate: sendVerificationCode, isPending: isSendingVerificationCode } =
		useMutation({
			mutationKey: ['send-verification-code'],
			mutationFn: () => userService.sendVerificationCode(),
			async onSuccess() {
				setIsVerifyModalOpen(true)
				const { toast } = await import('react-hot-toast')
				toast.success('Verification code sent!')
			},
			async onError(error) {
				const { toast } = await import('react-hot-toast')

				if (axios.isAxiosError(error)) {
					toast.error(error.response?.data?.message || 'Code sending failed!')
					return
				}

				toast.error('Code sending failed!')
			}
		})

	const { mutate: verifyEmailCode, isPending: isVerifyingEmailCode } = useMutation({
		mutationKey: ['verify-email-code'],
		mutationFn: () => userService.verifyEmailCode(verificationCode),
		async onSuccess() {
			await refetch()
			setVerificationCode('')
			setIsVerifyModalOpen(false)

			const { toast } = await import('react-hot-toast')
			toast.success('Email successfully verified!')
		},
		async onError(error) {
			const { toast } = await import('react-hot-toast')

			if (axios.isAxiosError(error)) {
				toast.error(error.response?.data?.message || 'Invalid verification code!')
				return
			}

			toast.error('Invalid verification code!')
		}
	})

	return {
		onSubmit,
		formObject: form,
		isLoading: isPending,
		isProfileLoading: isLoading,
		profile,
		isVerifyModalOpen,
		setIsVerifyModalOpen,
		verificationCode,
		setVerificationCode,
		sendVerificationCode,
		verifyEmailCode,
		isSendingVerificationCode,
		isVerifyingEmailCode
	}
}
