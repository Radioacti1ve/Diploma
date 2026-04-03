import type { IChannel } from './channel.types'

export interface IVideo {
	id: string
	publicId: string
	title: string
	description: string
	thumbnailUrl: string
	videoFileName: string
	viewsCount: number
	isPublic: boolean
	channel: IChannel
	createdAt: string
}

export interface IExploreVideosResponse {
	page: number
	limit: number
	totalCount: number
	totalPages: number
	videos: IVideo[]
}

export interface IFullVideo extends IVideo {
	likes: []
}

export interface ISingleVideoResponse extends IFullVideo {
	similarVideos: IVideo[]
}
