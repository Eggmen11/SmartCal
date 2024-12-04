import { detectFood } from "../services/llmService.mjs";
import { drawBorders } from "../services/imgService.mjs";

export async function processImg(imageData) {
    // Image data should contain base64 img string and the image type
    const { base64Image, type } = imageData;

    // Detects objects using Claude - returns JSON object
    console.log("Detecting Objects ...")
    const detecteFood = await detectFood(imageData);
    const foodData = JSON.parse(detecteFood.content[0].text);
    
    // Draws borders around detected objects
    console.log("Drawing Objects ...")
    const proccessedBase64 = await drawBorders(base64Image, foodData);
    
    return {
        type: type,
        image: proccessedBase64,
        foodData: foodData
    }
}