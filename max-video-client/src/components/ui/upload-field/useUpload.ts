import { useMutation } from '@tanstack/react-query'
import { type ChangeEvent, useCallback } from 'react'
import toast from 'react-hot-toast'

import { fileService } from '@/services/studio/file.service'
import type { IFileResponse } from '@/types/file.types'

interface Props {
	folder?: string
	onChange?: (...event: any[]) => void
	onSuccess?: (data: IFileResponse[]) => void
	onError?: () => void
}

type TUseUpload = (props: Props) => {
	uploadFile: (e: ChangeEvent<HTMLInputElement>) => void
	isLoading: boolean
}

export const useUpload: TUseUpload = ({ onChange, folder, onError, onSuccess }) => {
	const { mutate, isPending } = useMutation({
		mutationKey: ['upload file'],
		mutationFn: (data: FormData) => fileService.upload(data, folder),
		onSuccess: ({ data }) => {
			onChange && onChange(data[0].url)
			onSuccess && onSuccess(data)
		},
		onError: error => {
			toast.error(error.message)
			onError && onError()
		}
	})

	const uploadFile = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files
			if (!files?.length) return

			const formData = new FormData()
			formData.append('file', files[0])

			mutate(formData)
		},
		[mutate]
	)

	return {
		uploadFile,
		isLoading: isPending
	}
}
