type AdPromptInput = {
	platform: string;
	tone: string;
	targetAudience: string;
	keywords: string;
	additionalInstructions?: string;
};

export function generateAdPrompt({
	platform,
	tone,
	targetAudience,
	keywords,
	additionalInstructions,
}: AdPromptInput): string {
	return `
You are designing a high-quality ad image based on a user-uploaded product photo.

Context:
- Platform: ${platform}
- Tone: ${tone}
- Target Audience: ${targetAudience}
- User-Provided Keywords: ${keywords}
${
	additionalInstructions
		? `- Additional Instructions: ${additionalInstructions}`
		: ""
}

Instructions:
1. Use the uploaded product photo as the central subject. You may enhance sharpness, lighting, or clarity, but do not distort or change its shape.
2. You may use any visible text on the product image (such as logos, product names, or labels) to support your ad design.
3. Create short, engaging ad-style text overlays based on:
   - Relevant keywords from the user's input
   - Any useful or recognizable text visible in the product image
4. Only use keywords that naturally fit the product and audience. Avoid forcing irrelevant words into the ad.
5. Text should be clearly placed, readable, and must not obscure the product itself.
6. Add a complementary background that enhances the visual appeal and aligns with the ad tone for ${platform}.
7. Design the layout to match the expected look and feel of a professional ad for ${platform}, targeting ${targetAudience} with a ${tone} tone.

The final result must look like a scroll-stopping, platform-appropriate ad for a real product.
  `.trim();
}
