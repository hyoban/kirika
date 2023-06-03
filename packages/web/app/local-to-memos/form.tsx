"use client"

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
import { useToast } from "@/components/ui/use-toast"
import { OPEN_API_SCHEMA } from "@/lib/convert"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
	openAPI: OPEN_API_SCHEMA,
	fileName: z.string().refine((val) => val.endsWith(".zip")),
	filenameAsCreatedTime: z.boolean(),
})

export default function LocalToMemosForm({
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
			filenameAsCreatedTime: false,
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		setIsConverting(true)

		// get the file
		const file = uploadRef.current?.files?.[0]

		const formData = new FormData()
		formData.append("file", file as Blob, values.fileName)

		fetch(
			`/api?from=local&to=memos&openAPI=${encodeURIComponent(
				values.openAPI
			)}&filenameAsCreatedTime=${values.filenameAsCreatedTime}`,
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
					name="fileName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Local markdown files archive</FormLabel>
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
								Zip file including markdown files.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
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
					name="filenameAsCreatedTime"
					render={({ field }) => (
						<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<div className="space-y-1 leading-none">
								<FormLabel>Use filename as created time</FormLabel>
								<FormDescription>
									Use filename as created time to update memo{"'"}s created
									time.
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
