import './WorkspacesBoard.scss'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { Task } from '../task'
import { AddNewTask } from '../addNewTask/AddNewTask'
import { addTask } from '../../store/slices'

export const WorkspacesBoard: React.FC = () => {
	const tasks = useSelector((state: RootState) => state.board.tasks)
	const dispatch = useDispatch<AppDispatch>()

	const handleAddTask = () => {
		dispatch(addTask())
	}

	return (
		<div className="workspaces-board">
			{tasks.length === 0 ? (
				<AddNewTask onClick={handleAddTask} />
			) : (
				<ul>
					{tasks.map((task, index) => {
						const isLast = index === tasks.length - 1

						return (
							<React.Fragment key={task.id}>
								<Task id={task.id} title={task.title} />
								{isLast && <AddNewTask onClick={handleAddTask} />}
							</React.Fragment>
						)
					})}
				</ul>
			)}
		</div>
	)
}
