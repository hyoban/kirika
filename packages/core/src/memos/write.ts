import fetch from "node-fetch"
import { Attachment, NotesWithAttachments } from "../common/types"
import { Authorization, createFetch } from "./auth"

interface CreateBlobAPIResponse {
	data: BlobResponseData
}

interface BlobResponseData {
	id: number
	creatorId: number
	createdTs: number
	updatedTs: number
	filename: string
	internalPath: string
	externalLink: string
	type: string
	size: number
	publicId: string
	linkedMemoAmount: number
}

export interface CreateMemoAPIResponse {
	data: MemoResponseData
}

export interface MemoResponseData {
	id: number
	rowStatus: string
	creatorId: number
	createdTs: number
	updatedTs: number
	content: string
	visibility: string
	pinned: boolean
	creatorName: string
	resourceList: any[]
	relationList: any[]
}

async function writeResource(
	auth: Authorization,
	attachment: Attachment
): Promise<CreateBlobAPIResponse | string> {
	const $fetch = createFetch(auth)

	const postData = new FormData()
	if (!attachment.content) {
		if (attachment.url) {
			const response = await fetch(attachment.url)
			attachment.content = await response.arrayBuffer()
		} else {
			return `Failed to create resource ${attachment.filename}`
		}
	}
	postData.append(
		"file",
		new Blob([attachment.content], {
			type: attachment.mimetype,
		}),
		attachment.filename
	)

	try {
		const response = await $fetch("/api/resource/blob", {
			body: postData,
			method: "POST",
		})
		return (await response.json()) as Promise<CreateBlobAPIResponse>
	} catch (error) {
		;["Failed to create resource", attachment.filename, error].forEach((msg) =>
			console.error(msg)
		)
		return `Failed to create resource ${attachment.filename}`
	}
}

export async function writeMemosWithResources(
	auth: Authorization,
	notesWithAttachments: NotesWithAttachments
): Promise<void | string> {
	const $fetch = createFetch(auth)
	const createdResourceList: BlobResponseData[] = []
	const createdResourceJobs = notesWithAttachments.files.map(
		(attachment) => () => writeResource(auth, attachment)
	)
	while (createdResourceJobs.length) {
		// limit 20 requests per group
		const res = await Promise.all(
			createdResourceJobs.splice(0, 20).map((job) => job())
		)
		createdResourceList.push(
			...res
				.map((r) => (typeof r === "string" ? undefined : r.data))
				.filter(Boolean)
		)
	}

	for (const note of notesWithAttachments.notes.reverse()) {
		const postData = {
			content: note.content,
			visibility: "PRIVATE",
			resourceIdList: createdResourceList
				.filter((r) => {
					if (note.attachments.length === 0) {
						return false
					}

					if (typeof note.attachments[0] === "string") {
						return (note.attachments as string[]).includes(r.filename)
					}

					return false
				})
				.map((r) => r.id),
			relationList: [],
		}

		try {
			const res = await $fetch("/api/v1/memo", {
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify(postData),
				method: "POST",
			}).then((res) => res.json() as Promise<CreateMemoAPIResponse>)

			try {
				if (note.metadata.createdAt) {
					const memoId = res.data.id

					await $fetch(`/api/memo/${memoId}`, {
						headers: {
							"content-type": "application/json",
						},
						body: JSON.stringify({
							id: memoId,
							createdTs: Math.floor(note.metadata.createdAt / 1000),
						}),
						method: "PATCH",
					}).then((res) => res.json())
				}
			} catch (error) {
				console.error("Failed to set createdAt", note.content, error)
				return `Failed to set createdAt ${note.content}`
			}
		} catch (error) {
			console.error("Failed to create memo", note.content, error)
			return `Failed to create memo ${note.content}`
		}
	}
}
