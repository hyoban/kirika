import "@unocss/reset/tailwind.css"
import "virtual:uno.css"
import "./styles/globals.css"

import "./i18n"

import App from "@/App"
import TitleBar from "@/components/part/title-bar"
import React from "react"
import ReactDOM from "react-dom/client"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<>
			{/* remove this if you are not using Electron */}
			<TitleBar />
			<App />
		</>
	</React.StrictMode>
)
