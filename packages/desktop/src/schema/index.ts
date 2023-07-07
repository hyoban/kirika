import { z } from "zod"

export const OPEN_API_SCHEMA = z
	.string()
	.url()
	.regex(/^(http|https):\/\/.*\/api\/v1\/memo\?openId=[a-zA-Z0-9]*/, {
		message: "OpenAPI url is invalid",
	})

export type OpenAPI = z.infer<typeof OPEN_API_SCHEMA>
