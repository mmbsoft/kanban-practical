import './Task.scss'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Edit, Trash, DragHandle, NewSubtask } from '../../assets/icons'
import { AppDispatch } from '../../store/store'
import {
	removeTask,
	updateTaskName,
	addSubtask,
	generateTaskId,
} from '../../store/slices/boardSlice'
import { TaskInterface } from '../../store/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export const Task: React.FC<TaskInterface> = ({ id, title, subtasks }) => {
	const [isHovered, setIsHovered] = useState<boolean>(false)
	const [isEditMode, setIsEditMode] = useState<boolean>(false)
	const [localTaskTitle, setLocalTaskTitle] = useState<string>(title)
	const [newSubtaskTitle, setNewSubtaskTitle] = useState<string>('New Subtask')

	const dispatch = useDispatch<AppDispatch>()

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		setActivatorNodeRef,
	} = useSortable({ id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

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

	const handleAddSubtask = () => {
		if (newSubtaskTitle.trim()) {
			dispatch(
				addSubtask({
					parentId: id,
					subtask: { id: generateTaskId(), title: newSubtaskTitle },
				}),
			)
			setNewSubtaskTitle('')
		}
	}

	return (
		<>
			<li
				ref={setNodeRef}
				style={style}
				className="task"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<button
					className={`button-reset dnd toggle-element ${isHovered ? 'show' : ''}`}
					ref={setActivatorNodeRef}
					{...listeners}
					{...attributes}
				>
					<DragHandle />
				</button>

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
							<>
								<button className="button-reset" onClick={handleAddSubtask}>
									<NewSubtask />
								</button>
								<button
									className="button-reset"
									onClick={() => setIsEditMode(!isEditMode)}
								>
									<Edit />
								</button>
							</>
						) : (
							<>
								<button
									className="button-reset icon-checkmark"
									onClick={() => handleEditTask(id, localTaskTitle)}
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

			<ul className="subtasks">
				{subtasks &&
					subtasks.map((subtask) => (
						<Task
							key={subtask.id}
							id={subtask.id}
							title={subtask.title}
							subtasks={subtask.subtasks}
						/>
					))}
			</ul>
		</>
	)
}
