import { detectFood } from "../services/llmService.mjs";
import { drawBorders } from "../services/imgService.mjs";

export async function processImg(imageData) {
    // Image data should contain base64 img string and the image type
	const base64Image = imageData.image;
	const type = imageData.type;

    // Detects objects using Claude - returns JSON object
    console.log("Detecting Objects ...")
    const detectedFood = await detectFood(imageData);
    console.log(detectedFood);
    const parsedData = JSON.parse(detectedFood.content[0].text);

    const foodData = parsedData["1"];
    console.log("Objects Detected:", foodData);
    
    // Draws borders around detected objects
    console.log("Drawing Objects ...")
    const proccessedBase64 = await drawBorders(base64Image, foodData);
    
    return {
        type: type,
        image: proccessedBase64,
        foodData: foodData
    }
}