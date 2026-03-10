import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
    try {
        console.log("Testing gemini-flash-latest...");
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent("hi");
        console.log("Success! Response:", result.response.text());
    } catch (err) {
        console.log("Test FAILED!");
        console.log("Error Name:", err.name);
        console.log("Error Message:", err.message);
        if (err.stack) console.log("Stack:", err.stack);
    }
}

test();
