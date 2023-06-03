import JSZip from "jszip"
import { NotesWithAttachments } from "../common/types"

export async function writeNotesAsZipFile(
	memosWithResource: NotesWithAttachments
) {
	const zip = new JSZip()
	const memoFolder = zip.folder("memos")
	const resourceFolder = zip.folder("resources")
	memosWithResource.notes.forEach((memo) => {
		memoFolder?.file(
			`${memo.id}.md`,
			memo.content + "\n" + typeof memo.attachments[0] !== "string"
				? memo.attachments
						.map((attachment) => {
							if (typeof attachment !== "string") {
								return attachment.markdown
							}
						})
						.join("\n")
						.trim()
				: ""
		)
	})
	memosWithResource.files.forEach((resource) => {
		resourceFolder?.file(resource.filename, resource.content)
	})
	return zip.generateAsync({ type: "blob" })
}
