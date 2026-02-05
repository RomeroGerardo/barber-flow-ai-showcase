// Test script to verify Gemini API key
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    const apiKey = "AIzaSyA44e0-VEr-dyhTYjLUJCcBKaWaL9kbR58";

    console.log("Testing Gemini API...");
    console.log("API Key (first 10 chars):", apiKey.substring(0, 10));

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("Model initialized, sending test message...");

        const result = await model.generateContent("Hola, responde con 'OK' si funciona.");
        const response = result.response.text();

        console.log("SUCCESS! Response:", response);
    } catch (error) {
        console.error("ERROR:", error.message);
        console.error("Full error:", error);
    }
}

testGemini();
