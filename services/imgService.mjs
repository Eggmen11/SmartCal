import sharp from "sharp";

const mockData = [
	{
		element: "pancakes",
		bbox: [0.1, 0.25, 0.5, 0.75],
		confidence: 0.98,
	},
	{
		element: "butter pat",
		bbox: [0.2, 0.35, 0.25, 0.4],
		confidence: 0.95,
	},
	{
		element: "maple syrup",
		bbox: [0.15, 0.3, 0.45, 0.45],
		confidence: 0.96,
	},
	{
		element: "bacon strips",
		bbox: [0.5, 0.4, 0.65, 0.6],
		confidence: 0.97,
	},
	{
		element: "fried eggs",
		bbox: [0.65, 0.3, 0.9, 0.7],
		confidence: 0.99,
	},
];

export async function processImg(base64Image, detectedObjs) {
    detectedObjs = mockData;
	const buffer = Buffer.from(base64Image, "base64");
	const image = sharp(buffer);

	// Get metadata (dimensions)
	const metadata = await image.metadata();
	const width = metadata.width;
	const height = metadata.height;

	console.log("Detected Objects: ");
	console.log(detectedObjs);

	// Generate an overlay with rectangles
	let svgRects = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

	for (const objs of detectedObjs) {
		console.log("Coords: " + objs.bbox);

		// Scale normalized bbox values to image dimensions
		const [x1, y1, x2, y2] = [
			objs.bbox[0] * width, // x1
			objs.bbox[1] * height, // y1
			objs.bbox[2] * width, // x2
			objs.bbox[3] * height, // y2
		];

		const rectW = x2 - x1;
		const rectH = y2 - y1;

		// Log dimensions for debugging
		console.log(
			`Rectangle Dimensions: x1=${x1}, x2=${x2}, y1=${y1}, y2=${y2}, width=${rectW}, height=${rectH}`
		);

		// Skip invalid rectangles
		if (rectW <= 0 || rectH <= 0) {
			console.warn(
				`Invalid rectangle skipped: x1=${x1}, y1=${y1}, width=${rectW}, height=${rectH}`
			);
			continue;
		}

		// Add a rectangle to the SVG
		svgRects += `
            <rect x="${Math.floor(x1)}" y="${Math.floor(y1)}" 
            width="${Math.floor(rectW)}" height="${Math.floor(rectH)}" 
            fill="none" stroke="red" stroke-width="5" />`;
	}

	svgRects += `</svg>`;

	// Debug log SVG
	console.log(`SVG Content: ${svgRects}`);

	// Composite the rectangles onto the original image
	const processedImage = await image
		.composite([
			{
				input: Buffer.from(svgRects),
				top: 0,
				left: 0,
			},
		])
		.toBuffer();

	// Save the processed image
	await sharp(processedImage).toFile("output.png");

	// Return the base64 encoded image
	return processedImage.toString("base64");
}
