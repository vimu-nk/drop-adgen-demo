"use client";

import { useState } from "react";

const platforms = ["Instagram", "Facebook", "TikTok"];
const tones = ["Enthusiastic", "Professional", "Friendly", "Urgent/FOMO"];
const audiences = [
	"Tech-savvy Millennials",
	"Budget-conscious Shoppers",
	"Trend-following Teens",
	"Fitness Enthusiasts",
	"Beauty & Skincare Lovers",
	"Parents with Young Kids",
	"Home Decor Shoppers",
	"Pet Owners",
	"Gadget Lovers",
	"Eco-conscious Consumers",
];
const sizes = {
	Square: "1024x1024",
	Landscape: "1536x1024",
	Portrait: "1024x1536",
};
const qualities = ["low", "medium", "high"];

interface Props {
	onResult: (url: string) => void;
}

export default function AdForm({ onResult }: Props) {
	const [form, setForm] = useState({
		platform: platforms[0],
		tone: tones[0],
		targetAudience: audiences[0],
		keywords: "",
		additionalInstructions: "",
		size: "1024x1024",
		quality: "medium",
	});
	const [image, setImage] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!image) return alert("Please upload an image");
		setLoading(true);

		const data = new FormData();
		Object.entries(form).forEach(([key, val]) => data.append(key, val));
		data.append("image", image);

		const res = await fetch("/generate/action", {
			method: "POST",
			body: data,
		});

		const json = await res.json();
		onResult(json.image);
		setLoading(false);
	};

	const inputStyle =
		"w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium mb-1">
						Platform
					</label>
					<select
						name="platform"
						value={form.platform}
						onChange={handleChange}
						className={inputStyle}
					>
						{platforms.map((p) => (
							<option key={p}>{p}</option>
						))}
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">
						Tone
					</label>
					<select
						name="tone"
						value={form.tone}
						onChange={handleChange}
						className={inputStyle}
					>
						{tones.map((t) => (
							<option key={t}>{t}</option>
						))}
					</select>
				</div>

				<div className="md:col-span-2">
					<label className="block text-sm font-medium mb-1">
						Target Audience
					</label>
					<select
						name="targetAudience"
						value={form.targetAudience}
						onChange={handleChange}
						className={inputStyle}
					>
						{audiences.map((a) => (
							<option key={a}>{a}</option>
						))}
					</select>
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium mb-1">
					Keywords
				</label>
				<input
					type="text"
					name="keywords"
					placeholder="e.g., premium, trending, organic"
					value={form.keywords}
					onChange={handleChange}
					className={inputStyle}
				/>
			</div>

			<div>
				<label className="block text-sm font-medium mb-1">
					Additional Instructions
				</label>
				<textarea
					name="additionalInstructions"
					value={form.additionalInstructions}
					onChange={handleChange}
					rows={3}
					className={inputStyle}
					placeholder="Optional design ideas or ad focus"
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium mb-1">
						Size
					</label>
					<select
						name="size"
						value={form.size}
						onChange={handleChange}
						className={inputStyle}
					>
						{Object.entries(sizes).map(([label, val]) => (
							<option value={val} key={label}>
								{label} ({val})
							</option>
						))}
					</select>
				</div>
				<div>
					<label className="block text-sm font-medium mb-1">
						Quality
					</label>
					<select
						name="quality"
						value={form.quality}
						onChange={handleChange}
						className={inputStyle}
					>
						{qualities.map((q) => (
							<option key={q}>{q}</option>
						))}
					</select>
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium mb-1">
					Product Image
				</label>
				<input
					type="file"
					accept="image/png, image/jpeg, image/webp"
					onChange={(e) => setImage(e.target.files?.[0] || null)}
					className="mt-1 w-full text-sm bg-slate-700 text-white file:text-white file:bg-slate-600 file:border-none file:px-4 file:py-2 file:rounded-lg"
				/>
			</div>

			<div className="pt-4">
				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
				>
					{loading ? "Generating..." : "Generate Ad"}
				</button>
			</div>
		</form>
	);
}
