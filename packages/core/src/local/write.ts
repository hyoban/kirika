import fs from "fs"
import fetch from "node-fetch"
import path from "path"
import { NotesWithAttachments } from "../common/types"
import { getNoteContent, getValidFileName } from "../utils"

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
		const content = await fetch(resource.url)
		resource.content = await content.arrayBuffer()

		await fs.promises.writeFile(
			path.join(resourceFolder, getValidFileName(resource.filename)),
			Buffer.from(resource.content)
		)
	})
}
