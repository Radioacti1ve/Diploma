import { instance } from '@/api/axios'

import type { IPaginationParams } from '@/types/pagination.types'
import type { IVideoFormData } from '@/types/studio-video.types'
import type { IVideo, IFullVideosPagination } from '@/types/video.types'

class StudioVideoService {
	private _VIDEOS = '/studio/videos'

	async getAll(params?: IPaginationParams) {
		const data = await instance.get<IFullVideosPagination>(this._VIDEOS, {
			params
		})
		return data.data
	}

	byId(id: string) {
		return instance.get<IVideo>(`${this._VIDEOS}/${id}`)
	}

	create(dto: IVideoFormData) {
		return instance.post(this._VIDEOS, dto)
	}

	update(id: string, dto: IVideoFormData) {
		return instance.put(`${this._VIDEOS}/${id}`, dto)
	}

	delete(id: string) {
		return instance.delete(`${this._VIDEOS}/${id}`)
	}
}

export const studioVideoService = new StudioVideoService()
