import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BoardInterface, TaskInterface } from '../types'
import { customAlphabet } from 'nanoid'

export const generateTaskId = customAlphabet('1234567890', 6)

const initialState: BoardInterface | Record<string, never> = {
	tasks: [
		{
			id: generateTaskId(),
			title: 'Social Media posts for Acme',
			subtasks: [
				{
					id: generateTaskId(),
					title: 'Create content',
				},
				{
					id: generateTaskId(),
					title: 'Schedule posts',
				},
			],
		},
		{
			id: generateTaskId(),
			title: 'Social Media posts for Acme',
			subtasks: [],
		},
		{
			id: generateTaskId(),
			title: 'Facebook Campaign',
			subtasks: [],
		},
		{
			id: generateTaskId(),
			title: 'TikTok Profile Setup',
			subtasks: [],
		},
	],
}

export const boardSlice = createSlice({
	name: 'board',
	initialState,
	reducers: {
		addTask(state) {
			const newTask = { id: generateTaskId(), title: 'New Task', subtasks: [] }
			state.tasks.push(newTask)
		},
		removeTask(
			state,
			action: PayloadAction<{ parentId?: string; taskId: string }>,
		) {
			const removeTaskRecursively = (
				tasks: TaskInterface[],
				taskId: string,
			): TaskInterface[] => {
				return tasks.filter((task) => {
					if (task.id === taskId) {
						return false
					}
					task.subtasks = task.subtasks
						? removeTaskRecursively(task.subtasks, taskId)
						: []
					return true
				})
			}

			state.tasks = removeTaskRecursively(state.tasks, action.payload.taskId)
		},
		updateTaskName(
			state,
			action: PayloadAction<{ id: string; title: string }>,
		) {
			const updateTaskNameRecursively = (
				tasks: TaskInterface[],
				taskId: string,
				newTitle: string,
			) => {
				for (let task of tasks) {
					if (task.id === taskId) {
						task.title = newTitle
						return
					}
					if (task.subtasks) {
						updateTaskNameRecursively(task.subtasks, taskId, newTitle)
					}
				}
			}

			if (state.tasks) {
				updateTaskNameRecursively(
					state.tasks,
					action.payload.id,
					action.payload.title,
				)
			}
		},
		updateTasks(state, action: PayloadAction<TaskInterface[]>) {
			state.tasks = action.payload
		},
		addSubtask(
			state,
			action: PayloadAction<{ parentId: string; subtask: TaskInterface }>,
		) {
			const addSubtaskRecursively = (
				tasks: TaskInterface[],
				parentId: string,
				subtask: TaskInterface,
			) => {
				for (let task of tasks) {
					if (task.id === parentId) {
						if (!task.subtasks) {
							task.subtasks = [] // Initialize subtasks if undefined
						}
						task.subtasks.push(subtask)
						return
					}
					if (task.subtasks) {
						addSubtaskRecursively(task.subtasks, parentId, subtask)
					}
				}
			}

			if (state.tasks) {
				addSubtaskRecursively(
					state.tasks,
					action.payload.parentId,
					action.payload.subtask,
				)
			}
		},
		updateSubtasks(
			state,
			action: PayloadAction<{ parentId: string; subtasks: TaskInterface[] }>,
		) {
			const updateSubtasksRecursively = (
				tasks: TaskInterface[],
				parentId: string,
				newSubtasks: TaskInterface[],
			) => {
				for (let task of tasks) {
					if (task.id === parentId) {
						task.subtasks = newSubtasks
						return
					}
					if (task.subtasks) {
						updateSubtasksRecursively(task.subtasks, parentId, newSubtasks)
					}
				}
			}

			if (state.tasks) {
				updateSubtasksRecursively(
					state.tasks,
					action.payload.parentId,
					action.payload.subtasks,
				)
			}
		},
	},
})

const { actions, reducer } = boardSlice

export const {
	addTask,
	removeTask,
	updateTaskName,
	updateTasks,
	addSubtask,
	updateSubtasks,
} = actions

export default reducer
