export type Attachment = {
	filename: string
	url: string
	content?: ArrayBuffer
	mimetype?: string
}

export type Metadata = {
	createdAt?: number
	updatedAt?: number
} & Record<string, unknown>

export type Note = {
	id?: string
	title: string
	content: string
	/**
	 * file names of attachments or web links
	 */
	attachments:
		| string[]
		| {
				url: string
				markdown: string
		  }[]
	metadata: Metadata
}

export type NotesWithAttachments = {
	notes: Note[]
	files: Attachment[]
}
