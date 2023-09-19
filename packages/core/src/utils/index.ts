import { Attachment, Note } from "../common/types"
import { Authorization, createFetch } from "../memos/auth"

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

export async function getAttachmentContent(
	resource: Attachment,
	auth?: Authorization
) {
	if (resource.content) {
		return resource.content
	}
	if (resource.url) {
		const $fetch = createFetch(auth, { overridePath: true })
		const response = await $fetch(resource.url)
		return await response.arrayBuffer()
	}
	return null
}

export function getValidFileName(filename: string): string {
	return filename.replace(/[/\\?%*:|"<>]/g, "-")
}
