import type { SubmitHandler, UseFormReturn } from 'react-hook-form'

import { SkeletonLoader } from '@/ui/SkeletonLoader'
import { Button } from '@/ui/button/Button'
import { Field } from '@/ui/field/Field'
import { Textarea } from '@/ui/field/Textarea'

import type { IVideoFormData } from '@/types/studio-video.types'

interface Props {
	form: UseFormReturn<IVideoFormData, any, undefined>
	isReadyToPublish: boolean
}

export function VideoForm({
	form: {
		register,
		handleSubmit,
		formState: { errors }
	},
	isReadyToPublish
}: Props) {
	/* const { mutate, isPending } = useMutation({
		mutationKey: ['create a playlist'],
		mutationFn: (data: IPlaylistData) => playlistService.createPlaylist(data),
		onSuccess() {
			reset()
			toast.success('Playlist successfully created!')
		},
		onError() {
			toast.error('Playlist has error!')
		}
	}) */

	const onSubmit: SubmitHandler<IVideoFormData> = data => {
		// mutate(data)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{false ? (
				<SkeletonLoader count={2} />
			) : (
				<>
					<Field
						label='Title'
						type='text'
						registration={register('title', { required: 'Title is required!' })}
						error={errors.title?.message}
						placeholder='Enter title:'
					/>
					<Textarea
						label='Description'
						registration={register('description')}
						error={errors.description?.message}
						placeholder='Enter description:'
						rows={12}
					/>

					{/* Upload a thumbnail */}
					{/* Tags */}
				</>
			)}
			<div className='text-center mt-4'>
				<Button
					type='submit'
					disabled={!isReadyToPublish}
				>
					{isReadyToPublish ? 'Publish' : 'Wait processing...'}
				</Button>
			</div>
		</form>
	)
}
