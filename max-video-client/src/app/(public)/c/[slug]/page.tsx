import { Video } from 'lucide-react'

import { Heading } from '@/ui/Heading'
import { VideoItem } from '@/ui/video-item/VideoItem'

import { channelService } from '@/services/channel.service'
import type { TPageSlugProp } from '@/types/page.types'

export const revalidate = 100
export const dynamic = 'force-static'

// TODO: Dynamic meta data

export default async function ChannelPage({ params: { slug } }: TPageSlugProp) {
	const data = await channelService.bySlug(slug)
	const channel = data.data

	return (
		<section>
			{!!channel.videos.length && (
				<section className='mb-10'>
					<Heading Icon={Video}>Videos</Heading>
					<div className='grid-6-cols'>
						{channel.videos.map(video => (
							<VideoItem
								key={video.id}
								video={video}
							/>
						))}
					</div>
				</section>
			)}
		</section>
	)
}
