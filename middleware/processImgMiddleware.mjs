import { detectFood } from "../services/llmService.mjs";
import { drawBorders } from "../services/imgService.mjs";


export const mockElement = [
	{
		element: "pancakes",
		bbox: [0.1, 0.25, 0.5, 0.75],
		confidence: 0.98,
	},
	{
		element: "butter pat",
		bbox: [0.2, 0.35, 0.25, 0.4],
		confidence: 0.95,
	}
]


export async function processImg(requestData) {
    // Image data should contain base64 img string and the image type
	const base64Image = requestData.image;
	const type = requestData.type;
    const userContext = requestData.userContext;

    // Detects objects using Claude - returns JSON object
    console.log("Detecting Objects ...")
    const detectedFood = await detectFood(requestData);
    //console.log(detectedFood);
    const parsedData = JSON.parse(detectedFood.content[0].text);

    const foodData = parsedData["1"];
    console.log("Objects Detected");
    
    // Draws borders around detected objects
    console.log("Drawing Borders...")
    const proccessedBase64 = await drawBorders(base64Image, foodData);
    console.log("Borders have been drawn")

    const response = {
        type: type,
        image: proccessedBase64,
        userContext: userContext,
        foodData: foodData
    }


    console.log( response );

    return {
        type: type,
        image: proccessedBase64,
        userContext: userContext,
        foodData: foodData
    }
}