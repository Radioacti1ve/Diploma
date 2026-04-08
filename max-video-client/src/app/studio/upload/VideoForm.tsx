import Image from 'next/image'
import { Controller, type UseFormReturn } from 'react-hook-form'

import { Field } from '@/ui/field/Field'
import { Textarea } from '@/ui/field/Textarea'
import { TagsField } from '@/ui/tags-field/TagsField'
import { UploadField } from '@/ui/upload-field/UploadField'

import { stripHtmlWithBreak } from '@/utils/strip-html'

import { UploadSkeleton } from './UploadSkeleton'
import type { IVideoFormData } from '@/types/studio-video.types'

interface Props {
	isPending?: boolean
	form: UseFormReturn<IVideoFormData>
}

export function VideoForm({
	form: {
		formState: { errors },
		control,
		register,
		watch
	},
	isPending
}: Props) {
	return (
		<div className='grid-cols-[2.5fr_1fr] grid gap-10'>
			{isPending ? (
				<UploadSkeleton />
			) : (
				<>
					<div>
						<Field
							label='Title'
							type='text'
							registration={register('title', { required: 'Title is required!' })}
							error={errors.title?.message}
							placeholder='Enter title:'
						/>

						<Controller
							control={control}
							name='description'
							render={({ field: { onChange, value }, fieldState: { error } }) => (
								<Textarea
									label='Description'
									value={stripHtmlWithBreak(value || '')}
									onChange={e => onChange(e.target.value)}
									error={error?.message}
									placeholder='Enter description:'
									rows={7}
								/>
							)}
						/>

						<Controller
							control={control}
							name='thumbnailUrl'
							render={({ field: { onChange, value }, fieldState: { error } }) => (
								<UploadField
									label='Thumbnail:'
									onChange={onChange}
									value={value}
									error={error}
									folder='thumbnails'
									className='mb-5'
									sizePreview={[151, 82]}
								/>
							)}
						/>

						<Controller
							control={control}
							name='tags'
							render={({ field: { onChange, value }, fieldState: { error } }) => (
								<TagsField
									label='Tags:'
									onTagsChange={onChange}
									tags={value}
									error={error?.message}
								/>
							)}
						/>
					</div>

					<div>
						<div className='bg-gray-700 rounded-md overflow-hidden'>
							{watch('thumbnailUrl') ? (
								<Image
									alt='Uploaded thumbnail'
									src={watch('thumbnailUrl')}
									width={249}
									height={140}
									className='w-full'
								/>
							) : (
								<div className='w-[249] h-[140] bg-gray-900 font-medium text-sm flex items-center justify-center'>
									Wait thumbnail...
								</div>
							)}
							<div className='text-sm p-2'>
								<span className='text-gray-400 text-[0.9rem] block mb-0.5'>File name:</span>
								<span>{watch('videoFileName')}</span>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	)
}
