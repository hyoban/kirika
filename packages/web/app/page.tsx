import { siteConfig } from "@/config/site"

import Selection from "./selection"

export default function IndexPage() {
	return (
		<section className="container flex grow flex-col gap-6 pb-8 pt-6 md:py-10">
			<div className="flex max-w-[980px] flex-col items-start gap-2">
				<h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
					{siteConfig.description}
				</h1>
			</div>

			<div className="mt-10 flex grow flex-col">
				<Selection />
			</div>
		</section>
	)
}
