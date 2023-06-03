export default function TitleBar() {
	return (
		<h1
			className="text-center border-border border-b py-2 text-sm"
			style={{
				// @ts-expect-error -webkit-app-region is not in the CSS spec
				WebkitAppRegion: "drag",
			}}
		>
			Kirika
		</h1>
	)
}
