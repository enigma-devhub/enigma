import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// call API
export async function POST(req: Request) {
  try {
    // check for user
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512"  } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // check for openAi Key
    if (!openai.apiKey) {
      return new NextResponse("OpenAI Api Key not Configured", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt required", { status: 400 });
    }

    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }

    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
    }

 
    const response = await openai.images.generate({
     prompt,
     n: parseInt(amount, 10),
     size: resolution,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.log("Image error", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
