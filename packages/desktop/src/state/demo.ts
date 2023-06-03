import { Album, Photo } from "@/type"
import { atom, useAtomValue } from "jotai"
import useSWR from "swr"

const prefixUrl = "https://jsonplaceholder.typicode.com"
const fetcher = <T>(url: string) =>
	fetch(prefixUrl + url).then((res) => res.json() as Promise<T>)

const idAtom = atom(1)

export const incAndDecAtom = atom(
	(get) => get(idAtom),
	(_get, set, action: "inc" | "dec") => {
		set(idAtom, (pre) => (action === "inc" ? pre + 1 : pre - 1))
	}
)

export function useAlbum() {
	const id = useAtomValue(idAtom)
	return useSWR(["albums", id], ([, id]) => fetcher<Album>(`/albums/${id}`))
}

export function usePhotos() {
	const id = useAtomValue(idAtom)
	return useSWR(["photos", id], ([, id]) =>
		fetcher<Photo[]>(`/albums/${id}/photos`)
	)
}
