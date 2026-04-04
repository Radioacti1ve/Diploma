'use client'

import { useQuery } from '@tanstack/react-query'

import { CommentItem } from './CommentItem'
import { commentService } from '@/services/comment.service'
import type { ISingleVideoResponse } from '@/types/video.types'

interface Props {
	video: ISingleVideoResponse
}

export function Comments({ video }: Props) {
	const { data, isLoading, refetch } = useQuery({
		queryKey: ['comments', video.id],
		queryFn: () => commentService.byVideoPublicId(video.publicId),
		initialData: video.comments
	})

	return (
		<div className='border-t border-t-border pt-7 mt-7'>
			{/* FORM */}

			{!!data &&
				data.map(comment => (
					<CommentItem
						key={comment.id}
						comment={comment}
					/>
				))}
		</div>
	)
}
