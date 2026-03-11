import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Try explicitly setting the version in the request options
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function checkSpecificVersions() {
    const versions = ['v1', 'v1beta'];
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];

    for (const version of versions) {
        for (const modelName of models) {
            try {
                console.log(`Testing Version: ${version}, Model: ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName }, { apiVersion: version });
                const result = await model.generateContent("Hi");
                const response = await result.response;
                console.log(`✅ SUCCESS with ${version} and ${modelName}:`, response.text().substring(0, 20));
                return; // Stop if we find one that works
            } catch (error) {
                console.error(`❌ FAILED with ${version} and ${modelName}: ${error.message}`);
            }
        }
    }
}

checkSpecificVersions();