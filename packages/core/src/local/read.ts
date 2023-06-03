import JSZip from "jszip"
import { Note, NotesWithAttachments } from "../common/types"

export async function readNotesForZipFile(
	file: ArrayBuffer,
	filenameAsCreatedAt = false
): Promise<NotesWithAttachments> {
	const zip = await JSZip.loadAsync(file)
	const markdownFiles = Object.values(zip.files).filter(
		(file) => file.name.endsWith(".md") && !file.name.startsWith("__MACOSX")
	)

	const notes = await Promise.all(
		markdownFiles.map(async (file) => {
			const content = await file.async("string")
			const title = file.name.replace(".md", "")
			return {
				title,
				content,
				attachments: [],
				metadata: filenameAsCreatedAt
					? {
							createdAt: new Date(title).getTime(),
					  }
					: {},
			} satisfies Note
		})
	)

	return {
		notes,
		files: [],
	}
}
