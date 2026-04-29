import { instance } from '@/api/axios'

import type { ISettingsData } from '@/app/studio/settings/settings.types'
import type { IProfileResponse } from '@/types/user.types'

class UserService {
	private _USERS = '/users'

	getProfile() {
		return instance.get<IProfileResponse>(`${this._USERS}/profile`)
	}

	updateProfile(data: ISettingsData) {
		return instance.put<boolean>(`${this._USERS}/profile`, data)
	}

	sendVerificationCode() {
		return instance.post<boolean>(`${this._USERS}/profile/send-verification-code`)
	}

	verifyEmailCode(code: string) {
		return instance.post<boolean>(`${this._USERS}/profile/verify-email-code`, { code })
	}

	toggleLike(videoId: string) {
		return instance.put(`${this._USERS}/profile/likes`, { videoId })
	}
}

export const userService = new UserService()
