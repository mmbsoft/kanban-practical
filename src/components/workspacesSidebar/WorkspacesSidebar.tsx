import './WorkspacesSidebar.scss'
import { UserProfile } from '../userProfile'
import { WorkspaceSettings } from '../workspaceSettings'
import { Dashboard, Boards, Profile, Search } from '../../assets/icons'

const sidebarMenuItems = [
	{
		id: 1,
		icon: Dashboard,
		src: '#',
		title: 'Dashboard',
		active: false,
	},
	{
		id: 2,
		icon: Boards,
		src: '#',
		title: 'Boards',
		active: true,
	},
	{
		id: 3,
		icon: Profile,
		src: '#',
		title: 'Profile',
		active: false,
	},
	{
		id: 4,
		icon: Search,
		src: '#',
		title: 'Search',
		active: false,
	},
]

export const WorkspacesSidebar = () => {
	return (
		<div className="workspaces">
			<div className="workspaces-sidebar">
				<ul className="menu-wrapper">
					{sidebarMenuItems.map((item) => (
						<li
							key={item.id}
							className={`menu-item ${item.active ? 'menu-active' : ''}`}
						>
							<a href={item.src}>
								{item.icon()}
								<span>{item.title}</span>
							</a>
						</li>
					))}
				</ul>
			</div>
			<div className="workspaces-footer">
				<UserProfile />
				<WorkspaceSettings />
			</div>
		</div>
	)
}
