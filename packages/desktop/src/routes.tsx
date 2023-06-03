import { createBrowserRouter } from "react-router-dom"
import Home from "./pages"
import GoogleKeepToMemos from "./pages/google-keep-to-memos"

const router = createBrowserRouter([
	{
		path: "/google-keep-to-memos",
		element: <GoogleKeepToMemos />,
	},
	{
		path: "*",
		element: <Home />,
	},
])

export default router
