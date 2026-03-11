import { GoogleGenerativeAI } from "@google/generative-ai";
import FoodData from "../data/foodData.js";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getChatResponse = async (req, res) => {
    const { message, history, role } = req.body;

    if (!message) {
        return res.status(400).json({ message: "Please provide a message" });
    }

    try {
        const isAdmin = role === 'admin';

        const systemInstruction = isAdmin
            ? `
                You are the "Admin Assistant" for Chaska Foods. 
                You help the bakery/restaurant owner (Admin) with business insights and management tasks.
                Your tone is professional, efficient, and supportive.
                
                Your responsibilities:
                1. Provide summaries of the menu and prices when asked.
                2. Help brainstorm new food ideas or promotions.
                3. Assist with internal management questions.
                
                Menu Data for Reference:
                ${JSON.stringify(FoodData, null, 2)}
                
                Guidelines:
                - Treat the user as the Boss/Admin.
                - Be concise and focus on management/business value.
                - Use professional emojis (📊 📈 🚀).
            `
            : `
                You are the AI assistant for "Chaska Foods", a friendly and professional food ordering assistant.
                
                Your responsibilities:
                1. Help customers explore the food menu.
                2. Recommend 2-3 popular food items from the menu.
                3. Provide food prices and estimated delivery times.
                4. Answer questions about menu items.

                Menu Data:
                ${JSON.stringify(FoodData, null, 2)}

                Rules:
                - Always recommend items from the menu.
                - Mention price and delivery time if available.
                - If the user asks for food that is not on the menu, politely say it is not available and suggest similar items.
                - Keep responses short, friendly, and engaging.
                - Use food emojis where appropriate (🍔 🍕 🍜 🍟).
                - Tone: Friendly and conversational.
            `;

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-002",
            systemInstruction: systemInstruction,
        });

        // Filter history: Gemini requires history to start with a 'user' message.
        let validHistory = (history || []);
        const firstUserIndex = validHistory.findIndex(item => item.role === 'user');

        if (firstUserIndex !== -1) {
            validHistory = validHistory.slice(firstUserIndex);
        } else {
            validHistory = [];
        }

        const chat = model.startChat({
            history: validHistory,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ message: text });
    } catch (error) {
        console.error("AI Chat Error Details:", error.message);
        res.status(500).json({ message: `AI Error: ${error.message}` });
    }
};

export { getChatResponse };
