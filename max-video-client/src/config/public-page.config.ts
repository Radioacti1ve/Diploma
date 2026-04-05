class PublicPage {
	AUTH = '/auth'

	HOME = '/'
	TRENDING = '/trending'
	VIDEO_GAMES = '/video-games'
	SUBSCRIPTIONS = '/subscriptions'

	MY_CHANNEL = '/my-channel'
	HISTORY = '/history'
	LIKED_VIDEOS = '/liked-videos'

	FEEDBACK = '/feedback'

	VIDEO(path: string) {
		return `/v/${path}`
	}

	CHANNEL(path: string) {
		return `/c/${path}`
	}

	PLAYLISTS(path?: string) {
		return `/playlists${path ? `/${path}` : ''}`
	}

	SEARCH(searchTerm: string) {
		return `/s?term=${searchTerm}`
	}
}

export const PAGE = new PublicPage()
