import { instance } from '@/api/axios'

import type { IFullUser } from '@/types/user.types'

class UserService {
	private _USERS = '/users'

	getProfile() {
		return instance.get<IFullUser>(`${this._USERS}/profile`)
	}
}

export const userService = new UserService()
