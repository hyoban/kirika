import { Note } from "../common/types"

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
