import { detectFood } from "../services/llmService.mjs";
import { drawBorders } from "../services/imgService.mjs";

const lastElements = [];

export async function processImg(requestData) {
    // Image data should contain base64 img string and the image type
    console.log("Request Data:")
    console.log(requestData);


	const base64Image = requestData.image;
	const type = requestData.type;
    const userContext = requestData.userContext;

    console.log("User context: " + userContext);

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


    return {
        type: type,
        image: proccessedBase64,
        userContext: userContext,
        foodData: foodData
    }
}