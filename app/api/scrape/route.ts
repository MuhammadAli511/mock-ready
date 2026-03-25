import FirecrawlApp from "@mendable/firecrawl-js"
import { NextResponse } from "next/server"

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY!,
})

export async function POST(request: Request) {
  const body = await request.json()
  const { type, url, jobTitle, company, pastedText } = body

  try {
    // Direct paste — skip scraping entirely
    if (type === "paste" && pastedText) {
      return NextResponse.json({
        rawText: pastedText,
        url: "",
        title: "",
      })
    }

    if (type === "url" && url) {
      const result = await firecrawl.scrape(url, {
        formats: ["markdown"],
      })

      return NextResponse.json({
        rawText: result.markdown ?? "",
        url,
        title: result.metadata?.title ?? "",
      })
    }

    if (type === "keyword" && jobTitle) {
      const query = company
        ? `${jobTitle} ${company} job posting`
        : `${jobTitle} job posting`

      const results = await firecrawl.search(query, {
        limit: 3,
        scrapeOptions: { formats: ["markdown"] },
      })

      const webResults = results.web
      if (!webResults?.length) {
        return NextResponse.json(
          { error: "No job postings found" },
          { status: 404 },
        )
      }

      const best = webResults[0] as Record<string, unknown>

      return NextResponse.json({
        rawText: (best.markdown as string) ?? (best.description as string) ?? "",
        url: (best.url as string) ?? "",
        title: (best.title as string) ?? "",
      })
    }

    return NextResponse.json(
      { error: "Invalid input: provide a URL, job title, or paste the job description" },
      { status: 400 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    const isUnsupported = message.includes("do not support this site")
    console.error("Scrape error:", error)

    return NextResponse.json(
      {
        error: isUnsupported
          ? "This site is not supported by Firecrawl."
          : "Failed to scrape job posting.",
        code: isUnsupported ? "UNSUPPORTED_SITE" : "SCRAPE_FAILED",
      },
      { status: isUnsupported ? 422 : 500 },
    )
  }
}
