import './Task.scss'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
	Edit,
	Trash,
	DragHandle,
	NewSubtask,
	Checkmark,
	Reverse,
} from '../../assets/icons'
import { AppDispatch } from '../../store/store'
import {
	removeTask,
	updateTaskName,
	addSubtask,
	generateTaskId,
	updateSubtasks,
	markTaskCompleted,
} from '../../store/slices/boardSlice'
import { TaskInterface } from '../../store/types'
import { AddNewTask } from '../addNewTask/AddNewTask'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
	SortableContext,
	arrayMove,
	rectSortingStrategy,
} from '@dnd-kit/sortable'
import { DndContext } from '@dnd-kit/core'

export const Task: React.FC<TaskInterface> = ({
	id,
	title,
	subtasks,
	completed,
}) => {
	const [isHovered, setIsHovered] = useState<boolean>(false)
	const [isEditMode, setIsEditMode] = useState<boolean>(false)
	const [localTaskTitle, setLocalTaskTitle] = useState<string>(title)
	const [isRemoving, setIsRemoving] = useState<boolean>(false)

	const dispatch = useDispatch<AppDispatch>()

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition: sortableTransition,
		setActivatorNodeRef,
	} = useSortable({ id })

	const style = {
		transform: CSS.Transform.toString(transform),
		opacity: isRemoving ? 0 : 1,
		maxHeight: isRemoving ? 0 : '100%',
		overflow: 'hidden',
		transition: `${sortableTransition}, opacity 0.3s ease, max-height 0.3s ease, background-color 0.3s ease`,
		backgroundColor: completed ? '#d3f9d8' : '#fff',
	}

	const handleRemoveTask = (taskId: string) => {
		setIsRemoving(true)
		setTimeout(() => {
			dispatch(removeTask({ taskId }))
		}, 300)
	}

	const handleEditTask = (taskId: string, newTitle: string) => {
		dispatch(updateTaskName({ id: taskId, title: newTitle }))
		setIsEditMode(false)
	}

	const handleRejectEditTask = () => {
		setLocalTaskTitle(title)
		setIsEditMode(false)
	}

	const handleAddSubtask = () => {
		dispatch(
			addSubtask({
				parentId: id,
				subtask: {
					id: generateTaskId(),
					title: 'Subtask',
					subtasks: [],
					completed: false,
				},
			}),
		)
	}

	const handleSubtaskDragEnd = (e: { active: any; over: any }) => {
		const { active, over } = e

		const currentSubtasks = subtasks || []

		if (active && over && active.id !== over.id) {
			const oldIndex = currentSubtasks.findIndex((sub) => sub.id === active.id)
			const newIndex = currentSubtasks.findIndex((sub) => sub.id === over.id)

			if (oldIndex !== -1 && newIndex !== -1) {
				const newSubtasks = arrayMove(currentSubtasks, oldIndex, newIndex)

				dispatch(updateSubtasks({ parentId: id, subtasks: newSubtasks }))
			} else {
				console.error('Subtask not found')
			}
		}
	}

	const handleCompleteTask = (taskId: string) => {
		dispatch(markTaskCompleted({ taskId }))
	}

	return (
		<>
			<div
				ref={setNodeRef}
				style={style}
				className={`task ${isRemoving ? 'removing' : ''}`}
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
								{!completed && (
									<button
										className="button-reset"
										onClick={() => handleCompleteTask(id)}
									>
										<Checkmark />
									</button>
								)}
								{subtasks?.length === 0 && !completed && (
									<>
										<button className="button-reset" onClick={handleAddSubtask}>
											<NewSubtask />
										</button>
									</>
								)}

								{!completed ? (
									<button
										className="button-reset"
										onClick={() => setIsEditMode(!isEditMode)}
									>
										<Edit />
									</button>
								) : (
									<button
										className="button-reset"
										onClick={() => handleCompleteTask(id)}
									>
										<Reverse />
									</button>
								)}
							</>
						) : (
							<>
								<button
									className="button-reset"
									onClick={() => handleEditTask(id, localTaskTitle)}
								>
									<Checkmark />
								</button>
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
			</div>

			{subtasks && subtasks.length > 0 && (
				<DndContext onDragEnd={handleSubtaskDragEnd}>
					<SortableContext
						items={subtasks.map((sub) => sub.id)}
						strategy={rectSortingStrategy}
					>
						<div className="subtasks">
							{subtasks.map((subtask, index) => (
								<React.Fragment key={subtask.id}>
									<Task
										id={subtask.id}
										title={subtask.title}
										subtasks={subtask.subtasks}
										completed={subtask.completed}
									/>
									{index === subtasks.length - 1 && !completed && (
										<AddNewTask onClick={handleAddSubtask} />
									)}
								</React.Fragment>
							))}
						</div>
					</SortableContext>
				</DndContext>
			)}
		</>
	)
}
