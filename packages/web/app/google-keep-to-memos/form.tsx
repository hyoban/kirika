"use client"

import { useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { OPEN_API_SCHEMA } from "@/lib/convert"
import { cn } from "@/lib/utils"
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

const formSchema = z.object({
	openAPI: OPEN_API_SCHEMA,
	fileName: z.string().refine((val) => val.endsWith(".zip")),
})

export default function GoogleKeepToMemosForm({
	className,
}: {
	className?: string
}) {
	const { toast } = useToast()
	const uploadRef = useRef<HTMLInputElement>(null)
	const [isConverting, setIsConverting] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			openAPI: "",
			fileName: "",
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		setIsConverting(true)

		// get the file
		const file = uploadRef.current?.files?.[0]

		const formData = new FormData()
		formData.append("file", file as Blob, values.fileName)

		fetch(
			`/api?from=google-keep&to=memos&openAPI=${encodeURIComponent(
				values.openAPI
			)}`,
			{
				method: "POST",
				body: formData,
			}
		)
			.then((res) => {
				return res.text()
			})
			.then((text) => {
				toast({
					title: text,
				})
				setIsConverting(false)
			})
	}
	return (
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
					name="fileName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Google Keep Archive</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="file"
									accept=".zip,application/zip,application/x-zip,application/x-zip-compressed"
									id="file"
									name="file"
									ref={uploadRef}
								/>
							</FormControl>
							<FormDescription>
								Download your Google Keep archive from{" "}
								<a
									href="https://takeout.google.com/settings/takeout/custom/keep"
									target="_blank"
									rel="noopener noreferrer"
								>
									Google Takeout
								</a>
								.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isConverting}>
					Convert
				</Button>
			</form>
		</Form>
	)
}
