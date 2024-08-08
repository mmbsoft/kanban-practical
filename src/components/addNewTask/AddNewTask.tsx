import './AddNewTask.scss'
import { Plus } from '../../assets/icons'

export const AddNewTask: React.FC<{
	onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}> = ({ onClick }) => {
	return (
		<div className="new-task">
			<button className="button-reset" onClick={onClick}>
				<Plus />
				Add a card
			</button>
		</div>
	)
}
