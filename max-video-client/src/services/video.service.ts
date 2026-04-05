import { axiosClassic } from '@/api/axios'

import type { ISingleVideoResponse, IVideo, IVideosPagination } from '@/types/video.types'

class VideoService {
	private _VIDEOS = '/videos'

	async getAll(searchTerm?: string | null) {
		const response = await axiosClassic.get<IVideosPagination>(
			this._VIDEOS,
			searchTerm
				? {
						params: {
							searchTerm
						}
					}
				: {}
		)
		return response.data
	}

	byPublicId(publicId?: string | null) {
		return axiosClassic.get<ISingleVideoResponse>(`${this._VIDEOS}/by-publicId/${publicId}`)
	}

	async getVideoGames() {
		const response = await axiosClassic.get<IVideosPagination>(`${this._VIDEOS}/games`)
		return response.data
	}

	getTrendingVideos() {
		return axiosClassic.get<IVideo[]>(`${this._VIDEOS}/trending`)
	}

	async getExploreVideos(userId?: string) {
		const response = await axiosClassic.get<IVideosPagination>(`${this._VIDEOS}/explore`, {
			params: {
				userId
			}
		})
		return response.data
	}

	updateViews(publicId: string) {
		return axiosClassic.put(`${this._VIDEOS}/update-views-count/${publicId}`)
	}
}

export const videoService = new VideoService()
