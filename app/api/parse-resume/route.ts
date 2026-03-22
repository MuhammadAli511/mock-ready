import { NextResponse } from "next/server"
import { extractText } from "unpdf"

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  try {
    let text: string

    if (file.type === "text/plain") {
      text = await file.text()
    } else if (file.name.endsWith(".pdf")) {
      const buffer = new Uint8Array(await file.arrayBuffer())
      const { text: pdfText } = await extractText(buffer)
      text = Array.isArray(pdfText) ? pdfText.join("\n") : pdfText
    } else {
      const buffer = await file.arrayBuffer()
      const rawText = new TextDecoder("utf-8", { fatal: false }).decode(buffer)
      text = rawText
        .replace(/[^\x20-\x7E\n\r\t]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    }

    if (!text || text.length < 20) {
      return NextResponse.json(
        { error: "Could not extract text from file. Try a .txt file instead." },
        { status: 422 },
      )
    }

    return NextResponse.json({ text: text.slice(0, 10000) })
  } catch (error) {
    console.error("Resume parse error:", error)
    return NextResponse.json(
      { error: "Failed to parse resume" },
      { status: 500 },
    )
  }
}
