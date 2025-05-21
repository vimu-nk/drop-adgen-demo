import { NextRequest, NextResponse } from "next/server";
import { tmpdir } from "os";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { createReadStream } from "fs";
import OpenAI, { toFile } from "openai";
import { generateAdPrompt } from "@/app/lib/generateAdPrompt";

export const runtime = "nodejs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();
		const imageFile = formData.get("image") as File;
		if (!imageFile) throw new Error("No image uploaded");

		// Determine extension & MIME type
		const mimeType = imageFile.type; // e.g., "image/jpeg"
		const extension = mimeType.split("/")[1]; // e.g., "jpeg"
		const tempFilePath = path.join(
			tmpdir(),
			`${randomUUID()}.${extension}`
		);

		// Save file
		const buffer = Buffer.from(await imageFile.arrayBuffer());
		await writeFile(tempFilePath, buffer);

		const readableFile = createReadStream(tempFilePath);
		const openAiFile = await toFile(readableFile, `input.${extension}`, {
			type: mimeType,
		});

		// Compose prompt
		const prompt = generateAdPrompt({
			platform: formData.get("platform") as string,
			tone: formData.get("tone") as string,
			targetAudience: formData.get("targetAudience") as string,
			keywords: formData.get("keywords") as string,
			additionalInstructions: formData.get("additionalInstructions") as
				| string
				| undefined,
		});

		const response = await openai.images.edit({
			model: "gpt-image-1",
			image: [openAiFile],
			prompt,
			size: formData.get("size") as string,
			quality: formData.get("quality") as "low" | "medium" | "high",
		});

		// Log token/usage details if provided
		if (response.usage) {
			console.log("OpenAI API Usage Details:", response.usage);
		} else {
			console.log("No usage details provided in the response.");
		}

		const base64 = response.data[0].b64_json;
		return NextResponse.json({ image: `data:image/png;base64,${base64}` });
	} catch (error) {
		console.error("Image generation failed:", error);
		return NextResponse.json(
			{ error: "Image generation failed", details: String(error) },
			{ status: 500 }
		);
	}
}
