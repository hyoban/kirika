import AppearanceSwitch from "@/components/part/appearance-switch"
import { useDark } from "@/hooks"
import router from "@/routes"
import { RouterProvider } from "react-router-dom"
import { Toaster } from "sonner"

export default function App() {
	const [isDark] = useDark()

	return (
		<>
			<div className="p-20">
				<RouterProvider router={router} />
			</div>
			<footer className="flex gap-4 justify-center pb-6">
				<AppearanceSwitch />
			</footer>
			<Toaster closeButton theme={isDark ? "dark" : "light"} />
		</>
	)
}
