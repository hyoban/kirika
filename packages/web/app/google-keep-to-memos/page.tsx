import Image from "next/image"

import GoogleKeepToMemosForm from "./form"

export default function MemosToLocal() {
	return (
		<div className="mx-auto flex flex-col gap-6 py-10">
			<div className="flex items-center gap-6 self-center">
				<Image
					src="https://www.gstatic.com/images/branding/product/2x/keep_2020q4_48dp.png"
					alt="Memos Logo"
					width={50}
					height={50}
				/>
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
				<span className="font-bold">Google Keep</span>
				<span>to</span>
				<span className="font-bold">Memos</span>
			</h1>
			<GoogleKeepToMemosForm />
		</div>
	)
}
