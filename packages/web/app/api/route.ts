import {
	readGoogleKeepTakeout,
	readMemosFromOpenAPI,
	readNotesForZipFile,
	syncNotesWithNotion,
	writeMemosWithResources,
	writeNotesAsZipFile,
} from "kirika"

export async function POST(request: Request) {
	const { searchParams } = new URL(request.url)
	const from = searchParams.get("from")
	const to = searchParams.get("to")

	if (from === "local" && to === "memos") {
		try {
			const openAPI = searchParams.get("openAPI") as string
			const filenameAsCreatedTime =
				searchParams.get("filenameAsCreatedTime") === "true"
			const zip = await request.arrayBuffer()
			const notes = await readNotesForZipFile(zip, filenameAsCreatedTime)
			await writeMemosWithResources(openAPI, notes)
			return new Response("Your notes are imported", { status: 200 })
		} catch (error) {
			console.error(error)
			return new Response("Failed to convert", { status: 500 })
		}
	} else if (from === "memos" && to === "local") {
		try {
			const OpenAPI = searchParams.get("openAPI") as string
			const WithFrontMatter = searchParams.get("withFrontMatter") === "true"
			const memos = await readMemosFromOpenAPI(OpenAPI, WithFrontMatter)
			const zip = await writeNotesAsZipFile(memos)
			return new Response(zip, {
				headers: {
					"Content-Type": "application/zip",
					"Content-Disposition": `attachment; filename="memos.zip"`,
				},
			})
		} catch (error) {
			console.error(error)
			return new Response("Failed to convert", { status: 500 })
		}
	} else if (from === "google-keep" && to === "memos") {
		try {
			const openAPI = searchParams.get("openAPI") as string
			// read google keep takeout zip from request body
			const zip = await request.arrayBuffer()
			const memosWithResource = await readGoogleKeepTakeout(zip)
			await writeMemosWithResources(openAPI, memosWithResource)
			return new Response("Your Google Keep notes are imported", {
				status: 200,
			})
		} catch (error) {
			console.error(error)
			return new Response("Failed to convert", { status: 500 })
		}
	} else if (from === "memos" && to === "notion") {
		try {
			const openAPI = searchParams.get("openAPI") as string
			const notionToken = searchParams.get("notionToken") as string
			const notionDatabaseId = searchParams.get("notionDatabaseId") as string
			const memosWithResource = await readMemosFromOpenAPI(openAPI, false, true)
			await syncNotesWithNotion(
				memosWithResource,
				notionToken,
				notionDatabaseId
			)
			return new Response("Your memos are synced with Notion", { status: 200 })
		} catch (error) {
			console.error(error)
			return new Response("Failed to convert", { status: 500 })
		}
	}
	return new Response("Unsupported conversion", { status: 400 })
}
