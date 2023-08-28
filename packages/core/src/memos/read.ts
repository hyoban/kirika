import fetch from "node-fetch"
import { Attachment, Note, NotesWithAttachments } from "../common/types"

type MemoAPIResponse =
	| Memo[]
	| {
			data: Memo[]
	  }

type Memo = {
	id: number
	rowStatus: string
	creatorId: number
	createdTs: number
	updatedTs: number
	content: string
	visibility: string
	pinned: boolean
	creatorName: string
	resourceList: Resource[]
	relationList: any
}

type Resource = {
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

function getResourceUrl(resource: Resource, url: URL) {
	return (
		resource.externalLink ||
		url.origin +
			"/o/r/" +
			resource.id +
			"/" +
			resource.publicId +
			"/" +
			resource.filename
	)
}

function isResourceAImage(resource: Resource) {
	return resource.type.startsWith("image")
}

function resourceLinkInMarkdown(resource: Resource, url: URL, local = true) {
	return local
		? `${isResourceAImage(resource) ? "!" : ""}[${
				resource.filename
		  }](../resources/${resource.filename})`
		: `${isResourceAImage(resource) ? "!" : ""}[${
				resource.filename
		  }](${getResourceUrl(resource, url)})`
}

export async function readMemosFromOpenAPI(
	openAPI: string,
	withFrontMatter = false,
	withOutResources = false
): Promise<NotesWithAttachments> {
	const url = new URL(openAPI)
	const openId = url.searchParams.get("openId")
	if (!openId) {
		throw new Error("openId is not found")
	}

	const response = (await fetch(openAPI).then((res) =>
		res.json()
	)) as MemoAPIResponse
	const memos = Array.isArray(response) ? response : response.data

	const resources = memos.map((memo) => memo.resourceList).flat()
	const filetedResources = resources.filter((resource, index) => {
		const firstIndex = resources.findIndex((r) => r.id === resource.id)
		return index === firstIndex
	})

	const files: Attachment[] = await Promise.all(
		filetedResources.map(async (resource) => {
			const memoResourceUrl = `${getResourceUrl(resource, url)}${
				resource.externalLink ? "" : `?openId=${openId}`
			}`

			return {
				filename: resource.filename,
				mimetype: resource.type,
				url: memoResourceUrl,
			}
		})
	)

	const notes: Note[] = memos.map((memo) => ({
		id: String(memo.id),
		title: sliceString(memo.content.split("\n")[0], 20),
		attachments: memo.resourceList.map((resource) =>
			withOutResources
				? {
						url: getResourceUrl(resource, url),
						markdown: resourceLinkInMarkdown(resource, url, false),
				  }
				: {
						url: resource.filename,
						markdown: resourceLinkInMarkdown(resource, url),
				  }
		),
		metadata: {
			createdAt: memo.createdTs * 1000,
			updatedAt: memo.updatedTs * 1000,
			isArchived: memo.rowStatus === "ARCHIVED",
		},
		content:
			`
${
	withFrontMatter
		? `
---
date: ${new Date(memo.createdTs * 1000).toISOString()}
updated: ${new Date(memo.createdTs * 1000).toISOString()}
---
`
		: ""
}
${memo.content}
`.trim() + "\n",
	}))

	return {
		notes,
		files: withOutResources ? [] : files,
	}
}

function sliceString(str: string, length: number, ellipsis = "...") {
	return str.length > length ? str.slice(0, length) + ellipsis : str
}
