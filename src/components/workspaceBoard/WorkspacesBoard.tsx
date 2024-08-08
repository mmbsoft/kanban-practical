import './WorkspacesBoard.scss'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { Task } from '../task'
import { AddNewTask } from '../addNewTask/AddNewTask'
import { addTask, updateTasks } from '../../store/slices'
import { DndContext, closestCenter } from '@dnd-kit/core'
import {
	SortableContext,
	rectSortingStrategy,
	arrayMove,
} from '@dnd-kit/sortable'

export const WorkspacesBoard: React.FC = () => {
	const tasks = useSelector((state: RootState) => state.board.tasks)
	const dispatch = useDispatch<AppDispatch>()

	const handleAddTask = () => {
		dispatch(addTask())
	}

	const handleDragEnd = (event: { active: any; over: any }) => {
		const { active, over } = event

		if (active && over && active.id !== over.id) {
			const oldIndex = tasks.findIndex((task) => task.id === active.id)
			const newIndex = tasks.findIndex((task) => task.id === over.id)

			const newTasks = arrayMove(tasks, oldIndex, newIndex)
			dispatch(updateTasks(newTasks))
		}
	}

	return (
		<div className="workspaces-board">
			{tasks.length === 0 ? (
				<AddNewTask onClick={handleAddTask} />
			) : (
				<DndContext
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={tasks.map((task) => task.id)}
						strategy={rectSortingStrategy}
					>
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
					</SortableContext>
				</DndContext>
			)}
		</div>
	)
}
