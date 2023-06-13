import { BrowserWindow, app, ipcMain, shell } from "electron"
import { promises as fs } from "fs"
import { readGoogleKeepTakeout, writeMemosWithResources } from "kirika"
import path from "node:path"

export interface ConvertOptions {
	from: "google-keep"
	to: "memos"
	localFilePath?: string
	openAPI?: string
}

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, "../dist")
process.env.PUBLIC = app.isPackaged
	? process.env.DIST
	: path.join(process.env.DIST, "../public")

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"]

export interface Notification {
	type: "error" | "info" | "success"
	message: string
}

function sendMsg(notification: Notification) {
	win?.webContents.send("convert:update", notification)
}

function sendError(error: string) {
	sendMsg({
		type: "error",
		message: error,
	})
}

function sendSuccess(message: string) {
	sendMsg({
		type: "success",
		message,
	})
}

function sendInfo(message: string) {
	sendMsg({
		type: "info",
		message,
	})
}

async function convert(options: ConvertOptions) {
	const { from, to, openAPI, localFilePath } = options

	if (from === "google-keep" && to === "memos") {
		if (localFilePath && openAPI) {
			try {
				const zip = await fs.readFile(localFilePath)
				sendInfo(`Read file ${localFilePath.split("/").pop() ?? ""} success`)

				try {
					const memosWithResource = await readGoogleKeepTakeout(zip)
					sendInfo(
						`Read Google Keep Takeout success: ${memosWithResource.notes.length} notes, ${memosWithResource.files.length} files`
					)

					const res = await writeMemosWithResources(openAPI, memosWithResource)
					if (typeof res === "string") {
						sendError(res)
					} else {
						sendSuccess(`Write notes and files to Memos successfully`)
					}
				} catch (error) {
					sendError(`Read Google Keep Takeout failed: ${String(error)}`)
				}
			} catch (error) {
				sendError(`Read file ${localFilePath} failed: ${String(error)}`)
			}
		} else {
			sendError("Convert options is invalid, please check it")
		}
	} else {
		sendError("Convert type is not supported")
	}
}

function createWindow() {
	win = new BrowserWindow({
		width: 10000000,
		height: 10000000,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
		titleBarStyle: "hiddenInset",
	})

	if (VITE_DEV_SERVER_URL) {
		void win.loadURL(VITE_DEV_SERVER_URL)
	} else {
		// win.loadFile('dist/index.html')
		void win.loadFile(path.join(process.env.DIST, "index.html"))
	}
}

app.on("window-all-closed", () => {
	app.quit()
})

void app.whenReady().then(() => {
	ipcMain.handle("convert", async (_event, options: ConvertOptions) => {
		await convert(options)
	})
	createWindow()

	win?.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith("https:")) {
			void shell.openExternal(url)
		}
		return { action: "deny" }
	})
})
