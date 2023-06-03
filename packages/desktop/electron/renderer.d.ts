/* eslint-disable no-unused-vars */
import { ConvertOptions, Notification } from "./main"

export interface IElectronAPI {
	convert: (options: ConvertOptions) => Promise<void>
	onConvertProgressUpdate: (
		callback: (notification: Notification) => void
	) => void
}

declare global {
	interface Window {
		electronAPI: IElectronAPI
	}
}
