import type { RequestInit } from "node-fetch"
import fetch from "node-fetch"

export type Authorization = {
	baseUrl: string
	accessToken?: string
	openId?: string
}

function mergeInit(init?: RequestInit, auth?: Authorization) {
	let finalInit: RequestInit = init || {}
	if (auth?.accessToken) {
		finalInit.headers = {
			...finalInit.headers,
			Authorization: "Bearer " + auth.accessToken,
		}
	}
	return finalInit
}

export function createFetch(
	auth?: Authorization,
	option?: {
		overridePath?: boolean
	}
) {
	if (!auth) {
		return fetch
	}

	const { overridePath } = option || {
		overridePath: false,
	}

	return async function fetchWithAuth(
		path: string,
		init?: RequestInit | undefined
	) {
		return fetch(
			overridePath
				? path
				: auth.baseUrl + path + (auth.openId ? `?openId=${auth.openId}` : ""),
			mergeInit(init, auth)
		)
	}
}
