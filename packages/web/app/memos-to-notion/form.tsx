"use client"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import {
	NOTION_DATABASE_ID_SCHEMA,
	NOTION_TOKEN_SCHEMA,
	OPEN_API_SCHEMA,
} from "@/lib/convert"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
	openAPI: OPEN_API_SCHEMA,
	notionToken: NOTION_TOKEN_SCHEMA,
	notionDatabaseId: NOTION_DATABASE_ID_SCHEMA,
})

export default function MemosToNotionForm({
	className,
}: {
	className?: string
}) {
	const { toast } = useToast()
	const [curlCode, setCurlCode] = useState("")
	const [isConverting, setIsConverting] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			openAPI: "",
			notionToken: "",
			notionDatabaseId: "",
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		setIsConverting(true)
		setCurlCode("")
		const host = window.location.origin
		const url = `/api?from=memos&to=notion&openAPI=${encodeURIComponent(
			values.openAPI
		)}&notionToken=${encodeURIComponent(
			values.notionToken
		)}&notionDatabaseId=${encodeURIComponent(values.notionDatabaseId)}`
		fetch(url, {
			method: "POST",
		})
			.then((res) => {
				return res.text()
			})
			.then((text) => {
				toast({
					title: text,
				})
				setIsConverting(false)
				setCurlCode(`curl -X 'POST' '${host + url}'`)
			})
	}
	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={cn("space-y-8", className)}
				>
					<FormField
						control={form.control}
						name="openAPI"
						render={({ field }) => (
							<FormItem>
								<FormLabel>OpenAPI</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormDescription>Find in your Memos settings.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="notionToken"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Notion Token</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormDescription>
									Find in your{" "}
									<a
										href="https://www.notion.so/my-integrations"
										target="_blank"
										rel="noopener noreferrer"
										className="underline"
									>
										Notion Integrations
									</a>
									.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="notionDatabaseId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Notion Database ID</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormDescription>Find in your Notion Page URL.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" disabled={isConverting}>
						Convert
					</Button>
				</form>
			</Form>
			{curlCode && (
				<>
					<pre className="bg-secondary max-w-md overflow-x-auto whitespace-pre-wrap break-all rounded-md p-4">
						{curlCode}
					</pre>
					<Button
						onClick={() => {
							navigator.clipboard.writeText(curlCode)
							toast({
								title: "Copied to clipboard",
							})
						}}
					>
						Copy
					</Button>
				</>
			)}
		</>
	)
}
