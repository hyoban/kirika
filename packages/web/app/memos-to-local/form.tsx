"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { OPEN_API_SCHEMA, WITH_FRONT_MATTER_SCHEMA } from "@/lib/convert"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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

const formSchema = z.object({
	openAPI: OPEN_API_SCHEMA,
	withFrontMatter: WITH_FRONT_MATTER_SCHEMA,
})

export default function MemosToLocalForm({
	className,
}: {
	className?: string
}) {
	const [isConverting, setIsConverting] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			openAPI: "",
			withFrontMatter: false,
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		setIsConverting(true)
		fetch(
			`/api?from=memos&to=local&openAPI=${encodeURIComponent(
				values.openAPI
			)}&withFrontMatter=${values.withFrontMatter}`,
			{
				method: "POST",
			}
		)
			.then((res) => {
				return res.blob()
			})
			.then((blob) => {
				const url = window.URL.createObjectURL(blob)
				const a = document.createElement("a")
				a.href = url
				a.download = "memos.zip"
				a.click()
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
					name="withFrontMatter"
					render={({ field }) => (
						<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<div className="space-y-1 leading-none">
								<FormLabel>Include Front Matter</FormLabel>
								<FormDescription>
									Include front matter in the converted markdown files.
								</FormDescription>
							</div>
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
