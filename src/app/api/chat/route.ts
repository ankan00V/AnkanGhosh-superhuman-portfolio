import { NextResponse } from "next/server"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}


const NVIDIA_TIMEOUT_MS = 20000
const OPENAI_TIMEOUT_MS = 15000
const OPENROUTER_TIMEOUT_MS = 22000
const XAI_TIMEOUT_MS = 10000
const RESPONSE_MAX_TOKENS = 260
const MAX_KEYS_PER_PROVIDER = 3
const XAI_TOTAL_ATTEMPTS = 1
const OPENAI_TOTAL_ATTEMPTS = 1
const OPENROUTER_TOTAL_ATTEMPTS = 1
const CHAT_COMPLETION_MAX_WAIT_MS = 45000
const KEY_COOLDOWN_MS = 60000
const UNUSABLE_KEY_COOLDOWN_MS = 1000 * 60 * 10
const RETRYABLE_STATUS_CODES = new Set([408, 409, 425, 429, 500, 502, 503, 504, 520, 522, 524])
const AUTH_OR_CREDIT_STATUS_CODES = new Set([401, 402, 403, 404])
function resolveOpenAiApiKeys() {
  const primaryKey = process.env.OPENAI_API_KEY?.trim() ?? ""
  const fallbackKeys = (process.env.OPENAI_API_KEYS ?? "")
    .split(/[,\n]/)
    .map((key) => key.trim())
    .filter((key) => key.length > 0)

  const allKeys = [primaryKey, ...fallbackKeys].filter((key) => key.length > 0)

  return [...new Set(allKeys)]
}

function resolveNvidiaApiKeys() {
  const primaryKey = process.env.NVIDIA_API_KEY?.trim() ?? ""
  const fallbackKeys = (process.env.NVIDIA_API_KEYS ?? "")
    .split(/[,\n]/)
    .map((key) => key.trim())
    .filter((key) => key.length > 0)

  const allKeys = [primaryKey, ...fallbackKeys].filter((key) => key.length > 0)

  return [...new Set(allKeys)]
}

function resolveXaiApiKeys() {
  const primaryKey = process.env.XAI_API_KEY?.trim() ?? ""
  const fallbackKeys = (process.env.XAI_API_KEYS ?? "")
    .split(/[,\n]/)
    .map((key) => key.trim())
    .filter((key) => key.length > 0)

  const allKeys = [primaryKey, ...fallbackKeys].filter((key) => key.length > 0)

  return [...new Set(allKeys)]
}

function resolveOpenRouterApiKeys() {
  const primaryKey = process.env.OPENROUTER_API_KEY?.trim() ?? ""
  const fallbackKeys = (process.env.OPENROUTER_API_KEYS ?? "")
    .split(/[,\n]/)
    .map((key) => key.trim())
    .filter((key) => key.length > 0)

  const allKeys = [primaryKey, ...fallbackKeys].filter((key) => key.length > 0)

  return [...new Set(allKeys)]
}

const FALLBACK_REPLY =
  "I might not have the perfect answer for that, but you can connect directly with Ankan — he’d be happy to help."

const recruiterSignals = [
  "recruiter",
  "hiring",
  "hire",
  "talent",
  "company",
  "opportunity",
  "opening",
  "position",
  "role",
  "hr",
  "interview",
]

function hasSignal(text: string, signals: string[]) {
  return signals.some((signal) => text.includes(signal))
}

function isRecruiterReply(text: string) {
  const lower = text.toLowerCase()
  return hasSignal(lower, recruiterSignals) || /\b(i\s*am|we\s*are)\s+(hiring|recruiting)\b/.test(lower)
}

function hasSoftRecruiterSignal(text: string) {
  const lower = text.toLowerCase()
  return /\b(hiring|role|opportunity|recruiter|recruiting|opening|position)\b/.test(lower)
}

function hasCompanyInfo(text: string) {
  const lower = text.toLowerCase()
  if (/\b(my company is|company name is|work at|working at|representing|from|at)\b\s+(?:(?:an?|the)\s+)?(?:(?:startup|company|firm|organization)\s+)?(?:(?:called|named)\s+)?[a-z0-9][a-z0-9&.,\-\s]{1,48}\b/.test(lower)) return true
  if (/(^|\s)(google|microsoft|amazon|meta|apple|netflix|uber|adobe|oracle|ibm|accenture|tcs|infosys|wipro|deloitte|kpmg|pwc|mckinsey)(\s|$)/.test(lower)) return true
  return false
}

function hasRoleInfo(text: string) {
  const lower = text.toLowerCase()
  if (/\b(role|position|opening|opportunity|job|vacancy)\b/.test(lower)) return true
  return /\b(sde|engineer|developer|scientist|analyst|manager|architect|lead|consultant|intern)\b/.test(lower)
}

function hasRecruiterEmail(text: string) {
  return /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text)
}

function hasRecruiterPhone(text: string) {
  return /\+?\d[\d\s()-]{7,}\d/.test(text)
}

function getRecruiterStatus(userMessages: string[]) {
  const recentContext = userMessages.slice(-4).join(" ").toLowerCase()
  return {
    isRecruiter: isRecruiterReply(recentContext) || hasSoftRecruiterSignal(recentContext),
    hasCompany: hasCompanyInfo(recentContext),
    hasRole: hasRoleInfo(recentContext),
    hasEmail: hasRecruiterEmail(recentContext),
    hasPhone: hasRecruiterPhone(recentContext),
  }
}

const xaiKeyCooldownUntilMs = new Map<string, number>()
const nvidiaKeyCooldownUntilMs = new Map<string, number>()
const openAiKeyCooldownUntilMs = new Map<string, number>()
const openRouterKeyCooldownUntilMs = new Map<string, number>()

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isKeyInCooldown(key: string, cooldownStore: Map<string, number>, now = Date.now()) {
  const cooldownUntil = cooldownStore.get(key)
  return typeof cooldownUntil === "number" && cooldownUntil > now
}

function setKeyCooldown(key: string, cooldownStore: Map<string, number>, durationMs: number) {
  cooldownStore.set(key, Date.now() + durationMs)
}

function limitKeysForAttempt(keys: string[]) {
  return keys.slice(0, MAX_KEYS_PER_PROVIDER)
}

function extractReplyFromPayload(payload: {
  choices?: Array<{
    text?: string
    message?: {
      content?:
        | string
        | { type?: string; text?: string; content?: string }
        | Array<{ type?: string; text?: string; content?: string }>
      reasoning?: string
      refusal?: string | null
    }
  }>
}) {
  const firstChoice = payload.choices?.[0]
  const message = firstChoice?.message

  if (typeof message?.content === "string") {
    return message.content.trim()
  }

  if (message?.content && typeof message.content === "object" && !Array.isArray(message.content)) {
    if (typeof message.content.text === "string") {
      return message.content.text.trim()
    }
    if (typeof message.content.content === "string") {
      return message.content.content.trim()
    }
  }

  if (Array.isArray(message?.content)) {
    return message.content
      .map((part) => {
        if (!part || typeof part !== "object") return ""
        if (typeof part.text === "string") return part.text.trim()
        if (typeof part.content === "string") return part.content.trim()
        return ""
      })
      .filter(Boolean)
      .join("\n")
      .trim()
  }

  if (typeof firstChoice?.text === "string" && firstChoice.text.trim().length > 0) {
    return firstChoice.text.trim()
  }

  if (typeof message?.reasoning === "string" && message.reasoning.trim().length > 0) {
    return message.reasoning.trim()
  }

  if (typeof message?.refusal === "string" && message.refusal.trim().length > 0) {
    return message.refusal.trim()
  }

  return ""
}

async function requestXaiChatCompletion({
  apiKey,
  model,
  messages,
  maxAttempts,
}: {
  apiKey: string
  model: string
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
  maxAttempts: number
}) {
  let lastErrorMessage = "Unable to generate response"
  let lastStatusCode: number | null = null

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const controller = new AbortController()
    const xaiTimeout = setTimeout(() => controller.abort(), XAI_TIMEOUT_MS)

    try {
      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.4,
          max_tokens: 450,
          messages,
        }),
        signal: controller.signal,
      })

      const rawText = await response.text()
      let payload: {
        error?: { message?: string }
        choices?: Array<{
          text?: string
          message?: {
            content?:
              | string
              | { type?: string; text?: string; content?: string }
              | Array<{ type?: string; text?: string; content?: string }>
            reasoning?: string
            refusal?: string | null
          }
        }>
      } = {}

      if (rawText.trim().length > 0) {
        try {
          payload = JSON.parse(rawText) as {
            error?: { message?: string }
            choices?: Array<{
              text?: string
              message?: {
                content?:
                  | string
                  | { type?: string; text?: string; content?: string }
                  | Array<{ type?: string; text?: string; content?: string }>
                reasoning?: string
                refusal?: string | null
              }
            }>
          }
        } catch {
          payload = {}
        }
      }

      if (!response.ok) {
        lastStatusCode = response.status
        lastErrorMessage = payload.error?.message?.trim() || `xAI request failed with status ${response.status}`

        if (RETRYABLE_STATUS_CODES.has(response.status) && attempt < maxAttempts - 1) {
          await sleep(350 * (attempt + 1))
          continue
        }

        return { reply: null, error: lastErrorMessage, statusCode: lastStatusCode }
      }

      const reply = extractReplyFromPayload(payload)

      if (!reply) {
        lastErrorMessage = "xAI returned an empty response"

        if (attempt < maxAttempts - 1) {
          await sleep(300 * (attempt + 1))
          continue
        }

        return { reply: null, error: lastErrorMessage, statusCode: lastStatusCode }
      }

      return { reply, error: null, statusCode: null }
    } catch (error) {
      lastErrorMessage = error instanceof Error ? error.message : "Network request failed"

      if (attempt < maxAttempts - 1) {
        await sleep(350 * (attempt + 1))
        continue
      }

      return { reply: null, error: lastErrorMessage, statusCode: lastStatusCode }
    } finally {
      clearTimeout(xaiTimeout)
    }
  }

  return { reply: null, error: lastErrorMessage, statusCode: lastStatusCode }
}

async function requestOpenAiChatCompletion({
  apiKey,
  model,
  messages,
  maxAttempts,
}: {
  apiKey: string
  model: string
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
  maxAttempts: number
}) {
  let lastErrorMessage = "Unable to generate response"
  let lastStatusCode: number | null = null

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const controller = new AbortController()
    const openAiTimeout = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS)

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.35,
          max_tokens: RESPONSE_MAX_TOKENS,
          messages,
        }),
        signal: controller.signal,
      })

      const rawText = await response.text()
      let payload: {
        error?: { message?: string }
        choices?: Array<{
          text?: string
          message?: {
            content?:
              | string
              | { type?: string; text?: string; content?: string }
              | Array<{ type?: string; text?: string; content?: string }>
            refusal?: string | null
          }
        }>
      } = {}

      if (rawText.trim().length > 0) {
        try {
          payload = JSON.parse(rawText) as {
            error?: { message?: string }
            choices?: Array<{
              text?: string
              message?: {
                content?:
                  | string
                  | { type?: string; text?: string; content?: string }
                  | Array<{ type?: string; text?: string; content?: string }>
                refusal?: string | null
              }
            }>
          }
        } catch {
          payload = {}
        }
      }

      if (!response.ok) {
        lastStatusCode = response.status
        lastErrorMessage = payload.error?.message?.trim() || `OpenAI request failed with status ${response.status}`

        if (RETRYABLE_STATUS_CODES.has(response.status) && attempt < maxAttempts - 1) {
          await sleep(350 * (attempt + 1))
          continue
        }

        return { reply: null, error: lastErrorMessage, statusCode: lastStatusCode }
      }

      const reply = extractReplyFromPayload(payload)

      if (!reply) {
        lastErrorMessage = "OpenAI returned an empty response"

        if (attempt < maxAttempts - 1) {
          await sleep(300 * (attempt + 1))
          continue
        }

        return { reply: null, error: lastErrorMessage, statusCode: lastStatusCode }
      }

      return { reply, error: null, statusCode: null }
    } catch (error) {
      lastErrorMessage = error instanceof Error ? error.message : "Network request failed"

      if (attempt < maxAttempts - 1) {
        await sleep(350 * (attempt + 1))
        continue
      }

      return { reply: null, error: lastErrorMessage, statusCode: lastStatusCode }
    } finally {
      clearTimeout(openAiTimeout)
    }
  }

  return { reply: null, error: lastErrorMessage, statusCode: lastStatusCode }
}

async function requestNvidiaChatCompletion({
  apiKey,
  model,
  baseUrl,
  messages,
  maxAttempts,
}: {
  apiKey: string
  model: string
  baseUrl: string
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
  maxAttempts: number
}) {
  let lastErrorMessage = "Unable to generate response"
  let lastStatusCode: number | null = null

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const controller = new AbortController()
    const nvidiaTimeout = setTimeout(() => controller.abort(), NVIDIA_TIMEOUT_MS)

    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.4,
          top_p: 1,
          max_tokens: RESPONSE_MAX_TOKENS,
          stream: false,
          messages,
        }),
        signal: controller.signal,
      })

      const rawText = await response.text()
      let payload: {
        error?: { message?: string }
        choices?: Array<{
          text?: string
          message?: {
            content?:
              | string
              | { type?: string; text?: string; content?: string }
              | Array<{ type?: string; text?: string; content?: string }>
            refusal?: string | null
            reasoning?: string
            reasoning_content?: string
          }
        }>
      } = {}

      if (rawText.trim().length > 0) {
        try {
          payload = JSON.parse(rawText) as {
            error?: { message?: string }
            choices?: Array<{
              text?: string
              message?: {
                content?:
                  | string
                  | { type?: string; text?: string; content?: string }
                  | Array<{ type?: string; text?: string; content?: string }>
                refusal?: string | null
                reasoning?: string
                reasoning_content?: string
              }
            }>
          }
        } catch {
          payload = {}
        }
      }

      if (!response.ok) {
        lastStatusCode = response.status
        lastErrorMessage = payload.error?.message?.trim() || `NVIDIA request failed with status ${response.status}`

        if (RETRYABLE_STATUS_CODES.has(response.status) && attempt < maxAttempts - 1) {
          await sleep(350 * (attempt + 1))
          continue
        }

        return { reply: null, error: lastErrorMessage, statusCode: lastStatusCode }
      }

      const reply = extractReplyFromPayload(payload)

      if (!reply) {
        lastErrorMessage = "NVIDIA returned an empty response"

        if (attempt < maxAttempts - 1) {
          await sleep(300 * (attempt + 1))
          continue
        }

        return { reply: null, error: lastErrorMessage, statusCode: lastStatusCode }
      }

      return { reply, error: null, statusCode: null }
    } catch (error) {
      lastErrorMessage = error instanceof Error ? error.message : "Network request failed"

      if (attempt < maxAttempts - 1) {
        await sleep(350 * (attempt + 1))
        continue
      }

      return { reply: null, error: lastErrorMessage, statusCode: lastStatusCode }
    } finally {
      clearTimeout(nvidiaTimeout)
    }
  }

  return { reply: null, error: lastErrorMessage, statusCode: lastStatusCode }
}

async function requestOpenRouterChatCompletion({
  apiKey,
  model,
  messages,
  maxAttempts,
}: {
  apiKey: string
  model: string
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
  maxAttempts: number
}) {
  let lastErrorMessage = "Unable to generate response"
  let lastStatusCode: number | null = null

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const controller = new AbortController()
    const openRouterTimeout = setTimeout(() => controller.abort(), OPENROUTER_TIMEOUT_MS)

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Ankan Portfolio Assistant",
        },
        body: JSON.stringify({
          model,
          models: [model],
          temperature: 0.4,
          max_tokens: RESPONSE_MAX_TOKENS,
          provider: {
            allow_fallbacks: true,
            sort: "throughput",
          },
          messages,
        }),
        signal: controller.signal,
      })

      const rawText = await response.text()
      let payload: {
        error?: { message?: string }
        choices?: Array<{
          text?: string
          message?: {
            content?:
              | string
              | { type?: string; text?: string; content?: string }
              | Array<{ type?: string; text?: string; content?: string }>
            reasoning?: string
            refusal?: string | null
          }
        }>
      } = {}

      if (rawText.trim().length > 0) {
        try {
          payload = JSON.parse(rawText) as {
            error?: { message?: string }
            choices?: Array<{
              text?: string
              message?: {
                content?:
                  | string
                  | { type?: string; text?: string; content?: string }
                  | Array<{ type?: string; text?: string; content?: string }>
                reasoning?: string
                refusal?: string | null
              }
            }>
          }
        } catch {
          payload = {}
        }
      }

      if (!response.ok) {
        lastStatusCode = response.status
        lastErrorMessage = payload.error?.message?.trim() || `OpenRouter request failed with status ${response.status}`

        if (RETRYABLE_STATUS_CODES.has(response.status) && attempt < maxAttempts - 1) {
          await sleep(350 * (attempt + 1))
          continue
        }

        return { reply: null, error: lastErrorMessage, statusCode: lastStatusCode }
      }

      const reply = extractReplyFromPayload(payload)

      if (!reply) {
        lastErrorMessage = "OpenRouter returned an empty response"

        if (attempt < maxAttempts - 1) {
          await sleep(300 * (attempt + 1))
          continue
        }

        return { reply: null, error: lastErrorMessage, statusCode: lastStatusCode }
      }

      return { reply, error: null, statusCode: null }
    } catch (error) {
      lastErrorMessage = error instanceof Error ? error.message : "Network request failed"

      if (attempt < maxAttempts - 1) {
        await sleep(350 * (attempt + 1))
        continue
      }

      return { reply: null, error: lastErrorMessage, statusCode: lastStatusCode }
    } finally {
      clearTimeout(openRouterTimeout)
    }
  }

  return { reply: null, error: lastErrorMessage, statusCode: lastStatusCode }
}

const PROFILE_CONTEXT = `You are Bob, Ankan Ghosh's personal AI assistant.

Goals:
- Be accurate, intelligent, concise, and natural.
- Use only verified facts below.
- Never invent projects, employers, timelines, metrics, or awards.
- If an exact detail is unavailable, say so clearly and offer direct connection.

Verified facts:
- Ankan Ghosh is a Data Scientist and AI Engineer with strong backend and systems focus.
- Education: B.Tech in Computer Science and Engineering, Lovely Professional University, Aug 2023 - Present, CGPA 8.0, Phagwara, Punjab.
- Focus areas: Data Science, AI/ML, full-stack systems, DSA, backend engineering, scalable system design.
- Internship: IT Analyst Intern, Eastern Coalfields Limited (Govt. of India), Jul 2025 - Aug 2025.
- Internship impact: improved enterprise data accuracy by 15%, improved reporting efficiency by 20%, built Excel and Power BI analytical reports, worked with SAP-based workflows.
- Achievements: Rank 2 in AlgoUniversity Graph Camp (LPU cohort); selected Top 50 from 40,000+ applicants in AlgoUniversity flagship accelerator.
- Certifications: OCI 2025 Data Science Professional, OCI 2025 Generative AI Professional, Oracle Certified Associate Java SE 8, Databricks Accredited Generative AI Fundamentals, Oracle AI Vector Search Certified Professional, Oracle Autonomous Database Cloud Certified Professional.
- Additional credential: McKinsey Forward Program completed.
- Publication: "Operating System Security: A Comprehensive Analysis of Modern Threat Mitigation Techniques" in JETNR, Oct 2024.
- Community: Educational Instructor at Dhagagia Social Welfare Society, sustainability workshops reaching 200+ participants.

Projects:
1. LPU Smart Campus
- Production-grade campus platform across 6+ workflows.
- 209 REST APIs across 14 modules.
- Stack: Python, FastAPI, PostgreSQL, MongoDB, Redis Streams, Celery, Docker, OpenCV.
- Security: RBAC, OTP, MFA, SSO/SCIM, encrypted PII handling.
- Reliability: 45 pytest suites and 180+ automated tests with CI/CD.
2. SATYQ CORE
- Multimodal industrial AI across structured data, images, and logs.
- Intelligent routing with advanced GPT models.
- Roughly 30% lower manual inspection effort, 25% better defect detection turnaround, and 2x faster telemetry insight generation.
3. VidyaVerse
- AI learning platform with multi-source content ingestion and intelligent ranking and recommendation focus.

How to answer:
- Adapt depth to the user. For recruiters, emphasize business impact, reliability, and execution quality.
- For project questions, structure answers as Impact -> Solution -> Tech -> Scale.
- Avoid sounding scripted.

Contact flow:
- If the user wants to connect, first ask whether they want a casual connection or are recruiting for a role.
- If they are recruiting, ask for company first.
- After company is shared, ask for the role or opportunity and you may mention LPU Smart Campus as a strong build.
- After company and role are both shared, offer a tailored resume and relevant project highlights.
- Resume routing: data-focused roles -> /ankanghosh_cv.pdf, software-focused roles -> /AnkanGhosh_CV_SDE.pdf.
- Avoid sharing raw contact details unless explicitly asked.

Fallback sentence:
"I might not have the perfect answer for that, but you can connect directly with Ankan — he’d be happy to help."`

export async function GET() {
  const nvidiaApiKeys = resolveNvidiaApiKeys()
  const openAiApiKeys = resolveOpenAiApiKeys()
  const xaiApiKeys = resolveXaiApiKeys()
  const openRouterApiKeys = resolveOpenRouterApiKeys()

  if (nvidiaApiKeys.length === 0 && openAiApiKeys.length === 0 && xaiApiKeys.length === 0 && openRouterApiKeys.length === 0) {
    return NextResponse.json({ connected: false, error: "Chat service is not configured" }, { status: 503 })
  }

  const configuredNvidiaModel = (process.env.NVIDIA_MODEL ?? "openai/gpt-oss-120b").trim()
  const configuredOpenAiModel = (process.env.OPENAI_MODEL ?? "gpt-4.1-mini").trim()
  const configuredXaiModel = (process.env.XAI_MODEL ?? "grok-3-mini").trim()
  const configuredOpenRouterModel = (process.env.OPENROUTER_MODEL ?? "qwen/qwen3.6-plus:free").trim()
  const provider = nvidiaApiKeys.length > 0 ? "NVIDIA" : openAiApiKeys.length > 0 ? "OpenAI" : openRouterApiKeys.length > 0 ? "OpenRouter" : "xAI"
  const model =
    nvidiaApiKeys.length > 0
      ? configuredNvidiaModel
      : openAiApiKeys.length > 0
      ? configuredOpenAiModel
      : openRouterApiKeys.length > 0
        ? configuredOpenRouterModel
        : configuredXaiModel

  return NextResponse.json({ connected: true, provider, model })
}

export async function POST(request: Request) {
  const nvidiaApiKeys = resolveNvidiaApiKeys()
  const openAiApiKeys = resolveOpenAiApiKeys()
  const xaiApiKeys = resolveXaiApiKeys()
  const openRouterApiKeys = resolveOpenRouterApiKeys()

  let body: { message?: string; history?: ChatMessage[] }

  try {
    body = (await request.json()) as { message?: string; history?: ChatMessage[] }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const message = body.message?.trim()

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 })
  }

  if (message.length > 1200) {
    return NextResponse.json({ error: "Message is too long" }, { status: 400 })
  }

  const history = Array.isArray(body.history)
    ? body.history
        .filter((item): item is ChatMessage => {
          if (!item || typeof item !== "object") return false
          if (item.role !== "user" && item.role !== "assistant") return false
          return typeof item.content === "string" && item.content.trim().length > 0
        })
        .slice(-8)
    : []


  if (nvidiaApiKeys.length === 0 && openAiApiKeys.length === 0 && xaiApiKeys.length === 0 && openRouterApiKeys.length === 0) {
    return NextResponse.json({ error: "Chat service is not configured" }, { status: 503 })
  }

  const configuredNvidiaBaseUrl = (process.env.NVIDIA_BASE_URL ?? "https://integrate.api.nvidia.com/v1").trim().replace(/\/$/, "")
  const configuredNvidiaModel = (process.env.NVIDIA_MODEL ?? "openai/gpt-oss-120b").trim()
  const configuredOpenAiModel = (process.env.OPENAI_MODEL ?? "gpt-4.1-mini").trim()
  const configuredXaiModel = (process.env.XAI_MODEL ?? "grok-3-mini").trim()
  const configuredOpenRouterModel = (process.env.OPENROUTER_MODEL ?? "qwen/qwen3.6-plus:free").trim()
  const deadline = Date.now() + CHAT_COMPLETION_MAX_WAIT_MS
  let completion: { reply: string | null; error: string | null; statusCode: number | null } = {
    reply: null,
    error: "Unable to generate response",
    statusCode: null,
  }

  const baseMessages = [
    { role: "system" as const, content: PROFILE_CONTEXT },
    ...history.map((item) => ({ role: item.role, content: item.content })),
    { role: "user" as const, content: message },
  ]

  const previousUserMessages = history.filter((item) => item.role === "user").map((item) => item.content)
  const userMessagesForFlow = [...previousUserMessages, message]
  const previousRecruiterStatus = getRecruiterStatus(previousUserMessages)
  const recruiterStatus = getRecruiterStatus(userMessagesForFlow)

  if (nvidiaApiKeys.length > 0) {
    const now = Date.now()
    const availableNvidiaKeys = nvidiaApiKeys.filter((key) => !isKeyInCooldown(key, nvidiaKeyCooldownUntilMs, now))
    const nvidiaKeysForAttempt = limitKeysForAttempt(availableNvidiaKeys.length > 0 ? availableNvidiaKeys : nvidiaApiKeys).slice(0, 1)

    for (let keyIndex = 0; keyIndex < nvidiaKeysForAttempt.length; keyIndex += 1) {
      if (Date.now() >= deadline) {
        completion = { reply: null, error: "NVIDIA request timed out", statusCode: null }
        break
      }

      const key = nvidiaKeysForAttempt[keyIndex]
      const attemptsLeft = nvidiaKeysForAttempt.length - keyIndex
      const attemptsForModel = Math.max(1, Math.floor(OPENAI_TOTAL_ATTEMPTS / Math.max(1, attemptsLeft)))

      completion = await requestNvidiaChatCompletion({
        apiKey: key,
        model: configuredNvidiaModel,
        baseUrl: configuredNvidiaBaseUrl,
        maxAttempts: attemptsForModel,
        messages: baseMessages,
      })

      if (completion.statusCode === 429) {
        setKeyCooldown(key, nvidiaKeyCooldownUntilMs, KEY_COOLDOWN_MS)
      }

      if (completion.statusCode !== null && AUTH_OR_CREDIT_STATUS_CODES.has(completion.statusCode)) {
        setKeyCooldown(key, nvidiaKeyCooldownUntilMs, UNUSABLE_KEY_COOLDOWN_MS)
      }

      if (completion.reply || completion.error === "NVIDIA request timed out") {
        break
      }
    }
  }

  if (!completion.reply && completion.error !== "NVIDIA request timed out" && openAiApiKeys.length > 0) {
    const now = Date.now()
    const availableOpenAiKeys = openAiApiKeys.filter((key) => !isKeyInCooldown(key, openAiKeyCooldownUntilMs, now))
    const openAiKeysForAttempt = limitKeysForAttempt(availableOpenAiKeys.length > 0 ? availableOpenAiKeys : openAiApiKeys).slice(0, 1)

    for (let keyIndex = 0; keyIndex < openAiKeysForAttempt.length; keyIndex += 1) {
      if (Date.now() >= deadline) {
        completion = { reply: null, error: "OpenAI request timed out", statusCode: null }
        break
      }

      const key = openAiKeysForAttempt[keyIndex]
      const attemptsLeft = openAiKeysForAttempt.length - keyIndex
      const attemptsForModel = Math.max(1, Math.floor(OPENAI_TOTAL_ATTEMPTS / Math.max(1, attemptsLeft)))

      completion = await requestOpenAiChatCompletion({
        apiKey: key,
        model: configuredOpenAiModel,
        maxAttempts: attemptsForModel,
        messages: baseMessages,
      })

      if (completion.statusCode === 429) {
        setKeyCooldown(key, openAiKeyCooldownUntilMs, KEY_COOLDOWN_MS)
      }

      if (completion.statusCode !== null && AUTH_OR_CREDIT_STATUS_CODES.has(completion.statusCode)) {
        setKeyCooldown(key, openAiKeyCooldownUntilMs, UNUSABLE_KEY_COOLDOWN_MS)
      }

      if (completion.reply || completion.error === "OpenAI request timed out") {
        break
      }
    }
  }

  if (!completion.reply && completion.error !== "OpenAI request timed out" && openRouterApiKeys.length > 0) {
    const now = Date.now()
    const availableOpenRouterKeys = openRouterApiKeys.filter((key) => !isKeyInCooldown(key, openRouterKeyCooldownUntilMs, now))
    const openRouterKeysForAttempt = limitKeysForAttempt(availableOpenRouterKeys.length > 0 ? availableOpenRouterKeys : openRouterApiKeys)

    for (let keyIndex = 0; keyIndex < openRouterKeysForAttempt.length; keyIndex += 1) {
      if (Date.now() >= deadline) {
        completion = { reply: null, error: "OpenRouter request timed out", statusCode: null }
        break
      }

      const key = openRouterKeysForAttempt[keyIndex]
      const attemptsLeft = openRouterKeysForAttempt.length - keyIndex
      const attemptsForModel = Math.max(1, Math.floor(OPENROUTER_TOTAL_ATTEMPTS / Math.max(1, attemptsLeft)))

      completion = await requestOpenRouterChatCompletion({
        apiKey: key,
        model: configuredOpenRouterModel,
        maxAttempts: attemptsForModel,
        messages: baseMessages,
      })

      if (completion.statusCode === 429) {
        setKeyCooldown(key, openRouterKeyCooldownUntilMs, KEY_COOLDOWN_MS)
      }

      if (completion.statusCode !== null && AUTH_OR_CREDIT_STATUS_CODES.has(completion.statusCode)) {
        setKeyCooldown(key, openRouterKeyCooldownUntilMs, UNUSABLE_KEY_COOLDOWN_MS)
      }

      if (completion.reply || completion.error === "OpenRouter request timed out") {
        break
      }
    }
  }

  if (!completion.reply && completion.error !== "OpenRouter request timed out" && xaiApiKeys.length > 0) {
    const now = Date.now()
    const availableXaiKeys = xaiApiKeys.filter((key) => !isKeyInCooldown(key, xaiKeyCooldownUntilMs, now))
    const xaiKeysForAttempt = limitKeysForAttempt(availableXaiKeys.length > 0 ? availableXaiKeys : xaiApiKeys)
    const xaiAttemptSlots = xaiKeysForAttempt.length

    for (let keyIndex = 0; keyIndex < xaiKeysForAttempt.length; keyIndex += 1) {
      if (Date.now() >= deadline) {
        completion = { reply: null, error: "xAI request timed out", statusCode: null }
        break
      }

      const key = xaiKeysForAttempt[keyIndex]
      const attemptsLeft = xaiAttemptSlots - keyIndex
      const attemptsForModel = Math.max(1, Math.floor(XAI_TOTAL_ATTEMPTS / Math.max(1, attemptsLeft)))

      completion = await requestXaiChatCompletion({
        apiKey: key,
        model: configuredXaiModel,
        maxAttempts: attemptsForModel,
        messages: baseMessages,
      })

      if (completion.statusCode === 429) {
        setKeyCooldown(key, xaiKeyCooldownUntilMs, KEY_COOLDOWN_MS)
      }

      if (completion.statusCode !== null && AUTH_OR_CREDIT_STATUS_CODES.has(completion.statusCode)) {
        setKeyCooldown(key, xaiKeyCooldownUntilMs, UNUSABLE_KEY_COOLDOWN_MS)
      }

      if (completion.reply) {
        break
      }
    }
  }

  if (!completion.reply) {
    return NextResponse.json({ reply: FALLBACK_REPLY })
  }

  const recruiterJustProvidedCompany =
    recruiterStatus.isRecruiter &&
    recruiterStatus.hasCompany &&
    !recruiterStatus.hasRole &&
    !(previousRecruiterStatus.isRecruiter && previousRecruiterStatus.hasCompany)

  if (recruiterJustProvidedCompany) {
    return NextResponse.json({
        reply:
          "Thanks for sharing that. One of his strongest builds is LPU Smart Campus — a production-grade system with 200+ APIs and real-time workflows. What kind of role or opportunity are you hiring for? I can tailor relevant insights for you.",
    })
  }

  const recruiterJustVerified =
    recruiterStatus.isRecruiter &&
    recruiterStatus.hasCompany &&
    recruiterStatus.hasRole &&
    !(previousRecruiterStatus.isRecruiter && previousRecruiterStatus.hasCompany && previousRecruiterStatus.hasRole)

  if (recruiterJustVerified) {
    return NextResponse.json({
      reply:
        "Thanks for sharing that. I can share a tailored resume based on the role — would you like me to send it over? I can also highlight the most relevant projects.",
    })
  }

  if (recruiterStatus.isRecruiter && !recruiterStatus.hasCompany) {
    return NextResponse.json({ reply: "Happy to share relevant details — just let me know your company." })
  }

  return NextResponse.json({ reply: completion.reply })
}
