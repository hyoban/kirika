import JSZip from "jszip"
import { Attachment, Note, NotesWithAttachments } from "../common/types"

type Keep = {
	attachments?: KeepAttachment[]
	color: string
	isTrashed: boolean
	isPinned: boolean
	isArchived: boolean
	textContent: string
	title: string
	userEditedTimestampUsec: number
	createdTimestampUsec: number
}

type KeepAttachment = {
	filePath: string
	mimetype: string
}

export async function readGoogleKeepTakeout(
	data: ArrayBuffer
): Promise<NotesWithAttachments> {
	const zip = await JSZip.loadAsync(data)

	// Takeout
	// -- archive_browser.html
	// -- Keep
	// ---- *.json
	// ---- *.html
	// ---- *.xxx

	const allFiles = Object.values(zip.files)
	const jsonFiles = allFiles.filter((file) => file.name.endsWith(".json"))
	const attachmentFiles = allFiles.filter(
		(file) => !file.name.endsWith(".json") && !file.name.endsWith(".html")
	)

	const keeps = (
		await Promise.all(jsonFiles.map((file) => file.async("text")))
	).map((json) => JSON.parse(json) as Keep)

	const notes: Note[] = keeps.map((keep) => ({
		title: keep.title,
		content: keep.textContent,
		metadata: {
			createdAt: Math.floor(keep.createdTimestampUsec / 1000),
			updatedAt: Math.floor(keep.userEditedTimestampUsec / 1000),
		},
		attachments:
			keep.attachments?.map((attachment) => attachment.filePath) ?? [],
	}))

	const files: Attachment[] = await Promise.all(
		attachmentFiles.map(async (file) => {
			const keep = keeps.find((keep) =>
				keep.attachments?.some((attachment) =>
					file.name.endsWith(attachment.filePath)
				)
			)

			const mineType = keep?.attachments?.find((attachment) =>
				file.name.endsWith(attachment.filePath)
			)?.mimetype

			return {
				filename: file.name.replace(/^Takeout\/Keep\//, ""),
				mimetype: mineType,
				content: await file.async("arraybuffer"),
			}
		})
	)

	return {
		notes: notes.sort((a, b) => {
			const aCreatedAt = Number(a.metadata.createdAt)
			const bCreatedAt = Number(b.metadata.createdAt)
			return aCreatedAt - bCreatedAt
		}),
		files,
	}
}
