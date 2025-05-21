"use client";

import { useState } from "react";
import Image from "next/image";
import AdForm from "@/app/components/AdForm";

export default function GeneratePage() {
	const [image, setImage] = useState<string | null>(null);

	const handleDownload = () => {
		if (!image) return;
		const link = document.createElement("a");
		link.href = image;
		link.download = "generated-ad.png";
		link.click();
	};

	return (
		<main className="min-h-screen bg-slate-900 text-white py-10 px-4">
			<div className="max-w-4xl mx-auto bg-slate-800 p-8 shadow-2xl rounded-2xl">
				<h1 className="text-3xl font-bold mb-6">
					Product Ad Generator
				</h1>

				<AdForm onResult={(url) => setImage(url)} />

				{image && (
					<div className="mt-10 text-center">
						<h2 className="text-xl font-semibold mb-4">
							Generated Ad:
						</h2>
						<Image
							src={image}
							alt="Generated Ad"
							className="rounded-xl border shadow-lg mx-auto"
							width={512}
							height={512}
						/>
						<button
							onClick={handleDownload}
							className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
						>
							Download Image
						</button>
					</div>
				)}
			</div>
		</main>
	);
}
