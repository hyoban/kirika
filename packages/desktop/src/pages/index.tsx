import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Link } from "react-router-dom"

function Selection() {
	return (
		<div className="mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			<Link to="/google-keep-to-memos" className="max-w-xs">
				<Card className="h-full">
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

export default function Home() {
	return (
		<div className="p-4 flex flex-col gap-4 items-center justify-center">
			<Selection />
		</div>
	)
}
