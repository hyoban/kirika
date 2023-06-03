import { Client } from "@notionhq/client"
import {
	BlockObjectRequest,
	PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints"
import { markdownToBlocks } from "@tryfabric/martian"
import { Note, NotesWithAttachments } from "../common/types"

export async function syncNotesWithNotion(
	notesWithAttachments: NotesWithAttachments,
	notionToken: string,
	notionDatabaseId: string
) {
	const notion = new Client({
		auth: notionToken,
	})

	// check database properties
	await prepareDatabaseProperties(notion, notionDatabaseId)

	// retrieve all pages in the database
	const pages = await notion.databases.query({
		database_id: notionDatabaseId,
	})

	// filter out notes that are already in notion
	const notesToCreate = notesWithAttachments.notes.filter(
		(note) => !isNoteInNotion(note, pages.results as PageObjectResponse[])
	)

	const notesToUpdate = notesWithAttachments.notes.filter((note) => {
		const page = findNotePageInNotion(
			pages.results as PageObjectResponse[],
			note
		)
		if (!page) {
			return false
		}

		return isNoteNeedsUpdate(note, page)
	})

	// create pages for notes that are not in notion
	await Promise.all(
		notesToCreate.map(async (note) => {
			await createPage(note, notion, notionDatabaseId)
		})
	)

	// update pages for notes that are already in notion
	await Promise.all(
		notesToUpdate.map(async (note) => {
			// find the page
			const page = findNotePageInNotion(
				pages.results as PageObjectResponse[],
				note
			)

			if (!page) {
				return
			}

			const pageId = page.id
			// delete page
			await notion.pages.update({
				page_id: pageId,
				archived: true,
			})

			// create page
			await createPage(note, notion, notionDatabaseId)
		})
	)
}

function findNotePageInNotion(pages: PageObjectResponse[], note: Note) {
	return pages.find((page) => {
		const name = (page as PageObjectResponse).properties["Note Id"]
		if (name.type === "number") {
			return name.number === Number(note.id)
		}
		return false
	})
}

async function prepareDatabaseProperties(
	notion: Client,
	notionDatabaseId: string
) {
	const database = await notion.databases.retrieve({
		database_id: notionDatabaseId,
	})

	// check if the database has the correct properties
	if (
		!database.properties["Note Id"] ||
		database.properties["Note Id"].type !== "number"
	) {
		// update the database properties
		await notion.databases.update({
			database_id: notionDatabaseId,
			properties: {
				"Note Id": {
					type: "number",
					number: {},
				},
			},
		})
	}
	if (
		!database.properties["Note Created At"] ||
		database.properties["Note Created At"].type !== "date"
	) {
		// update the database properties
		await notion.databases.update({
			database_id: notionDatabaseId,
			properties: {
				"Note Created At": {
					type: "date",
					date: {},
				},
			},
		})
	}
	if (
		!database.properties["Note Updated At"] ||
		database.properties["Note Updated At"].type !== "date"
	) {
		// update the database properties
		await notion.databases.update({
			database_id: notionDatabaseId,
			properties: {
				"Note Updated At": {
					type: "date",
					date: {},
				},
			},
		})
	}
}

async function createPage(
	note: Note,
	notion: Client,
	notionDatabaseId: string
) {
	const contentBlocks = markdownToBlocks(note.content)
	await notion.pages.create({
		parent: {
			database_id: notionDatabaseId,
		},
		properties: {
			"Note Id": {
				type: "number",
				number: Number(note.id),
			},
			"Note Created At": {
				type: "date",
				date: {
					start: new Date(Number(note.metadata.createdAt)).toISOString(),
				},
			},
			"Note Updated At": {
				type: "date",
				date: {
					start: new Date(Number(note.metadata.updatedAt)).toISOString(),
				},
			},
			title: {
				type: "title",
				title: [
					{
						type: "text",
						text: {
							content: note.title || "",
						},
					},
				],
			},
		},
		children: [
			...(contentBlocks as BlockObjectRequest[]),
			...(note.attachments.map((attachment) => {
				if (typeof attachment !== "string") {
					if (attachment.markdown.startsWith("!")) {
						return {
							object: "block",
							type: "image",
							image: {
								type: "external",
								external: {
									url: attachment.url,
								},
							},
						}
					}
					return {
						object: "block",
						type: "embed",
						embed: {
							url: attachment.url,
						},
					}
				} else {
					return {
						object: "block",
						type: "paragraph",
						paragraph: {
							rich_text: [],
						},
					}
				}
			}) as BlockObjectRequest[]),
		],
	})
}

function isNoteInNotion(note: Note, pages: PageObjectResponse[]): boolean {
	return pages.some((page) => {
		const name = page.properties["Note Id"]
		if (name.type === "number") {
			return name.number === Number(note.id)
		}
		return false
	})
}

function isNoteNeedsUpdate(note: Note, page: PageObjectResponse): boolean {
	// like "2023-02-24T21:06:00.000Z"
	const notionEditedTime = page.last_edited_time
	const notionEditedTimestamp = new Date(notionEditedTime).getTime()
	const noteUpdatedTimestamp = Number(note.metadata.updatedAt)

	// 10 seconds difference
	return noteUpdatedTimestamp > notionEditedTimestamp + 100000
}
