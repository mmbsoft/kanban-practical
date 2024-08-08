import './App.scss'
import { WorkspacesSidebar } from './components/workspacesSidebar'
import { WorkspacesBoard } from './components/workspaceBoard'

export const App = () => {
	return (
		<div className="container">
			<WorkspacesSidebar />
			<WorkspacesBoard />
		</div>
	)
}
