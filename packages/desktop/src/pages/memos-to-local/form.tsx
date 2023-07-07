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
import { cn } from "@/lib/utils"
import { OPEN_API_SCHEMA } from "@/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

const formSchema = z.object({
	openAPI: OPEN_API_SCHEMA,
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
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		setIsConverting(true)

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
			from: "memos",
			to: "local",
			openAPI: values.openAPI,
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
		</Form>
	)
}
