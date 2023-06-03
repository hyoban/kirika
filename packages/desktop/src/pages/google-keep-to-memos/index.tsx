import GoogleKeepLogo from "@/images/google-keep.png"
import MemosLogo from "@/images/memos.webp"
import { useNavigate } from "react-router-dom"
import GoogleKeepToMemosForm from "./form"

export default function GoogleKeepToMemos() {
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
					src={GoogleKeepLogo}
					alt="Google Keep Logo"
					width={50}
					height={50}
				/>
				<div className="i-carbon-arrow-right text-3xl"></div>
				<img
					src={MemosLogo}
					alt="Memos Logo"
					width={50}
					height={50}
					className="rounded"
				/>
				<span>Google Keep</span>
				<span>To</span>
				<span>Memos</span>
			</div>
			<GoogleKeepToMemosForm />
		</div>
	)
}
