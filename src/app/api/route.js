import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client
const client = new OpenAI({
  apiKey: "tpsg-x7JT427cxVnprdeWoNjWCDpPyLUjMHX",
  baseURL: "https://api.metisai.ir/openai/v1", // Custom base URL
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const systemPrompt = {
      role: "system",
      content: "You are an expert in the tourism industry. Users ask you to guide them through their travel."
    };

    const userMessage = {
      role: "user",
      content: message
    };

    // Streaming response
    const stream = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemPrompt, userMessage],
      stream: true,
    });

    return new Response(
      new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            controller.enqueue(new TextEncoder().encode(content));
          }
          controller.close();
        },
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to communicate with ChatGPT', details: error.message },
      { status: 500 }
    );
  }
}
