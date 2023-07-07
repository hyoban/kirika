import fs from "fs"
import JSZip from "jszip"
import path from "path"
import { Note, NotesWithAttachments } from "../common/types"

export async function writeNotesAsZipFile(
	notesWithResource: NotesWithAttachments
) {
	const zip = new JSZip()
	const memoFolder = zip.folder("notes")
	const resourceFolder = zip.folder("resources")
	notesWithResource.notes.forEach((memo) => {
		memoFolder?.file(`${memo.id}.md`, getNoteContent(memo))
	})
	notesWithResource.files.forEach((resource) => {
		resourceFolder?.file(resource.filename, resource.content)
	})
	return zip.generateAsync({ type: "blob" })
}

export async function writeNotesToPath(
	notesWithResource: NotesWithAttachments,
	targetPath: string
) {
	const topFolder = path.join(targetPath, "exported-" + Date.now())
	await fs.promises.mkdir(topFolder)

	const notesFolder = path.join(topFolder, "notes")
	await fs.promises.mkdir(notesFolder)
	notesWithResource.notes.forEach(async (memo) => {
		await fs.promises.writeFile(
			path.join(notesFolder, `${memo.id}.md`),
			getNoteContent(memo)
		)
	})

	const resourceFolder = path.join(topFolder, "resources")
	await fs.promises.mkdir(resourceFolder)
	notesWithResource.files.forEach(async (resource) => {
		await fs.promises.writeFile(
			path.join(resourceFolder, resource.filename),
			Buffer.from(resource.content)
		)
	})
}

function getNoteContent(note: Note): string {
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
