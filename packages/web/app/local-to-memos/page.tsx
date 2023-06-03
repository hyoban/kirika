import Image from "next/image"
import LocalToMemosForm from "./form"

export default function LocalToMemos() {
	return (
		<div className="mx-auto flex flex-col gap-6 py-10">
			<div className="flex items-center gap-6 self-center">
				<div className="i-carbon-document-attachment text-5xl"></div>
				<div className="i-carbon-arrow-right text-3xl"></div>
				<Image
					src="https://usememos.com/logo.webp"
					alt="Memos Logo"
					width={50}
					height={50}
					className="rounded-full"
				/>
			</div>
			<h1 className="space-x-4 self-center text-3xl">
				<span className="font-bold">Local</span>
				<span>to</span>
				<span className="font-bold">Memos</span>
			</h1>
			<LocalToMemosForm />
		</div>
	)
}
