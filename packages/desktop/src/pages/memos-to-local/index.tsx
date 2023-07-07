import MemosLogo from "@/images/memos.webp"
import { useNavigate } from "react-router-dom"
import MemosToLocalForm from "./form"

export default function MemosToLocal() {
	const navigate = useNavigate()
	return (
		<div className="container mx-auto space-y-10 p-10 relative">
			<button
				className="absolute top-5 left-5 border border-border rounded-full p-2"
				onClick={() => navigate(-1)}
			>
				<div className="i-carbon-arrow-left"></div>
			</button>
			<div className="grid grid-cols-3 gap-2 justify-items-center w-fit mx-auto font-bold">
				<img
					src={MemosLogo}
					alt="Memos Logo"
					width={50}
					height={50}
					className="rounded"
				/>
				<div className="i-carbon-arrow-right text-3xl"></div>
				<div className="i-carbon-document text-4xl"></div>
				<span>Memos</span>
				<span>To</span>
				<span>Local</span>
			</div>
			<MemosToLocalForm />
		</div>
	)
}
