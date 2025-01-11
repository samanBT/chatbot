
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the custom OpenAI client
const client = new OpenAI({
  apiKey: "tpsg-x7JT427cxVnprdeWoNjWCDpPyLUjMHX",
  baseURL: "https://api.metisai.ir/openai/v1", // Custom base URL
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { message } = body;
    console.log("message")
    console.log(message)
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Define the main prompt as a system message
    const systemPrompt = {
      role: "system",
      content: "You are an expert in the tourism industry. Users ask you to guide them through their travel."
    };

    // Add the user's message
    const userMessage = {
      role: "user",
      content: message
    };

    // Call the OpenAI API with the system prompt and user message
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemPrompt, userMessage],
      // max_tokens: 100,
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to communicate with ChatGPT', details: error.message },
      { status: 500 }
    );
  }
}
