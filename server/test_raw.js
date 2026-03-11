import dotenv from "dotenv";

dotenv.config();

async function testRawFetch() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    console.log("Testing API Key:", apiKey.substring(0, 5) + "..." + apiKey.substring(apiKey.length - 5));

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: "Explain AI in 10 words." }]
                }]
            })
        });

        const data = await response.json();
        console.log("Raw Response Status:", response.status);
        console.log("Raw Response Body:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Fetch Error:", error.message);
    }
}

testRawFetch();
