import { contextBridge, ipcRenderer } from "electron"
import { ConvertOptions } from "./main"

contextBridge.exposeInMainWorld("electronAPI", {
	convert: (options: ConvertOptions) => {
		void ipcRenderer.invoke("convert", options)
	},
	onConvertProgressUpdate: (callback: (...args: any[]) => void) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		ipcRenderer.on("convert:update", (_, ...args) => callback(...args))
	},
})
