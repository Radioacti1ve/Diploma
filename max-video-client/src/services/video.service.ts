import axios from 'axios'

import type { IExploreVideosResponse, IVideo } from '@/types/video.types'

class VideoService {
	async getAll(searchTerm?: string | null) {
		const response = await axios.get<IExploreVideosResponse>(
			'http://127.0.0.1:4200/api/videos',
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

	getTrendingVideos() {
		return axios.get<IVideo[]>('http://127.0.0.1:4200/api/videos/trending')
	}

	async getExploreVideos() {
		const response = await axios.get<IExploreVideosResponse>(
			'http://127.0.0.1:4200/api/videos/explore'
		)
		return response.data
	}
}

export const videoService = new VideoService()
