import type { IVideo } from './video.types'

export interface IChannel {
	id: string
	name: string
	slug: string
	description: string
	isVerified: boolean
	avatarUrl: string
	bannerUrl: string
	user: {
		name: string;
	}
	videos: IVideo[]
	subscribers: []
	createdAt: string
}
