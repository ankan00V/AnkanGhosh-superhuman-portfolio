export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    const response = await fetch(`${process.env.NVIDIA_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.NVIDIA_MODEL,
        messages: [
          {
            role: "system",
            content: "You are Bob, Ankan's AI assistant. Be professional and helpful."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const err = await response.text()
      console.error("NVIDIA API error:", err)
      return Response.json({ reply: "AI service unavailable" })
    }

    const data = await response.json()

    return Response.json({
      reply: data.choices?.[0]?.message?.content || "No response"
    })

  } catch (error) {
    console.error(error)
    return Response.json({ reply: "Error occurred" })
  }
}