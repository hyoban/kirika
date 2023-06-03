import react from "@vitejs/plugin-react-swc"
import path from "node:path"
import UnoCSS from "unocss/vite"
import { defineConfig } from "vite"
import electron from "vite-plugin-electron"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		electron([
			{
				// Main-Process entry file of the Electron App.
				entry: "electron/main.ts",
			},
			{
				entry: "electron/preload.ts",
				onstart(options) {
					// Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
					// instead of restarting the entire Electron App.
					options.reload()
				},
			},
		]),
		UnoCSS(),
	],
	resolve: {
		alias: {
			"@/": `${path.resolve(__dirname, "src")}/`,
		},
	},
})
