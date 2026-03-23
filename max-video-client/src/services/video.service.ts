import axios from 'axios'

import type { IExploreVideosResponse } from '@/types/video.types'

class VideoService {
	async getExploreVideos() {
		const response = await axios.get<IExploreVideosResponse>(
			'http://localhost:4200/api/videos/explore'
		)
		return response.data
	}
}

export const videoService = new VideoService()
