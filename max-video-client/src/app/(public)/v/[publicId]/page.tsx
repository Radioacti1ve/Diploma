import { Heart, ListPlus } from 'lucide-react'
import type { Metadata } from 'next'
import dynamicNext from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'

import { Heading } from '@/ui/Heading'
import { SkeletonLoader } from '@/ui/SkeletonLoader'
import { VerifiedBadge } from '@/ui/VerifiedBadge'

import { PAGE } from '@/config/public-page.config'

import { stripHtml } from '@/utils/strip-html'
import { transformCount } from '@/utils/transform-count'

import { SimilarVideos } from './SimilarVideos'
import { VideoDescription } from './description/VideoDescription'
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

	return {
		title: video.title,
		description: stripHtml(video.description).slice(0, 150),
		openGraph: {
			type: 'video.other',
			images: [video.thumbnailUrl]
		}
	}
}

export async function generateStaticParams() {
	const { videos } = await videoService.getAll()

	return videos.map(video => ({
		publicId: video.publicId
	}))
}

export default async function VideoPage({ params: { publicId } }: TPagePublicIdProp) {
	const data = await videoService.byPublicId(publicId)
	const video = data.data

	return (
		<section className='grid grid-cols-[2.7fr_1fr] gap-10'>
			<div>
				<div className='relative w-full h-[249px] rounded-2xl overflow-hidden shadow-md mb-6'>
					{/* <video src={video.videoFileName} /> */}
				</div>
				<div className='flex justify-between items-start pb-6 mb-6 border-b border-border'>
					<div>
						<Heading
							className='mb-1'
							isH1
							classNameHeading='text-xl'
						>
							{video.title}
						</Heading>
						<div className='text-gray-400'>{video.viewsCount.toLocaleString('ru-RU')} views</div>
					</div>
					<div className='flex items-center gap-7'>
						<button className='flex items-center gap-1 transition-opacity opacity-80 hover:opacity-100'>
							<ListPlus size={20} />
							Save
						</button>
						<button className='text-primary flex items-center gap-1.5 transition-opacity opacity-80 hover:opacity-100'>
							<Heart size={20} />
							{transformCount(video.likes.length)}
						</button>
					</div>
				</div>
				<div className='flex items-center justify-between mb-6'>
					<div className='flex gap-2.5 items-center'>
						<Link href={PAGE.CHANNEL(video.channel.slug)}>
							<Image
								alt={video.channel.user.name || ''}
								src={video.channel.avatarUrl}
								width={55}
								height={55}
								className='rounded flex-shrink-0 shadow'
								priority
							/>
						</Link>
						<div>
							<Link href={PAGE.CHANNEL(video.channel.slug)}>
								<Heading
									className='mb-0'
									classNameHeading='text-lg'
								>
									<span className='flex items-center gap-2'>
										{video.channel.user.name}
										{video.channel.isVerified && <VerifiedBadge size={14} />}
									</span>
								</Heading>
							</Link>

							<div className='text-gray-400 text-sm flex items-center gap-1'>
								{transformCount(video.channel.subscribers.length)} subscribers
							</div>
						</div>
					</div>
					<DynamicSubscribeButton slug={video.channel.slug} />
				</div>

				<VideoDescription description={video.description} />
				{/* TODO: Comments */}
			</div>
			{!!video.similarVideos.length && <SimilarVideos videos={video.similarVideos} />}
		</section>
	)
}
