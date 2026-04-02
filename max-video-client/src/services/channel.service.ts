import { axiosClassic } from '@/api/axios'

import type { IChannel } from '@/types/channel.types'

class ChannelService {
	private _CHANNELS = '/channels'

	getAll() {
		return axiosClassic.get<IChannel[]>(this._CHANNELS)
	}

	bySlug(slug?: string | null) {
		return axiosClassic.get<IChannel>(`${this._CHANNELS}/by-slug/${slug}`)
	}
}

export const channelService = new ChannelService()
