export interface TaskInterface {
	length?: number
	id: string
	title: string
}

export interface BoardInterface {
	tasks: TaskInterface[]
}
