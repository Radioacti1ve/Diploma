import { axiosClassic } from '@/api/axios'

import type { IExploreVideosResponse, IVideo } from '@/types/video.types'

class VideoService {
	private _VIDEOS = '/videos'

	async getAll(searchTerm?: string | null) {
		const response = await axiosClassic.get<IExploreVideosResponse>(
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

	getVideoGames() {
		return axiosClassic.get<IVideo[]>(`${this._VIDEOS}/games`)
	}

	getTrendingVideos() {
		return axiosClassic.get<IVideo[]>(`${this._VIDEOS}/trending`)
	}

	async getExploreVideos() {
		const response = await axiosClassic.get<IExploreVideosResponse>(`${this._VIDEOS}/explore`)

		return response.data
	}
}

export const videoService = new VideoService()
