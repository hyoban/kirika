import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

export default function Selection() {
	return (
		<div className="mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			<Link href="/local-to-memos" className="max-w-xs">
				<Card>
					<CardHeader>
						<CardTitle>Local -{">"} Memos</CardTitle>
					</CardHeader>
					<CardContent>Import your local markdown files to Memos.</CardContent>
					<CardFooter>
						<p>1. Zip file with markdown files</p>
						<p>2. OpenAPI</p>
					</CardFooter>
				</Card>
			</Link>
			<Link href="/memos-to-local" className="max-w-xs">
				<Card>
					<CardHeader>
						<CardTitle>Memos -{">"} Local</CardTitle>
					</CardHeader>
					<CardContent>
						Download your memos and resources as a zip file.
					</CardContent>
					<CardFooter>1. OpenAPI</CardFooter>
				</Card>
			</Link>
			<Link href="/memos-to-notion" className="max-w-xs">
				<Card>
					<CardHeader>
						<CardTitle>Memos -{">"} Notion</CardTitle>
					</CardHeader>
					<CardContent>Sync your Memos to Notion Database.</CardContent>
					<CardFooter>
						<p>1. OpenAPI</p>
						<p>2. Notion Token</p>
						<p>3. Notion Database ID</p>
					</CardFooter>
				</Card>
			</Link>
			<Link href="/google-keep-to-memos" className="max-w-xs">
				<Card>
					<CardHeader>
						<CardTitle>Google Keep -{">"} Memos</CardTitle>
					</CardHeader>
					<CardContent>Import your Google Keep notes to Memos.</CardContent>
					<CardFooter>
						<p>1. Google Keep Takeout</p>
						<p>2. OpenAPI</p>
					</CardFooter>
				</Card>
			</Link>
		</div>
	)
}
