import { Flame } from 'lucide-react'
import type { Metadata } from 'next'

import { Heading } from '@/ui/Heading'
import { VideoItem } from '@/ui/video-item/VideoItem'

import { Explore } from './explore/Explore'
import { videoService } from '@/services/video.service'
import { VideoGrid } from '@/ui/VideoGrid'

export const revalidate = 100

export const metadata: Metadata = {
	title: 'Home',
	description: 'Best video platform',
	alternates: {
		canonical: '/'
	},
	openGraph: {
		type: 'website',
		url: '/',
		title: 'Max Video'
	}
}

export default async function Home() {
	const data = await videoService.getTrendingVideos()
	const trendingVideos = data.data.slice(0, 6)

	return (
		<section>
			{!!trendingVideos.length && (
				<section className='mb-10'>
					<Heading Icon={Flame}>Trending</Heading>
					<VideoGrid>
						{trendingVideos.map(video => (
							<VideoItem
								key={video.id}
								video={video}
								Icon={Flame}
							/>
						))}
					</VideoGrid>
				</section>
			)}
			<Explore />
		</section>
	)
}
