import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BoardInterface, TaskInterface } from '../types'
import { customAlphabet } from 'nanoid'

export const generateTaskId = customAlphabet('1234567890', 6)

const initialState: BoardInterface | Record<string, never> = {
	tasks: [
		{
			id: generateTaskId(),
			title: 'Social Media posts for Acme',
		},
		{
			id: generateTaskId(),
			title: 'Social Media posts for Acme',
		},
		{
			id: generateTaskId(),
			title: 'Facebook Campaign',
		},
		{
			id: generateTaskId(),
			title: 'TikTok Profile Setup',
		},
	],
}

export const boardSlice = createSlice({
	name: 'board',
	initialState,
	reducers: {
		addTask(state) {
			const newTask = { id: generateTaskId(), title: 'New Task' }
			state.tasks.push(newTask)
		},
		removeTask(state, action: PayloadAction<string>) {
			state.tasks = state.tasks.filter((task) => task.id !== action.payload)
		},
		updateTaskName: (state, action) => {
			const { id, title } = action.payload
			const task = state.tasks.find((task) => task.id === id)

			if (task) {
				task.title = title
			}
		},
    updateTasks(state, action: PayloadAction<TaskInterface[]>) {
      state.tasks = action.payload;
    },
	},
})

const { actions, reducer } = boardSlice

export const { addTask, removeTask, updateTaskName, updateTasks  } = actions

export default reducer
