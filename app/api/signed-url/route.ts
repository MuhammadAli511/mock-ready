import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js"
import { NextResponse } from "next/server"

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!,
})

export async function GET() {
  const agentId = process.env.ELEVENLABS_AGENT_ID
  if (!agentId) {
    return NextResponse.json(
      { error: "ELEVENLABS_AGENT_ID is not configured" },
      { status: 500 },
    )
  }

  try {
    const response =
      await elevenlabs.conversationalAi.conversations.getSignedUrl({
        agentId,
      })
    return NextResponse.json({ signedUrl: response.signedUrl })
  } catch (error) {
    console.error("Signed URL error:", error)
    return NextResponse.json(
      { error: "Failed to generate signed URL" },
      { status: 500 },
    )
  }
}
