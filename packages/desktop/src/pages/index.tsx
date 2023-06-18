import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Link } from "react-router-dom"

const options = [
	{
		title: "EXPORT",
		items: [
			{
				path: "/memos-to-local",
				from: "Memos",
				to: "Local",
				description: "Download your memos and resources as a zip file.",
				ingredients: ["OpenAPI"],
			},
		],
	},
	{
		title: "IMPORT",
		items: [
			{
				path: "/google-keep-to-memos",
				from: "Google Keep",
				to: "Memos",
				description: "Import your Google Keep notes to Memos.",
				ingredients: ["Google Keep Takeout", "OpenAPI"],
			},
			{
				path: "/local-to-memos",
				from: "Local",
				to: "Memos",
				description: "Import your local markdown files to Memos.",
				ingredients: ["Zip file with markdown files", "OpenAPI"],
			},
		],
	},
]

type OptionGroup = (typeof options)[number]
type Option = OptionGroup["items"][number]

function Selection({
	title,
	children,
}: {
	title?: string
	children?: React.ReactNode
}) {
	return (
		<div className="space-y-6">
			<h1 className="scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				{title}
			</h1>
			<div className="mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{children}
			</div>
		</div>
	)
}

Selection.Item = function SelectionItem({
	path,
	from,
	to,
	description,
	ingredients,
}: Option) {
	return (
		<Link to={path} className="max-w-xs">
			<Card className="h-full">
				<CardHeader>
					<CardTitle>
						{from} {"->"} {to}
					</CardTitle>
				</CardHeader>
				<CardContent>{description}</CardContent>
				<CardFooter>
					{ingredients.map((ingredient, index) => (
						<p key={index}>{`${index}. ${ingredient}`}</p>
					))}
				</CardFooter>
			</Card>
		</Link>
	)
}

export default function Home() {
	return (
		<div className="flex flex-col gap-10 items-center justify-center">
			{options.map((option, index) => (
				<Selection key={index} title={option.title}>
					{option.items.map((item, index) => (
						<Selection.Item key={index} {...item} />
					))}
				</Selection>
			))}
		</div>
	)
}
