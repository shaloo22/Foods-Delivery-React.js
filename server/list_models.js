import dotenv from "dotenv";

dotenv.config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Status:", response.status);
        if (data.models) {
            data.models.forEach(m => console.log(m.name));
        } else {
            console.log("No models found. Response:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}

listModels();
