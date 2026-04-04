import Image from 'next/image'
import Link from 'next/link'

import { Heading } from '@/ui/Heading'
import { VerifiedBadge } from '@/ui/VerifiedBadge'

import { PAGE } from '@/config/public-page.config'

import { transformDate } from '@/utils/transform-date'

import { CommentActions } from './CommentActions'
import { getInitials } from './get-initials'
import type { ISingleVideoResponse } from '@/types/video.types'

interface Props {
	comment: ISingleVideoResponse['comments'][0]
}

export function CommentItem({ comment }: Props) {
	return (
		<div className='flex gap-3.5 items-start py-5 border-b border-b-border/5 last:border-none'>
			{comment.user?.channel ? (
				<Link href={PAGE.CHANNEL(comment?.user?.channel?.slug || '')}>
					<Image
						alt={comment.user.name || ''}
						src={comment.user.channel?.avatarUrl || ''}
						width={40}
						height={40}
						className='rounded-lg flex-shrink-0 shadow'
					/>
				</Link>
			) : (
				<div className='w-10 h-10 text-xl font-medium bg-gray-200 text-gray-800 flex items-center justify-center rounded-lg flex-shrink-0 shadow'>
					{getInitials(comment.user.name || 'Anonym')}
				</div>
			)}
			<div>
				<div className='flex items-center gap-3 mb-2'>
					<Heading
						className='mb-0'
						classNameHeading='text-base'
					>
						<span className='flex items-center gap-2'>
							{comment.user.name}
							{comment.user.channel?.isVerified && <VerifiedBadge size={14} />}
						</span>
					</Heading>

					<div className='text-gray-500 text-xs'>{transformDate(comment.createdAt)}</div>
				</div>
				<div className='text-gray-300 text-sm leading-snug'>{comment.text}</div>
				<CommentActions />
			</div>
		</div>
	)
}
