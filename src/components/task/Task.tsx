import './Task.scss'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Edit, Trash } from '../../assets/icons'
import { AppDispatch } from '../../store/store'
import { removeTask, updateTaskName } from '../../store/slices/boardSlice'
import { TaskInterface } from '../../store/types'

export const Task: React.FC<TaskInterface> = ({ id, title }) => {
	const [isHovered, setIsHovered] = useState<boolean>(false)
	const [isEditMode, setIsEditMode] = useState<boolean>(false)
	const [localTaskTitle, setLocalTaskTitle] = useState<string>(title)

	const dispatch = useDispatch<AppDispatch>()

	const handleRemoveTask = (id: string) => {
		dispatch(removeTask(id))
	}

	const handleEditTask = (id: string, newTitle: string) => {
		dispatch(updateTaskName({ id, title: newTitle }))
		setIsEditMode(false)
	}

	const handleRejectEditTask = () => {
		setLocalTaskTitle(title)
		setIsEditMode(false)
	}

	return (
		<li
			className="task"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{!isEditMode ? (
				<span>{title}</span>
			) : (
				<input
					type="text"
					className="task-input"
					defaultValue={localTaskTitle}
					onChange={(e) => setLocalTaskTitle(e.target.value)}
					autoFocus
				/>
			)}

			{(isHovered || isEditMode) && (
				<div className="task-actions">
					{!isEditMode ? (
						<button
							className="button-reset"
							onClick={() => setIsEditMode(!isEditMode)}
						>
							<Edit />
						</button>
					) : (
						<>
							<button
								className="button-reset icon-checkmark"
								onClick={(e) => handleEditTask(id, localTaskTitle)}
							/>
							<button
								className="button-reset icon-close"
								onClick={handleRejectEditTask}
							/>
						</>
					)}

					{!isEditMode && (
						<button
							className="button-reset"
							onClick={() => handleRemoveTask(id)}
						>
							<Trash />
						</button>
					)}
				</div>
			)}
		</li>
	)
}
