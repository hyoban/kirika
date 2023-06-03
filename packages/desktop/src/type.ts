export interface Album {
	id: number
	userId: number
	title: string
}

export interface Photo {
	albumId: number
	id: number
	title: string
	url: string
	thumbnailUrl: string
}
