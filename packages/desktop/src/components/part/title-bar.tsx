export default function TitleBar() {
	return (
		<h1
			className="text-center bg-background border-border border-b py-2 text-sm fixed left-0 right-0 top-0 w-full z-50"
			style={{
				// @ts-expect-error -webkit-app-region is not in the CSS spec
				WebkitAppRegion: "drag",
			}}
		>
			Kirika
		</h1>
	)
}
