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
import { useDark } from "@/hooks"
import { cn } from "@/lib/utils"
import { OPEN_API_SCHEMA } from "@/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Toaster, toast } from "sonner"
import * as z from "zod"

const formSchema = z.object({
	openAPI: OPEN_API_SCHEMA,
	fileName: z
		.string()
		.refine((val) => val.endsWith(".zip"), 'File name must end with ".zip".'),
})

export default function GoogleKeepToMemosForm({
	className,
}: {
	className?: string
}) {
	const uploadRef = useRef<HTMLInputElement>(null)
	const [isConverting, setIsConverting] = useState(false)
	const [isDark] = useDark()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			openAPI: "",
			fileName: "",
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		setIsConverting(true)

		const file = uploadRef.current?.files?.[0]

		if (!file) {
			toast.error("Please select a file.")
			return
		}

		window.electronAPI.onConvertProgressUpdate((progress) => {
			if (progress.type === "success") {
				setIsConverting(false)
				toast.success(progress.message)
			} else if (progress.type === "error") {
				setIsConverting(false)
				toast.error(progress.message)
			} else {
				toast(progress.message)
			}
		})

		void window.electronAPI.convert({
			from: "google-keep",
			to: "memos",
			openAPI: values.openAPI,
			localFilePath: file.path,
		})
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn("space-y-4", className)}
			>
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
									className="underline"
								>
									Google Takeout
								</a>
								.
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

				<Button type="submit" disabled={isConverting}>
					Convert
				</Button>
			</form>
			<Toaster closeButton theme={isDark ? "dark" : "light"} />
		</Form>
	)
}
