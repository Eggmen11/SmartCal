import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables

const client = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY, // Fetch from .env
});

console.log("Anthropic API Key Loaded:", process.env.ANTHROPIC_API_KEY ? "✅" : "❌ Missing API Key");

const systemPrompt = `
        You are an expert computer vision system for food and calorie estimations. First describe the image in accurate details, then analyze the provided images and return ONLY a JSON object containing bounding boxes. Be super precise and try to detect consumalbe objects. Internally think estimate the weight or counte the number of items if applicable than precisely estimate callories.
        Be accurate and try to detect as many consumable objects as possible. But do not contain any elemnt twice. Really open your eyes and see the world.
		User may have provided additional context if you see previous food data that means is recalculating the cals so take that into account.

        Follow these strict rules:
        1. Output MUST be valid JSON with no eadditional text
        2. Each detected object must have:
            - 'element': descriptive name of the object
			- 'estimated_cals': the most accurate estimate of the number of cals the consumable has, only one number NOT a rage
            - 'bbox': [x1, y1, x2, y2] coordinates (normalized 0-1)
            - 'confidence': confidence score (0-1)
        3. Use this exact format:
        {
            "image_number": [
                {
                "element": "object_name",
				"estimated_cals": 100,
                "bbox": [x1, y1, x2, y2],
                "confidence": 0.95
                }
            ]
        }
        4. Coordinates must be precise and properly normalized
        5. DO NOT UNDER ANY CIRCUMSTANCES include any explanation, description or additional text outside of the JSON
        """

`;

export async function detectFood(requestData, mock = false) {
	const type = requestData.type;
	const base64Image = requestData.image;
	const content = [];
	const additionalContext = [];

	if (requestData.prevFoodData) {
		content.push({
			type: "text",
			text: JSON.stringify(requestData.prevFoodData),
		});
	}

	if (requestData.userContext) {
		content.push({
			type: "text",
			text: requestData.userContext,
		});
	}

	//console.log(base64Image);
	// console.log(type);

	content.push({
		type: "image",
		source: {
			type: "base64",
			media_type: type,
			data: base64Image,
		},
	});

	try {
		console.log("Generating LLm response...");
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
		//console.log(response.content[0].text);
		//const parsedObj = JSON.parse(response.content[0].text);
		//console.log(parsedObj["1"][0]["bbox"]);

		//const processedImg = await processImg(base64Image, parsedObj["1"]);
		//console.log(processedImg);

		return response;
	} catch (error) {
		console.log(error);
	}
}
