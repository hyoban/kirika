import fetch from "node-fetch"
import { Attachment, Note } from "../common/types"

export function getNoteContent(note: Note): string {
	return (
		note.content +
		"\n" +
		(typeof note.attachments[0] !== "string"
			? note.attachments
					.map((attachment) => {
						if (typeof attachment !== "string") {
							return attachment.markdown
						}
					})
					.join("\n")
					.trim()
			: "")
	)
}

export async function getAttachmentContent(resource: Attachment) {
	if (resource.content) {
		return resource.content
	}
	if (resource.url) {
		const response = await fetch(resource.url)
		return await response.arrayBuffer()
	}
	return null
}

export function getValidFileName(filename: string): string {
	return filename.replace(/[/\\?%*:|"<>]/g, "-")
}
