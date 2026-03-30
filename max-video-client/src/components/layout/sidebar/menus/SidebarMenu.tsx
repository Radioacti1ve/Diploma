import { usePathname } from 'next/navigation'
import { match } from 'path-to-regexp'

import type { ISidebarItem } from '../sidebar.types'

import { MenuItem } from './MenuItem'

interface Props {
	title?: string
	menu: ISidebarItem[]
	isShowedSidebar: boolean
}

export function SidebarMenu({ menu, title, isShowedSidebar }: Props) {
	const pathname = usePathname()

	return (
		<nav>
			{title && <div className='opacity-40 uppercase font-medium text-xs mb-3'>{title}</div>}
			<ul>
				{menu.map(menuItem => (
					<MenuItem
						key={menuItem.label}
						item={menuItem}
						isActive={!!match(menuItem.link)(pathname)}
						isShowedSidebar={isShowedSidebar}
					/>
				))}
			</ul>
		</nav>
	)
}
