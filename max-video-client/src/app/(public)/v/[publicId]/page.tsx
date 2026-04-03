import parse from 'html-react-parser'
import { Heart, ListPlus } from 'lucide-react'
import type { Metadata } from 'next'
import dynamicNext from 'next/dynamic'
import Image from 'next/image'

import { Heading } from '@/ui/Heading'
import { SkeletonLoader } from '@/ui/SkeletonLoader'
import { VerifiedBadge } from '@/ui/VerifiedBadge'

import { transformCount } from '@/utils/transform-count'

import { SimilarVideos } from './SimilarVideos'
import { videoService } from '@/services/video.service'
import type { TPagePublicIdProp } from '@/types/page.types'

const DynamicSubscribeButton = dynamicNext(
	() => import('@/components/SubscribeButton').then(mod => mod.SubscribeButton),
	{ ssr: false, loading: () => <SkeletonLoader className='w-36 h-10 rounded-md' /> }
)

export const revalidate = 100
export const dynamic = 'force-static'

export async function generateMetadata({
	params: { publicId }
}: TPagePublicIdProp): Promise<Metadata> {
	const data = await videoService.byPublicId(publicId)
	const video = data.data

	console.log(parse(video.description.slice(0, 150)).toString())

	return {
		title: video.title,
		description: parse(video.description.slice(0, 150)).toString(),
		openGraph: {
			type: 'video.other',
			images: [video.thumbnailUrl]
		}
	}
}

export async function generateStaticParams() {
	const data = await videoService.getAll()

	return data.videos.map(video => ({
		publicId: video.publicId
	}))
}

export default async function VideoPage({ params: { publicId } }: TPagePublicIdProp) {
	const data = await videoService.byPublicId(publicId)
	const video = data.data

	return (
		<section className='grid grid-cols-[2.7fr_1fr] gap-10'>
			<div>
				<div className='relative w-full h-[249px] rounded-2xl overflow-hidden shadow-md'>
					{/* <video src={video.videoFileName} /> */}
				</div>
				<div className='flex justify-between items-start'>
					<div>
						<Heading
							className='mb-1'
							isPageHeading
						>
							{video.title}
						</Heading>
						<div className='text-gray-400'>{video.viewsCount.toLocaleString()} views</div>
					</div>
					<div>
						<button>
							<ListPlus />
							Save
						</button>
						<button className='text-primary'>
							<Heart />
							{transformCount(video.likes.length)}
						</button>
					</div>
				</div>
				<div className='flex items-center justify-between'>
					<div className='flex gap-1.5 items-center'>
						<Image
							alt={video.channel.user.name || ''}
							src={video.channel.avatarUrl}
							width={40}
							height={40}
							className='rounded flex-shrink-0 shadow'
							priority
						/>
						<div>
							<Heading>
								<span className='flex items-center gap-2'>
									{video.channel.user.name}
									{video.channel.isVerified && <VerifiedBadge size={18} />}
								</span>
							</Heading>

							<div className='mb-2 text-gray-400 text-[0.9rem] flex items-center gap-1'>
								{transformCount(video.channel.subscribers.length)} subscribers
							</div>
						</div>
					</div>
					<DynamicSubscribeButton slug={video.channel.slug} />
				</div>
				{/* TODO: Collapse description */}
				<article className='mb-4 text-gray-400 text-sm leading-snug w-3/4'>
					{parse(video.description)}
				</article>
				{/* TODO: Comments */}
			</div>
			{!!video.similarVideos.length && <SimilarVideos videos={video.similarVideos} />}
		</section>
	)
}
