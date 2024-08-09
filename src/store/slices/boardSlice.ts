import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BoardInterface, TaskInterface } from '../types'
import { customAlphabet } from 'nanoid'

export const generateTaskId = customAlphabet('1234567890', 6)

const initialState: BoardInterface | Record<string, never> = {
	tasks: [
		{
			id: generateTaskId(),
			title: 'Social Media posts for Acme',
			completed: false,
			subtasks: [
				{
					id: generateTaskId(),
					title: 'Create content',
					subtasks: [],
					completed: false,
				},
				{
					id: generateTaskId(),
					title: 'Schedule posts',
					subtasks: [],
					completed: false,
				},
			],
		},
		{
			id: generateTaskId(),
			title: 'Social Media posts for Acme',
			subtasks: [],
			completed: false,
		},
		{
			id: generateTaskId(),
			title: 'Facebook Campaign',
			subtasks: [],
			completed: false,
		},
		{
			id: generateTaskId(),
			title: 'TikTok Profile Setup',
			subtasks: [],
			completed: false,
		},
	],
}

export const boardSlice = createSlice({
	name: 'board',
	initialState,
	reducers: {
		addTask(state) {
			const newTask = {
				id: generateTaskId(),
				title: 'New Task',
				subtasks: [],
				completed: false,
			}

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
				tasks: TaskInterface[] | undefined,
				parentId: string,
				subtask: TaskInterface,
			) => {
				if (!tasks) return false

				for (let task of tasks) {
					if (task.id === parentId) {
						task.subtasks?.push(subtask)
						return
					}

					addSubtaskRecursively(task.subtasks, parentId, subtask)
				}
			}

			addSubtaskRecursively(
				state.tasks,
				action.payload.parentId,
				action.payload.subtask,
			)
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
		markTaskCompleted(
			state,
			action: PayloadAction<{ parentId?: string; taskId: string }>,
		) {
			const markTaskRecursively = (
				tasks: TaskInterface[] | undefined,
				taskId: string,
			): TaskInterface[] => {
				if (!tasks) return []

				return tasks.map((task) => {
					if (task.id === taskId) {
						task.completed = !task.completed
					}

					if (task.subtasks) {
						task.subtasks = markTaskRecursively(task.subtasks, taskId)
					}

					return task
				})
			}

			if (action.payload.parentId) {
				const parentTask = state.tasks.find(
					(task) => task.id === action.payload.parentId,
				)

				if (parentTask) {
					parentTask.subtasks = markTaskRecursively(
						parentTask.subtasks,
						action.payload.taskId,
					)
				}
			} else {
				state.tasks = markTaskRecursively(state.tasks, action.payload.taskId)
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
	markTaskCompleted,
} = actions

export default reducer
