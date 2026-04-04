"use client"

import Image from "next/image"
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ArrowUpRight, Copy, Download, Mail, Phone, Send, X } from "lucide-react"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
  actions?: ChatAction[]
}

type ChatActionType = "link" | "mailto" | "tel" | "copy" | "scroll" | "prompt"

type ChatAction = {
  id: string
  label: string
  type: ChatActionType
  href?: string
  value?: string
}

type PersistedChatState = {
  isOpen: boolean
  messages: ChatMessage[]
  updatedAt: number
}

type ChatServiceStatus = "checking" | "connected" | "disconnected"

type ChatIntent = "recruiter" | "networking" | "resume" | "projects" | "general"
type ConversationState =
  | "idle"
  | "intent_detected"
  | "intent_confirmed"
  | "user_classified"
  | "recruiter_verification_pending"
  | "recruiter_company_provided"
  | "recruiter_verified"

type UserClassification = "recruiter" | "collaborator" | "general" | null

type CvType = "data" | "software" | "general"

type ConversationFlow = {
  state: ConversationState
  userClassification: UserClassification
  hasCompany: boolean
  hasRole: boolean
  hasRecruiterEmail: boolean
  hasRecruiterPhone: boolean
  cvType: CvType
}

const CONTACT_EMAIL = "ghoshankan005@gmail.com"
const CONTACT_PHONE = "+91-9046359825"
const LINKEDIN_URL = "https://www.linkedin.com/in/ghoshankan"
const GITHUB_URL = "https://github.com/ankan00V"
const MEDIUM_URL = "https://medium.com/@ghoshankan005"
const SDE_CV_URL = "/AnkanGhosh_CV_SDE.pdf"
const DATA_CV_URL = "/ankanghosh_cv.pdf"
const PROJECTS_ANCHOR = "#projects"
const CHAT_STORAGE_KEY = "ankan-portfolio-chat-state-v1"
const CHAT_REQUEST_TIMEOUT_MS = 70000
const CHAT_RETRY_BASE_DELAY_MS = 450
const CHAT_RETRY_MAX_DELAY_MS = 3200
const CHAT_MAX_ATTEMPTS = 1

const URL_PATTERN = /https?:\/\/[^\s<>"]+/gi
const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi
const PHONE_PATTERN = /\+?\d[\d\s()-]{7,}\d/g

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

const networkingSignals = ["connect", "network", "linkedin", "reach out"]
const resumeSignals = ["resume", "cv"]
const projectSignals = ["project", "projects", "portfolio", "work", "github"]
const collaboratorSignals = ["collaborator", "collaboration", "partner", "partnership", "open source", "freelance", "build together"]
const generalConnectSignals = ["just looking to connect", "not a recruiter", "networking", "connect only", "general", "casual", "casually"]
const chatResetGreetings = ["hi", "hello", "hey"]
const CHAT_INACTIVITY_RESET_MS = 1000 * 60 * 18

const starterMessage: ChatMessage = {
  role: "assistant",
  content:
    "Welcome! I’m Bob — Ankan’s personal AI assistant. You can ask me anything about his journey, projects, tech stack, or achievements. Want me to connect you with him as well?",
  actions: [
    { id: "starter-projects", label: "View Projects", type: "scroll", href: PROJECTS_ANCHOR },
    { id: "starter-skills", label: "Explore Skills", type: "scroll", href: "#skills" },
    { id: "starter-experience", label: "See Experience", type: "scroll", href: "#experience" },
    { id: "starter-connect", label: "Connect with Ankan", type: "prompt", value: "I want to connect with Ankan" },
  ],
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function extractPatternMatches(pattern: RegExp, content: string) {
  const matches = content.match(pattern) ?? []
  return matches.map((value) => value.replace(/[),.!?;:]+$/, ""))
}

function dedupeActions(actions: ChatAction[]) {
  const seen = new Set<string>()
  return actions.filter((action) => {
    const key = `${action.type}:${action.href ?? action.value ?? action.label}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function hasSignal(text: string, signals: string[]) {
  return signals.some((signal) => text.includes(signal))
}

function isContactRequest(text: string) {
  const lower = text.toLowerCase()
  return /\b(connect|contact|reach out|email|mail|phone|call|whatsapp|hire|hiring|recruit|network)\b/.test(lower)
}

function isSimpleGreeting(text: string) {
  const normalized = text.trim().toLowerCase().replace(/[!.?]+$/g, "")
  return chatResetGreetings.includes(normalized)
}

function isCollaboratorReply(text: string) {
  const lower = text.toLowerCase()
  return hasSignal(lower, collaboratorSignals)
}

function isGeneralConnectReply(text: string) {
  const lower = text.toLowerCase()
  return hasSignal(lower, generalConnectSignals)
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

function inferCvType(text: string): CvType {
  const lower = text.toLowerCase()
  if (/\b(data|data scientist|data science|analytics|analyst|ml|machine learning|ai|genai|llm|business intelligence|bi)\b/.test(lower)) {
    return "data"
  }

  if (/\b(software|sde|backend|frontend|full stack|fullstack|developer|engineer|api|system design|platform|web)\b/.test(lower)) {
    return "software"
  }

  return "general"
}

function inferConversationFlow(userMessages: string[]): ConversationFlow {
  const recentContext = userMessages.slice(-4).join(" ").toLowerCase()
  const softRecruiterSignal = hasSoftRecruiterSignal(recentContext)
  const classifiedRecruiter = isRecruiterReply(recentContext) || softRecruiterSignal
  const classifiedCollaborator = isCollaboratorReply(recentContext) && !classifiedRecruiter
  const classifiedGeneral = isGeneralConnectReply(recentContext) && !classifiedRecruiter && !classifiedCollaborator
  const hasCompany = hasCompanyInfo(recentContext)
  const hasRole = hasRoleInfo(recentContext)
  const hasEmail = hasRecruiterEmail(recentContext)
  const hasPhone = hasRecruiterPhone(recentContext)
  const cvType = inferCvType(recentContext)

  if (classifiedRecruiter && hasCompany && hasRole) {
    return {
      state: "recruiter_verified",
      userClassification: "recruiter",
      hasCompany,
      hasRole,
      hasRecruiterEmail: hasEmail,
      hasRecruiterPhone: hasPhone,
      cvType,
    }
  }

  if (classifiedRecruiter && hasCompany && !hasRole) {
    return {
      state: "recruiter_company_provided",
      userClassification: "recruiter",
      hasCompany,
      hasRole,
      hasRecruiterEmail: hasEmail,
      hasRecruiterPhone: hasPhone,
      cvType,
    }
  }

  if (classifiedRecruiter) {
    return {
      state: "recruiter_verification_pending",
      userClassification: "recruiter",
      hasCompany,
      hasRole,
      hasRecruiterEmail: hasEmail,
      hasRecruiterPhone: hasPhone,
      cvType,
    }
  }

  if (classifiedCollaborator) {
    return {
      state: "user_classified",
      userClassification: "collaborator",
      hasCompany,
      hasRole,
      hasRecruiterEmail: hasEmail,
      hasRecruiterPhone: hasPhone,
      cvType,
    }
  }

  if (classifiedGeneral) {
    return {
      state: "user_classified",
      userClassification: "general",
      hasCompany,
      hasRole,
      hasRecruiterEmail: hasEmail,
      hasRecruiterPhone: hasPhone,
      cvType,
    }
  }

  if (isContactRequest(recentContext) && /\b(professionally|collaboration|networking|general|recruiter|hiring)\b/.test(recentContext)) {
    return {
      state: "intent_confirmed",
      userClassification: null,
      hasCompany,
      hasRole,
      hasRecruiterEmail: hasEmail,
      hasRecruiterPhone: hasPhone,
      cvType,
    }
  }

  if (isContactRequest(recentContext)) {
    return {
      state: "intent_detected",
      userClassification: null,
      hasCompany,
      hasRole,
      hasRecruiterEmail: hasEmail,
      hasRecruiterPhone: hasPhone,
      cvType,
    }
  }

  return {
    state: "idle",
    userClassification: null,
    hasCompany,
    hasRole,
    hasRecruiterEmail: hasEmail,
    hasRecruiterPhone: hasPhone,
    cvType,
  }
}

function asksForContactQualification(assistantMessage: string) {
  const lower = assistantMessage.toLowerCase()

  return (
    lower.includes("are you looking to connect casually") ||
    lower.includes("recruiter with opportunities") ||
    lower.includes("recruiter, collaborator, or just looking to connect") ||
    lower.includes("are you looking to connect professionally") ||
    lower.includes("recruiter or general") ||
    lower.includes("share your company name") ||
    lower.includes("company name") ||
    lower.includes("which company") ||
    lower.includes("what kind of role") ||
    lower.includes("role or opportunity") ||
    lower.includes("hiring for") ||
    lower.includes("share a bit about the opportunity")
  )
}

function isVagueConnectIntent(text: string) {
  const lower = text.toLowerCase()

  if (!isContactRequest(lower)) return false

  return !(
    isRecruiterReply(lower) ||
    isGeneralConnectReply(lower) ||
    hasCompanyInfo(lower) ||
    /\b(collaborat|partnership|freelance|project together|open source)\b/.test(lower)
  )
}

function detectIntent(latestUserMessage: string, recentUserMessages: string[]): ChatIntent {
  const latest = latestUserMessage.toLowerCase()
  const recent = recentUserMessages.join(" ").toLowerCase()

  if (hasSignal(`${latest} ${recent}`, recruiterSignals)) {
    return "recruiter"
  }

  if (hasSignal(latest, resumeSignals)) {
    return "resume"
  }

  if (hasSignal(latest, projectSignals)) {
    return "projects"
  }

  if (hasSignal(latest, networkingSignals)) {
    return "networking"
  }

  return "general"
}

function getLinkLabel(url: string) {
  const lowerUrl = url.toLowerCase()

  if (lowerUrl.includes("linkedin.com")) return "View LinkedIn"
  if (lowerUrl.includes("github.com")) return "View GitHub Profile"
  if (lowerUrl.includes("medium.com")) return "Read Blogs"
  if (lowerUrl.endsWith(".pdf") || lowerUrl.includes("resume")) return "Download Resume"

  return "Open Link"
}

function shouldShowRawContact(latestUserMessage: string) {
  const text = latestUserMessage.toLowerCase()
  return /\b(raw|exact|full|direct|verbatim)\b/.test(text) || /\bemail address|phone number|contact number\b/.test(text)
}

function getCvMeta(cvType: CvType) {
  if (cvType === "software") {
    return { url: SDE_CV_URL, label: "Download SDE CV" }
  }

  return { url: DATA_CV_URL, label: "Download Data CV" }
}

function withProjectCtas(actions: ChatAction[], assistantMessage: string) {
  const lowerAssistantMessage = assistantMessage.toLowerCase()

  if (!lowerAssistantMessage.includes("project")) {
    return dedupeActions(actions).slice(0, 4)
  }

  return dedupeActions([
    ...actions,
    { id: "forced-project-github", label: "View GitHub", type: "link", href: GITHUB_URL },
    { id: "forced-projects-explore", label: "Explore Projects", type: "scroll", href: PROJECTS_ANCHOR },
  ]).slice(0, 4)
}

function buildProbableRecruiterActions(flow: ConversationFlow) {
  const cvMeta = getCvMeta(flow.cvType)

  return dedupeActions([
    { id: `recruiter-probable-cv-${flow.cvType}`, label: cvMeta.label, type: "link", href: cvMeta.url },
    { id: "recruiter-probable-linkedin", label: "View LinkedIn", type: "link", href: LINKEDIN_URL },
  ]).slice(0, 4)
}

function buildRecruiterCompanyProvidedActions(flow: ConversationFlow) {
  const cvMeta = getCvMeta(flow.cvType)

  return dedupeActions([
    { id: `recruiter-partial-cv-${flow.cvType}`, label: cvMeta.label, type: "link", href: cvMeta.url },
    { id: "recruiter-partial-linkedin", label: "View LinkedIn", type: "link", href: LINKEDIN_URL },
  ]).slice(0, 4)
}

function buildRecruiterVerifiedActions(flow: ConversationFlow) {
  const cvMeta = getCvMeta(flow.cvType)

  return dedupeActions([
    { id: `recruiter-cv-${flow.cvType}`, label: cvMeta.label, type: "link", href: cvMeta.url },
    { id: "recruiter-view-linkedin", label: "View LinkedIn", type: "link", href: LINKEDIN_URL },
    { id: "recruiter-email", label: "Email Ankan", type: "mailto", href: `mailto:${CONTACT_EMAIL}` },
    { id: "recruiter-call", label: "Call Ankan", type: "tel", href: `tel:${CONTACT_PHONE.replace(/\s+/g, "")}` },
  ]).slice(0, 4)
}

function buildDirectRequestActions(latestUserMessage: string, flow: ConversationFlow) {
  const text = latestUserMessage.toLowerCase()
  const directActions: ChatAction[] = []

  const asksEmail = /\b(email|mail|gmail|e-mail)\b/.test(text)
  const asksPhone = /\b(phone|mobile|number|contact number|call|whatsapp)\b/.test(text)
  const asksLinkedin = /\b(linkedin|linked in)\b/.test(text)
  const asksGithub = /\b(github|git hub|repo|repositories)\b/.test(text)
  const asksMedium = /\b(medium|blog|blogs|article|articles)\b/.test(text)
  const asksResume = /\b(resume|cv)\b/.test(text)
  const asksProjects = /\b(project|projects|portfolio|work)\b/.test(text)
  const asksLinks = /\b(link|links|social|profiles)\b/.test(text)

  if (flow.state === "recruiter_verified") {
    const recruiterActions = buildRecruiterVerifiedActions(flow)
    if (asksEmail || asksPhone || asksLinks || asksLinkedin || asksResume) {
      return recruiterActions
    }
    directActions.push(...recruiterActions)
  }

  if (flow.state === "recruiter_company_provided") {
    const partialRecruiterActions = buildRecruiterCompanyProvidedActions(flow)
    if (asksLinks || asksLinkedin || asksResume) {
      return partialRecruiterActions
    }
    directActions.push(...partialRecruiterActions)
  }

  if (flow.userClassification === "general" && (asksLinkedin || asksLinks)) {
    directActions.push({ id: "direct-linkedin", label: "View LinkedIn", type: "link", href: LINKEDIN_URL })
  }

  if (flow.userClassification === "collaborator") {
    directActions.push(
      { id: "collab-github", label: "View GitHub", type: "link", href: GITHUB_URL },
      { id: "collab-linkedin", label: "View LinkedIn", type: "link", href: LINKEDIN_URL },
      { id: "collab-email", label: "Email Ankan", type: "mailto", href: `mailto:${CONTACT_EMAIL}` },
    )
  }

  if (asksGithub) {
    directActions.push({ id: "direct-github", label: "View GitHub", type: "link", href: GITHUB_URL })
  }

  if (asksMedium) {
    directActions.push({ id: "direct-medium", label: "Read Blogs", type: "link", href: MEDIUM_URL })
  }

  if (asksResume) {
    const cvMeta = getCvMeta(flow.cvType)
    directActions.push({ id: `direct-resume-${flow.cvType}`, label: cvMeta.label, type: "link", href: cvMeta.url })
  }

  if (asksProjects) {
    directActions.push({ id: "direct-projects", label: "View Projects", type: "scroll", href: PROJECTS_ANCHOR })
  }

  return dedupeActions(directActions).slice(0, 4)
}

function buildActions(
  assistantMessage: string,
  latestUserMessage: string,
  recentUserMessages: string[],
  flow: ConversationFlow,
): ChatAction[] {
  const intent = detectIntent(latestUserMessage, recentUserMessages)
  const urls = extractPatternMatches(URL_PATTERN, assistantMessage)
  const isQualificationStep = asksForContactQualification(assistantMessage)
  const requestedContactFlow = isContactRequest(`${latestUserMessage} ${recentUserMessages.join(" ")}`)
  const isFirstUserTurn = recentUserMessages.length <= 1
  const directRequestActions = buildDirectRequestActions(latestUserMessage, flow)

  if (isFirstUserTurn || isSimpleGreeting(latestUserMessage)) {
    return []
  }

  if (assistantMessage.toLowerCase().includes("might not have the perfect answer")) {
    return [{ id: "fallback-linkedin", label: "Talk to Ankan", type: "link", href: LINKEDIN_URL }]
  }

  if (!isQualificationStep && !isVagueConnectIntent(latestUserMessage) && directRequestActions.length > 0) {
    return withProjectCtas(directRequestActions, assistantMessage)
  }

  if (isQualificationStep && flow.state !== "recruiter_verification_pending") {
    return []
  }

  if (
    requestedContactFlow &&
    flow.state !== "recruiter_verified" &&
    flow.state !== "recruiter_company_provided" &&
    flow.state !== "recruiter_verification_pending" &&
    flow.userClassification !== "general" &&
    flow.userClassification !== "collaborator"
  ) {
    return []
  }

  if (flow.state === "recruiter_verification_pending") {
    return buildProbableRecruiterActions(flow)
  }

  if (flow.state === "recruiter_company_provided" && flow.hasCompany && !flow.hasRole) {
    return buildRecruiterCompanyProvidedActions(flow)
  }

  if (flow.state === "recruiter_verified" && flow.hasCompany && flow.hasRole) {
    return buildRecruiterVerifiedActions(flow)
  }

  if (flow.userClassification === "collaborator") {
    return dedupeActions([
      { id: "collab-view-github", label: "View GitHub Profile", type: "link", href: GITHUB_URL },
      { id: "collab-view-linkedin", label: "View LinkedIn", type: "link", href: LINKEDIN_URL },
      { id: "collab-email-ankan", label: "Email Ankan", type: "mailto", href: `mailto:${CONTACT_EMAIL}` },
    ])
  }

  if (flow.userClassification === "general") {
    return [{ id: "view-linkedin", label: "View LinkedIn", type: "link", href: LINKEDIN_URL }]
  }

  if (intent === "resume") {
    const cvMeta = getCvMeta(flow.cvType)
    return [{ id: `download-resume-${flow.cvType}`, label: cvMeta.label, type: "link", href: cvMeta.url }]
  }

  if (intent === "projects") {
    return withProjectCtas(
      [
        { id: "view-github-profile", label: "View GitHub Profile", type: "link", href: GITHUB_URL },
        { id: "explore-more-projects", label: "Explore More Projects", type: "scroll", href: PROJECTS_ANCHOR },
      ],
      assistantMessage,
    )
  }

  if (intent === "networking" && !isContactRequest(latestUserMessage)) {
    return [{ id: "view-linkedin", label: "View LinkedIn", type: "link", href: LINKEDIN_URL }]
  }

  const actionsFromUrls = urls.map((url, index) => ({
    id: `url-${index}-${url}`,
    label: getLinkLabel(url),
    type: "link" as const,
    href: url,
  }))

  const dynamicActions: ChatAction[] = [...actionsFromUrls]
  const lowerAssistantMessage = assistantMessage.toLowerCase()

  if (lowerAssistantMessage.includes("resume") && dynamicActions.length < 4) {
    const cvMeta = getCvMeta(flow.cvType)
    dynamicActions.push({ id: `resume-fallback-${flow.cvType}`, label: cvMeta.label, type: "link", href: cvMeta.url })
  }

  if (lowerAssistantMessage.includes("project") && dynamicActions.length < 4) {
    dynamicActions.push({ id: "projects-fallback", label: "Explore Projects", type: "scroll", href: PROJECTS_ANCHOR })
  }

  if (lowerAssistantMessage.includes("project") && dynamicActions.length < 4) {
    dynamicActions.push({ id: "projects-github-fallback", label: "View GitHub", type: "link", href: GITHUB_URL })
  }

  if (lowerAssistantMessage.includes("medium") && dynamicActions.length < 4) {
    dynamicActions.push({ id: "medium-fallback", label: "Read Blogs", type: "link", href: MEDIUM_URL })
  }

  return withProjectCtas(dynamicActions, assistantMessage)
}

function sanitizeAssistantMessage(content: string, actions: ChatAction[], latestUserMessage: string) {
  const hasContactActions = actions.some((action) => action.type === "mailto" || action.type === "tel" || action.label.includes("Copy"))
  const shouldKeepRawContact = shouldShowRawContact(latestUserMessage)
  const hasLinkActions = actions.some((action) => action.type === "link")
  const lower = content.toLowerCase()
  const hasNegativeTone = /\b(not good|weak|bad|average|not strong|underwhelming)\b/.test(lower)

  let sanitized = content

  if (hasContactActions && !shouldKeepRawContact) {
    sanitized = sanitized.replace(EMAIL_PATTERN, "email shared below")
    sanitized = sanitized.replace(PHONE_PATTERN, "phone shared below")
  }

  if (hasLinkActions) {
    sanitized = sanitized.replace(URL_PATTERN, "link shared below")
  }

  if (hasNegativeTone && !lower.startsWith("that’s a fair perspective") && !lower.startsWith("that's a fair perspective")) {
    sanitized = `That’s a fair perspective, but ${sanitized.charAt(0).toLowerCase()}${sanitized.slice(1)}`
  }

  return sanitized
}

function ensureStarterFirst(messages: ChatMessage[]) {
  const remaining = messages
    .filter((message, index) => !(index === 0 && message.role === "assistant"))
    .slice(-31)

  return [{ ...starterMessage }, ...remaining]
}

function clearHistoricalActions(messages: ChatMessage[]) {
  const assistantMessages = messages.filter((message) => message.role === "assistant")
  const assistantMessagesWithActions = assistantMessages.filter(
    (message) => Array.isArray(message.actions) && message.actions.length > 0,
  )

  return messages.map((message, index) => {
    const keepStarterActions =
      index === 0 &&
      message.role === "assistant" &&
      message.content === starterMessage.content &&
      assistantMessagesWithActions.length <= 1

    if (keepStarterActions) {
      return { ...starterMessage }
    }

    return message.role === "assistant" && Array.isArray(message.actions) && message.actions.length > 0
      ? { ...message, actions: [] }
      : message
  })
}

function stripAssistantActions(messages: ChatMessage[]) {
  const hasMeaningfulAssistantReply = messages.some(
    (message, index) => index > 0 && message.role === "assistant" && message.content !== starterMessage.content,
  )

  return messages.map((message, index) => {
    const keepStarterActions =
      !hasMeaningfulAssistantReply &&
      index === 0 &&
      message.role === "assistant" &&
      message.content === starterMessage.content

    if (keepStarterActions) {
      return message
    }

    return message.role === "assistant" && Array.isArray(message.actions) && message.actions.length > 0
      ? { ...message, actions: [] }
      : message
  })
}

export function PersonalChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage])
  const [copiedActionId, setCopiedActionId] = useState<string | null>(null)
  const [chatServiceStatus, setChatServiceStatus] = useState<ChatServiceStatus>("checking")
  const [conversationFlow, setConversationFlow] = useState<ConversationFlow>({
    state: "idle",
    userClassification: null,
    hasCompany: false,
    hasRole: false,
    hasRecruiterEmail: false,
    hasRecruiterPhone: false,
    cvType: "general",
  })
  const messagesRef = useRef<ChatMessage[]>([starterMessage])
  const conversationFlowRef = useRef<ConversationFlow>({
    state: "idle",
    userClassification: null,
    hasCompany: false,
    hasRole: false,
    hasRecruiterEmail: false,
    hasRecruiterPhone: false,
    cvType: "general",
  })
  const initializedFromStorageRef = useRef(false)
  const chatViewportRef = useRef<HTMLDivElement | null>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    let isCancelled = false

    const verifyChatService = async () => {
      try {
        const response = await fetch("/api/chat", { method: "GET" })
        if (!isCancelled) {
          setChatServiceStatus(response.ok ? "connected" : "disconnected")
        }
      } catch {
        if (!isCancelled) {
          setChatServiceStatus("disconnected")
        }
      }
    }

    void verifyChatService()

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || initializedFromStorageRef.current) {
      return
    }

    initializedFromStorageRef.current = true

    try {
      const rawState = window.localStorage.getItem(CHAT_STORAGE_KEY)
      if (!rawState) {
        return
      }

      const parsed = JSON.parse(rawState) as PersistedChatState
      const isStale = typeof parsed.updatedAt === "number" ? Date.now() - parsed.updatedAt > CHAT_INACTIVITY_RESET_MS : true

      if (isStale) {
        window.localStorage.removeItem(CHAT_STORAGE_KEY)
        return
      }

      const safeMessages =
        Array.isArray(parsed.messages) && parsed.messages.length > 0
          ? parsed.messages
              .filter(
                (item): item is ChatMessage =>
                  Boolean(item) &&
                  (item.role === "assistant" || item.role === "user") &&
                  typeof item.content === "string" &&
                  item.content.trim().length > 0,
              )
              .slice(-32)
          : [starterMessage]

      const normalizedMessages = ensureStarterFirst(safeMessages.length > 0 ? safeMessages : [starterMessage])
      const restoredMessages = clearHistoricalActions(normalizedMessages)
      const restoredFlow = inferConversationFlow(
        restoredMessages.filter((item) => item.role === "user").map((item) => item.content),
      )

      setIsOpen(Boolean(parsed.isOpen))
      setMessages(restoredMessages)
      setConversationFlow(restoredFlow)
      conversationFlowRef.current = restoredFlow
    } catch {
      window.localStorage.removeItem(CHAT_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    conversationFlowRef.current = conversationFlow
  }, [conversationFlow])

  useEffect(() => {
    if (typeof window === "undefined" || !initializedFromStorageRef.current) {
      return
    }

    const stateToPersist: PersistedChatState = {
      isOpen,
      messages,
      updatedAt: Date.now(),
    }

    try {
      window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(stateToPersist))
    } catch {
    }
  }, [isOpen, messages])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const node = chatViewportRef.current
    if (!node) {
      return
    }

    const scrollToBottom = () => {
      node.scrollTop = node.scrollHeight
    }

    const frame = window.requestAnimationFrame(scrollToBottom)
    return () => window.cancelAnimationFrame(frame)
  }, [isOpen, isLoading, messages])

  const canSend = useMemo(
    () => input.trim().length > 0 && !isLoading && chatServiceStatus === "connected",
    [chatServiceStatus, input, isLoading],
  )

  const runAction = useCallback(async (action: ChatAction) => {
    if (action.type === "copy" && action.value) {
      try {
        await navigator.clipboard.writeText(action.value)
        setCopiedActionId(action.id)
        window.setTimeout(() => setCopiedActionId((current) => (current === action.id ? null : current)), 1400)
      } catch {
        setCopiedActionId(null)
      }
      return
    }

    if (action.type === "scroll" && action.href) {
      const target = document.querySelector(action.href)
      if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      return
    }

    if (action.type === "prompt" && action.value) {
      window.dispatchEvent(new CustomEvent("open-bob-chat", { detail: { message: action.value } }))
      return
    }

    if (action.href) {
      if (action.type === "mailto" || action.type === "tel") {
        window.location.href = action.href
        return
      }

      window.open(action.href, "_blank", "noopener,noreferrer")
    }
  }, [])

  const sendMessage = useCallback(
      async (content: string) => {
        const normalizedContent = content.trim()
        if (!normalizedContent || isLoading) return

        if (chatServiceStatus !== "connected") {
          const assistantMessage: ChatMessage = {
            role: "assistant",
            content:
              "Bob is initializing secure API connectivity right now. Please wait a few seconds and try again.",
          }

          messagesRef.current = [...messagesRef.current, assistantMessage]

          if (isMountedRef.current) {
            setMessages(messagesRef.current)
            setInput("")
          }

          return
        }


        const previousFlow = conversationFlowRef.current
        const shouldResetFlow = isSimpleGreeting(normalizedContent) && previousFlow.state !== "idle"

      const normalizedHistory = ensureStarterFirst(messagesRef.current)
      const priorMessages = clearHistoricalActions(normalizedHistory)
      const nonPersistentMessages = stripAssistantActions(priorMessages)
      const baseMessages = shouldResetFlow ? [{ ...starterMessage }] : nonPersistentMessages
      const nextMessages = [...baseMessages, { role: "user" as const, content: normalizedContent }]
      messagesRef.current = nextMessages

        if (shouldResetFlow) {
          const idleFlow: ConversationFlow = {
            state: "idle",
            userClassification: null,
            hasCompany: false,
            hasRole: false,
            hasRecruiterEmail: false,
            hasRecruiterPhone: false,
            cvType: "general",
          }

        conversationFlowRef.current = idleFlow
        if (isMountedRef.current) {
          setConversationFlow(idleFlow)
        }
      }

      if (isMountedRef.current) {
        setMessages(nextMessages)
        setInput("")
        setCopiedActionId(null)
        setIsLoading(true)
      }

      const history = nextMessages.slice(-9, -1)
      let data: { reply?: string; error?: string } | null = null
      let attempt = 0

      while (!data?.reply && isMountedRef.current && attempt < CHAT_MAX_ATTEMPTS) {
        const controller = new AbortController()
        const timeoutId = window.setTimeout(() => controller.abort(), CHAT_REQUEST_TIMEOUT_MS)

        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: normalizedContent,
              history,
            }),
            signal: controller.signal,
          })

          let nextData: { reply?: string; error?: string } = {}
          try {
            nextData = (await response.json()) as { reply?: string; error?: string }
          } catch {
            nextData = {}
          }

          if (response.ok && nextData.reply) {
            data = nextData
            break
          }
        } catch {
        } finally {
          window.clearTimeout(timeoutId)
        }

        attempt += 1
        if (attempt < CHAT_MAX_ATTEMPTS) {
          const retryDelay = Math.min(CHAT_RETRY_BASE_DELAY_MS * Math.max(1, attempt), CHAT_RETRY_MAX_DELAY_MS)
          await sleep(retryDelay)
        }
      }

        if (!data?.reply) {
          const assistantMessage: ChatMessage = {
            role: "assistant",
            content:
              "I might not have the perfect answer for that, but you can connect directly with Ankan — he’d be happy to help.",
            actions: [{ id: "fallback-linkedin", label: "Talk to Ankan", type: "link", href: LINKEDIN_URL }],
          }


        messagesRef.current = [...messagesRef.current, assistantMessage]

        if (isMountedRef.current) {
          setMessages(messagesRef.current)
          setIsLoading(false)
        }
        return
      }

        const recentUserMessages = nextMessages
          .filter((item) => item.role === "user")
          .slice(-4)
          .map((item) => item.content)
        const nextFlow = inferConversationFlow(recentUserMessages)
        conversationFlowRef.current = nextFlow

        if (isMountedRef.current) {
          setConversationFlow(nextFlow)
        }

          const recruiterJustProvidedCompany =
            previousFlow.state === "recruiter_verification_pending" &&
            nextFlow.state === "recruiter_company_provided" &&
            nextFlow.hasCompany &&
            !nextFlow.hasRole

          const recruiterJustVerified =
            previousFlow.state !== "recruiter_verified" &&
            nextFlow.state === "recruiter_verified" &&
            nextFlow.hasCompany &&
            nextFlow.hasRole

            const computedReply = recruiterJustProvidedCompany
              ? "Thanks for sharing that. One of his strongest builds is LPU Smart Campus — a production-grade system with 200+ APIs and real-time workflows. What kind of role or opportunity are you hiring for? I can tailor relevant insights for you."
              : recruiterJustVerified
                ? "Thanks for sharing that. I can share a tailored resume based on the role — would you like me to send it over? I can also highlight the most relevant projects."
                : nextFlow.state === "recruiter_verification_pending"
                  ? "Happy to share relevant details — just let me know your company."
                  : data.reply


        const actions = buildActions(computedReply, normalizedContent, recentUserMessages, nextFlow)
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: sanitizeAssistantMessage(computedReply, actions, normalizedContent),
          actions,
        }

      messagesRef.current = [...messagesRef.current, assistantMessage]

      if (isMountedRef.current) {
        setMessages(messagesRef.current)
        setIsLoading(false)
      }
    },
      [chatServiceStatus, isLoading],
    )



  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await sendMessage(input)
  }

  useEffect(() => {
    const handleOpenAndSend = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>
      const presetMessage = customEvent.detail?.message?.trim()

      setIsOpen(true)

      if (presetMessage) {
        void sendMessage(presetMessage)
      }
    }

    window.addEventListener("open-bob-chat", handleOpenAndSend)

    return () => {
      window.removeEventListener("open-bob-chat", handleOpenAndSend)
    }
  }, [sendMessage])

  return (
    <div className="fixed bottom-5 right-5 z-[80] sm:bottom-6 sm:right-6">
      {isOpen ? (
        <div className="pointer-events-auto absolute bottom-16 right-0 w-[calc(100vw-2rem)] max-h-[78svh] max-h-[78dvh] max-w-sm overflow-hidden rounded-2xl border border-cyan-100/35 bg-slate-950/88 shadow-[0_20px_90px_rgba(0,0,0,0.6)] backdrop-blur-xl">

          <div className="flex items-center justify-between border-b border-cyan-100/20 bg-gradient-to-r from-cyan-500/15 via-violet-500/15 to-cyan-500/15 px-4 py-3">
              <div className="flex items-center gap-2">
                <Image
                  src="https://img.icons8.com/?size=100&id=3PpdcD5EjxqM&format=png&color=000000"
                  alt="Bob chatbot"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                  unoptimized
                />
                  <div>

                    <p className="font-space text-sm font-semibold text-slate-50">Bob</p>


                  <p
                    className={`text-[10px] uppercase tracking-[0.12em] ${
                      chatServiceStatus === "connected"
                        ? "text-emerald-300/90"
                        : chatServiceStatus === "checking"
                          ? "text-cyan-200/80"
                          : "text-rose-300/85"
                    }`}
                  >
                    {chatServiceStatus === "connected"
                      ? "API Connected"
                      : chatServiceStatus === "checking"
                        ? "Connecting API"
                        : "API Offline"}
                  </p>
                </div>

            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md border border-cyan-100/20 bg-slate-900/40 p-1.5 text-cyan-100/85 transition hover:border-cyan-100/40 hover:text-cyan-100"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

            <div ref={chatViewportRef} className="h-[min(21rem,62svh)] h-[min(21rem,62dvh)] space-y-3 overflow-y-auto px-3 py-3 [overscroll-behavior:contain]">
                {messages.map((message, index) => {
                    return (
                      <div key={`${message.role}-${index}`} className={`max-w-[92%] ${message.role === "user" ? "ml-auto" : "mr-auto"}`}>
                        <div
                          className={`rounded-xl border px-3 py-2 text-sm leading-relaxed ${
                            message.role === "user"
                              ? "border-cyan-300/35 bg-cyan-300/15 text-cyan-50"
                              : "border-violet-200/25 bg-violet-400/12 text-slate-100"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>

                        {message.role === "assistant" && message.actions && message.actions.length > 0 ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {message.actions.map((action) => {
                              const isCopied = copiedActionId === action.id
                              const label = isCopied ? "Copied" : action.label

                              const icon = action.type === "mailto"
                                ? <Mail className="h-3.5 w-3.5" />
                                : action.type === "tel"
                                  ? <Phone className="h-3.5 w-3.5" />
                                  : action.type === "copy"
                                    ? <Copy className="h-3.5 w-3.5" />
                                    : action.label.toLowerCase().includes("resume")
                                      ? <Download className="h-3.5 w-3.5" />
                                      : <ArrowUpRight className="h-3.5 w-3.5" />

                              return (
                                <button
                                  key={`${message.role}-${index}-${action.id}`}
                                  type="button"
                                  onClick={() => void runAction(action)}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-100/30 bg-slate-900/55 px-2.5 py-1.5 text-[11px] uppercase tracking-[0.11em] text-cyan-100 transition hover:border-cyan-100/60 hover:bg-cyan-300/14 active:scale-[0.98]"
                                >
                                  {icon}
                                  {label}
                                </button>
                              )
                            })}
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
              {isLoading ? (
                <div className="mr-auto inline-flex items-center gap-2 rounded-xl border border-violet-200/25 bg-violet-400/12 px-3 py-2 text-sm text-slate-100">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-200" />
                  Thinking...
                </div>
              ) : null}
            </div>


          <form onSubmit={handleSubmit} className="border-t border-cyan-100/20 p-3">
            <div className="flex items-center gap-2 rounded-xl border border-cyan-100/20 bg-slate-900/45 px-2 py-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={
                    chatServiceStatus === "connected"
                      ? "Ask about Ankan's work..."
                      : chatServiceStatus === "checking"
                        ? "Connecting Bob securely..."
                        : "Bob is currently offline"
                  }
                  className="w-full bg-transparent px-1 text-sm text-slate-100 outline-none placeholder:text-slate-400"
                  maxLength={1200}
                  disabled={chatServiceStatus !== "connected"}
                />

              <button
                type="submit"
                disabled={!canSend}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-100/30 bg-cyan-300/15 text-cyan-100 transition hover:border-cyan-100/55 hover:bg-cyan-300/25 disabled:cursor-not-allowed disabled:opacity-45"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="pointer-events-auto ml-auto inline-flex flex-col items-center gap-1.5 text-cyan-50 transition hover:scale-110"
        aria-label={isOpen ? "Close portfolio chatbot" : "Open portfolio chatbot"}
      >
        {isOpen ? (
          <X className="h-7 w-7" />
        ) : (
          <>
            <span className="rounded-md border border-cyan-200/35 bg-slate-950/82 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
              Ask Bob
            </span>
            <Image
              src="https://img.icons8.com/?size=100&id=3PpdcD5EjxqM&format=png&color=000000"
              alt="Open chatbot"
              width={68}
              height={68}
              className="h-[68px] w-[68px] drop-shadow-[0_14px_26px_rgba(8,145,178,0.58)]"
              unoptimized
            />
          </>
        )}
      </button>
    </div>
  )
}
