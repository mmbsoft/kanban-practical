export interface TaskInterface {
	id: string
	title: string
	completed: boolean
	subtasks?: TaskInterface[]
	length?: number
}

export interface BoardInterface {
	tasks: TaskInterface[]
}
