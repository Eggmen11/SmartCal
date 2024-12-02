import Anthropic from "@anthropic-ai/sdk";
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables


const client = new Anthropic({
	apiKey: "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", // defaults to process.env["ANTHROPIC_API_KEY"]
});

const systemPrompt = `
        You are an expert computer vision system. First describe the image in accurate details, then analyze the provided images and return ONLY a JSON object containing bounding boxes. Be super precise and try to detect as many objects as possible.
        Be accurate and try to detect as many objects as possible. Really open your eyes and see the world.

        Follow these strict rules:
        1. Output MUST be valid JSON with no eadditional text
        2. Each detected object must have:
            - 'element': descriptive name of the object
            - 'bbox': [x1, y1, x2, y2] coordinates (normalized 0-1)
            - 'confidence': confidence score (0-1)
        3. Use this exact format:
        {
            "image_number": [
                {
                "element": "object_name",
                "bbox": [x1, y1, x2, y2],
                "confidence": 0.95
                }
            ]
        }
        4. Coordinates must be precise and properly normalized
        5. DO NOT include any explanation or additional text
        """

`;

export async function getBorderedImg(imageData) {
    console.log("Loaded API Key:", process.env.ANTHROPIC_API_KEY);


	const base64Image = imageData.image;
	const type = imageData.type;
	const content = [];

	content.push({
		type: "image",
		source: {
			type: "base64",
			media_type: type,
			data: base64Image,
		},
	});

	try {
		const response = await client.messages.create({
			model: "claude-3-5-sonnet-20241022",
			max_tokens: 8000,
			system: systemPrompt,
			messages: [
				{
					role: "user",
					content: content,
				},
			],
		});
        return response;
	} catch (error) {
		console.log(error);
	}
}
