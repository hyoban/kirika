import { createBrowserRouter } from "react-router-dom"
import Home from "./pages"
import GoogleKeepToMemos from "./pages/google-keep-to-memos"
import MemosToLocal from "./pages/memos-to-local"

const router = createBrowserRouter([
	{
		path: "/google-keep-to-memos",
		element: <GoogleKeepToMemos />,
	},
	{
		path: "/memos-to-local",
		element: <MemosToLocal />,
	},
	{
		path: "*",
		element: <Home />,
	},
])

export default router
