import { Channel } from '@prisma/client'

export const CHANNELS: Partial<Channel & { name: string }>[] = [
	{
		name: 'RED Group',
		slug: 'redgroup',
		description:
			'Канал про игры, кинообзоры и полезные подборки для вечернего отдыха без лишнего шума.',
		avatarUrl: '/uploads/avatars/redgroup.jpg',
		bannerUrl: '/uploads/banners/redgroup.jpg',
		isVerified: true
	},
	{
		name: 'RED Group +',
		slug: 'redgroup-plus',
		description:
			'Расширенные выпуски: подробные обзоры, разборы фильмов/сцен, большие подборки и сетапы для дома.',
		avatarUrl: '/uploads/avatars/redgroup-plus.jpg',
		bannerUrl: '/uploads/banners/redgroup-plus.jpg'
	},
	{
		name: 'Hustle in Silence',
		slug: 'his',
		description: 'Channel about hobbies, lifestyle, and mindful rest',
		avatarUrl: '/uploads/avatars/his.jpg'
	},
	{
		name: 'Maddix // EXTATIC',
		slug: 'maddixmusic',
		description:
			'Dutch DJ/producer Maddix is known for his genre-breaking techno-rave sound, infused with big room and trance influences.',
		avatarUrl: '/uploads/avatars/maddix.jpg',
		bannerUrl: '/uploads/banners/maddix-banner.jpg'
	},
	{
		name: 'Maisy Leigh',
		slug: 'maisyleigh',
		description:
			'Hi! I`m Maisy! Bringing cozy creations to life, finding my zen, and sharing my cozy lifestyle :)',
		avatarUrl: '/uploads/avatars/cozya.jpg',
		bannerUrl: '/uploads/banners/cozy.jpg',
		isVerified: true
	},
	{
		name: 'KURUCHBRO',
		slug: 'kuruchbro',
		avatarUrl: '/uploads/avatars/kuruch.jpg',
		bannerUrl: '/uploads/banners/kuruchb.jpg'
	},
	{
		name: 'SpawnPoiint',
		slug: 'spawnpoiint',
		description:
			'SpawnPoiint: Weekly videos about Tech, Gaming and Setups! Bringing you high quality and aesthetically pleasing content from the UK. Reviewing the latest smart home tech, PlayStation, Xbox, TV Setups, Desk Setups, Apple, Gaming and more. Everything you see is recorded on an iPhone.',
		avatarUrl: '/uploads/avatars/spawn.jpg',
		bannerUrl: '/uploads/banners/spawnb.jpg',
		isVerified: true
	},
	{
		name: 'John Summit',
		slug: 'johnsummit',
		description: 'forever trying to find comfort in chaos..',
		avatarUrl: '/uploads/avatars/john.jpg',
		bannerUrl: '/uploads/banners/johnb.jpg',
		isVerified: true
	},
	{
		name: 'VISUALDON',
		slug: 'visualdon',
		description: '3D Visual Artist. I make Retro & Space visuals.',
		avatarUrl: '/uploads/avatars/visual.jpg',
		bannerUrl: '/uploads/banners/visualb.jpg',
		isVerified: true
	},
	{
		name: 'Tomorrowland',
		slug: 'tomorrowlandchannel',
		description:
			'Relive all the magical moments of Tomorrowland all year long.',
		avatarUrl: '/uploads/avatars/tomorrow.jpg',
		bannerUrl: '/uploads/banners/tomorrowb.jpg',
		isVerified: true
	}
]
