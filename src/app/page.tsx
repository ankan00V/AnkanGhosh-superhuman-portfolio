"use client"

import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import { MouseEvent, useCallback, useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, ArrowUpRight, Download, Github, X } from "lucide-react"
import { CyberBackground } from "@/components/cyber-background"
import { ModuleIllustration } from "@/components/module-illustration"
import { PersonalChatWidget } from "@/components/personal-chat-widget"

const featuredSystems = [
    {
      name: "LPU Smart Campus",
      date: "PRODUCTION SYSTEM",
      tag: "Enterprise academic operations platform",
      bannerUrl: "https://drive.google.com/uc?export=view&id=1X9biM1rBr69Y5NiCes8XKllvCASb_NT-",

      summary:
        "Built a full-stack smart campus platform covering attendance, academics, and administration with secure identity workflows and large-scale API integration.",
      capabilities: [
        "Face-verified attendance with OTP and MFA support",
        "6+ core workflows across student and faculty operations",
        "Role-based access and production-grade backend services",
      ],
      architecture: ["FastAPI", "PostgreSQL", "Redis", "React", "Docker", "RBAC"],
      highlights: [
        "200+ APIs designed for modular campus operations",
        "Reduced manual overhead with centralized digital workflows",
        "Optimized reliability and consistency across user roles",
      ],
      links: [{ label: "View GitHub", href: "https://github.com/ankan00V/LPU-smart-campus" }],
    },
    {
      name: "Vidya Verse",
      date: "AI INTELLIGENCE ENGINE",
      tag: "Opportunity discovery and ranking",
      bannerUrl: "https://drive.google.com/uc?export=view&id=1GhJBn15kviFyASqgGtJIAIBWINCtp6dZ",

      summary:
        "Developed an AI-driven opportunity intelligence system that aggregates and scores opportunities from multiple sources for faster discovery and action.",
      capabilities: [
        "Ingests 14+ data sources with automated processing",
        "Processes ~250+ opportunities per run",
        "AI-assisted ranking and relevance scoring pipeline",
      ],
      architecture: ["Python", "NLP", "Scheduling", "ETL", "Vector Search", "Analytics"],
      highlights: [
        "Improved discovery speed with unified intelligence feeds",
        "Normalized and deduplicated multi-source records",
        "Prioritized high-value opportunities for decision-making",
      ],
      links: [{ label: "View GitHub", href: "https://github.com/ankan00V/Ivy-League-Portal" }],
    },
    {
      name: "SATYQ Core",
      date: "MULTIMODAL AI",
      tag: "Quality analysis and reasoning system",
      bannerUrl: "https://drive.google.com/uc?export=view&id=1giMq4iAjWWP5kbz0u1Llw_fwVLV5-4qP",

      summary:
        "Engineered a multimodal quality intelligence platform for defect identification, anomaly analysis, and AI-assisted root-cause reasoning.",
      capabilities: [
        "Visual defect detection across diverse quality contexts",
        "Anomaly analysis workflows for operational diagnostics",
        "AI-assisted reasoning for explainable quality decisions",
      ],
      architecture: ["PyTorch", "Computer Vision", "Inference APIs", "Monitoring", "MLOps", "Dashboards"],
      highlights: [
        "Improved consistency in quality review outcomes",
        "Enabled faster investigation of non-conformance signals",
        "Built extensible foundation for advanced AI QA workflows",
      ],
      links: [{ label: "View GitHub", href: "https://github.com/ankan00V/SATYQ-CORE-QualityControlChatbot" }],
    },
]

const heroFloatingIcons = [
  {
    src: "https://img.icons8.com/?size=100&id=B0YxODenuYvG&format=png&color=000000",
    className: "left-6 top-6 h-9 w-9 md:left-10 md:top-8",
    animate: { y: [0, -14, 0], x: [0, 8, 0], rotate: [0, 8, 0], opacity: [0.42, 0.8, 0.42] },
    transition: { duration: 6.4, repeat: Infinity, ease: "easeInOut" as const },
  },
  {
    src: "https://img.icons8.com/?size=100&id=ll1Ce1YeVoWc&format=png&color=000000",
    className: "right-8 top-8 h-10 w-10 md:right-12 md:top-10",
    animate: { y: [0, 10, 0], x: [0, -8, 0], rotate: [0, -10, 0], opacity: [0.4, 0.75, 0.4] },
    transition: { duration: 6.9, repeat: Infinity, ease: "easeInOut" as const, delay: 0.35 },
  },
  {
    src: "https://img.icons8.com/?size=100&id=HshIQgiZ35nI&format=png&color=000000",
    className: "left-10 bottom-8 h-10 w-10 md:left-16 md:bottom-10",
    animate: { y: [0, -9, 0], x: [0, 7, 0], rotate: [0, 9, 0], opacity: [0.4, 0.76, 0.4] },
    transition: { duration: 7.3, repeat: Infinity, ease: "easeInOut" as const, delay: 0.7 },
  },
  {
    src: "https://img.icons8.com/?size=100&id=B0YxODenuYvG&format=png&color=000000",
    className: "right-10 bottom-9 h-8 w-8 md:right-16 md:bottom-11",
    animate: { y: [0, 11, 0], x: [0, -6, 0], rotate: [0, -7, 0], opacity: [0.38, 0.72, 0.38] },
    transition: { duration: 6.1, repeat: Infinity, ease: "easeInOut" as const, delay: 0.2 },
  },
  {
    src: "https://img.icons8.com/?size=100&id=ll1Ce1YeVoWc&format=png&color=000000",
    className: "left-1/2 top-4 h-8 w-8 -translate-x-1/2 md:top-5",
    animate: { y: [0, -8, 0], rotate: [0, 7, 0], opacity: [0.36, 0.66, 0.36] },
    transition: { duration: 5.8, repeat: Infinity, ease: "easeInOut" as const, delay: 0.45 },
  },
  {
    src: "https://img.icons8.com/?size=100&id=HshIQgiZ35nI&format=png&color=000000",
    className: "left-1/2 bottom-4 h-9 w-9 -translate-x-1/2 md:bottom-5",
    animate: { y: [0, 8, 0], rotate: [0, -7, 0], opacity: [0.36, 0.68, 0.36] },
    transition: { duration: 6.6, repeat: Infinity, ease: "easeInOut" as const, delay: 0.55 },
  },
]

const sectionOrder = [
    {
      id: "about",
      label: "About",
      title: "Ankan Ghosh",
      subtitle: "Engineer building full-stack, data-driven systems powered by AI/ML",
      points: [
        "I develop end-to-end, production-ready applications integrating machine learning, scalable backend systems, and data pipelines.",
        "Focused on solving real-world problems through intelligent, deployable systems.",
        "Certified in AI & Data Science with 13+ certifications.",
        "Rank 2 — AlgoUniversity Graph Camp (Top 50 out of 40,000+).",
      ],
      links: [{ label: "Download Resume", href: "/resume-software-engineering.pdf", icon: Download }],
    },
  {
    id: "experience",
    label: "Experience",
    title: "IT Analyst Intern - Eastern Coalfields Limited",
    subtitle: "Government of India",
    points: [
      "Managed enterprise data pipelines and improved data accuracy by 15%.",
      "Built analytics dashboards using Power BI for operational visibility.",
      "Worked with SAP enterprise data systems.",
      "Improved reporting efficiency by 20%.",
    ],
      links: [{ label: "View More", href: "https://www.linkedin.com/posts/ghoshankan_internship-itintern-sql-activity-7354078927973216257-YVjV?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEX-hx8Bkh-iCdmLGlnji8vahv0p2S56csI", icon: ArrowUpRight }],
  },
  {
    id: "projects",
    label: "Projects",
    title: "Featured Systems",
    subtitle: "Production-oriented AI and data platforms",
      points: [
        "LPU Smart Campus: full-stack platform with face-verified attendance, OTP/MFA, 6+ workflows, and 200+ APIs.",
        "Vidya Verse: AI opportunity intelligence engine with 14+ sources and ~250+ items/run processing.",
        "SATYQ Core: multimodal quality analysis with defect detection, anomaly analysis, and AI-assisted reasoning.",
      ],
    links: [{ label: "GitHub", href: "https://github.com/ankan00V", icon: Github }],
  },
  {
    id: "skills",
    label: "Skills",
    title: "Technical Skills",
    subtitle: "Tech Arsenal",
      points: [
        "Languages: Python, C++, SQL.",
        "Machine Learning: Scikit-learn, TensorFlow, PyTorch, OpenCV, Hugging Face.",
        "Backend/Data: FastAPI, Flask, Django, PostgreSQL, MongoDB, Redis, Hadoop.",
        "Infra/Analytics: Docker, Kubernetes, CI/CD, Tableau, Power BI, Matplotlib, Seaborn.",
      ],
    links: [{ label: "GitHub Repositories", href: "https://github.com/ankan00V", icon: ArrowUpRight }],
  },
  {
    id: "education",
    label: "Education",
    title: "Computer Science Engineer | Data Science Minor",
    subtitle: "Lovely Professional University",
    points: [
      "CGPA: 8.0 / 10.",
      "Building production-grade AI systems and scalable backend architectures.",
      "Developed real-world, end-to-end applications combining machine learning and full-stack engineering.",
      "Focused on solving practical problems through intelligent, deployment-ready systems.",
    ],
    links: [{ label: "View Achievements", href: "#achievements", icon: ArrowUpRight }],
  },
      {
        id: "certifications",
        label: "Certifications",
        title: "Professional Certifications",
        subtitle: "Tech Arsenal",
      points: [
        "Oracle Cloud Infrastructure 2025 Certified Data Science Professional | Oracle",
        "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional | Oracle",
        "Oracle Certified Associate - Java SE 8 | Oracle",
        "Databricks Accredited Generative AI Fundamentals | Databricks",
        "Oracle AI Vector Search Certified Professional | Oracle",
        "Oracle Autonomous Database Cloud Certified Professional | Oracle",
      ],
      links: [{ label: "View Full Profile", href: "https://www.linkedin.com/in/ghoshankan/details/certifications/", icon: ArrowUpRight }],
    },
  {
    id: "achievements",
    label: "Achievements and Accreditations",
    title: "Achievements and Accreditations",
    subtitle: "Independent recognitions and career accelerators",
    points: [],
    links: [],
  },
]

const certificationItems = [
    {
      title: "Oracle Cloud Infrastructure 2025 Certified Data Science Professional",
      issuer: "Oracle",
      certificateImageUrl:
        "https://media.licdn.com/dms/image/v2/D562DAQFvt73P7LXNGw/profile-treasury-document-cover-images_480/B56ZfvrNrSGoBM-/0/1752072776552?e=1775844000&v=beta&t=mQFmzJbyJCbNVeiE3wXUvHF8BbJo2vU795Bm5viy45s",
      verifyUrl:
        "https://catalog-education.oracle.com/ords/certview/sharebadge?id=8A9407DE2F864DB914C5354E951F195AADCACA9C27739096E853AB55940D953D",
    },
    {
      title: "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional",
      issuer: "Oracle",
      certificateImageUrl:
        "https://media.licdn.com/dms/image/v2/D562DAQF3c8U20ViYSw/profile-treasury-document-cover-images_480/B56Zfz4QQKHcBM-/0/1752143302098?e=1775844000&v=beta&t=1u0WhnTzier91jIHA78oZircSilMKOpCn7pZmWxwTU8",
      verifyUrl:
        "https://catalog-education.oracle.com/ords/certview/sharebadge?id=59F1CF46A227CC88A89F81C0C41503122601EAC1AEC9D60C7968ACD554A615AE",
    },
    {
      title: "Oracle Certified Associate - Java SE 8",
      issuer: "Oracle",
      certificateImageUrl:
        "https://media.licdn.com/dms/image/v2/D562DAQGmmda8BcGb3w/profile-treasury-document-cover-images_480/B56ZX_OJyIHQAw-/0/1743743658886?e=1775844000&v=beta&t=zwQt4KXkrquJy_7OYdlEpM5cZvJivCuP4dpWx5KuEvE",
      verifyUrl:
        "https://catalog-education.oracle.com/ords/certview/sharebadge?id=5B38610EC59B7E4DBC03ED8A5415455AACFE937666E73591DB490CB6DA72E76A",
    },
    {
      title: "Databricks Accredited Generative AI Fundamentals",
      issuer: "Databricks",
      certificateImageUrl:
        "https://media.licdn.com/dms/image/v2/D562DAQEo452yjHwYMg/profile-treasury-document-cover-images_480/B56Za9qlWGH0A0-/0/1746938780304?e=1775844000&v=beta&t=bxQ6C0PNjiIo5HQGVIcsKm7Ogl6sJvatC6Uf9YPSWv4",
      verifyUrl: "https://credentials.databricks.com/aa1da4cf-a36b-4ad7-9a10-2cbaa8400584#acc.acJIv4mw",
    },
    {
      title: "Oracle AI Vector Search Certified Professional",
      issuer: "Oracle",
      certificateImageUrl:
        "https://media.licdn.com/dms/image/v2/D562DAQH2-8Y8kuu0PQ/profile-treasury-document-cover-images_480/B56ZXI9LF0HoA8-/0/1742833237248?e=1775844000&v=beta&t=XncxLE_B2ej_q49N_or1ylp_B1kbI4-ZnfrHwy6dJ_s",
      verifyUrl:
        "https://catalog-education.oracle.com/ords/certview/sharebadge?id=B72792E952C7309416233D2A2C683E55FC6800BBF1FB9FB03A782CFE0C008C7D",
    },
    {
      title: "Oracle Autonomous Database Cloud Certified Professional",
      issuer: "Oracle",
      certificateImageUrl:
        "https://media.licdn.com/dms/image/v2/D562DAQHGpveoHwYpDg/profile-treasury-document-cover-images_480/B56Zlx9CK6I0BI-/0/1758553452193?e=1775844000&v=beta&t=uJ-yRPehgo9fTpL_lwk-3WTeqv_OSl3vvPI0nZOJTA4",
      verifyUrl:
        "https://catalog-education.oracle.com/ords/certview/sharebadge?id=5A143C56ED732A14792B0EB3FB5A46F153DED15BB66C76B9761606A45B210AB1",
    },
]

const resumeOptions = [
  {
    title: "Software Engineering",
    description: "Backend, systems, and scalable applications",
    fileUrl: "/AnkanGhosh_CV_SDE.pdf",
    fileName: "AnkanGhosh_CV_SDE.pdf",
  },
  {
    title: "Data Science & AI",
    description: "Machine learning, analytics, and modeling",
    fileUrl: "/ankanghosh_cv.pdf",
    fileName: "ankanghosh_cv.pdf",
  },
]

const profilePhotoUrl =
  "https://media.licdn.com/dms/image/v2/D5603AQEPVi0W1l1rLw/profile-displayphoto-scale_400_400/B56ZxBVcHHKcAk-/0/1770622667300?e=1776902400&v=beta&t=KnWyY32c8GbBhM7ENHliNy26Mkt3XohmGX7Ww4uhE90"

const experienceCertificate = {
  title: "IT Analyst Intern Completion Certificate",
  issuer: "Eastern Coalfields Limited",
  certificateImageUrl:
    "https://media.licdn.com/dms/image/v2/D562DAQFoMMTjRZTbKA/profile-treasury-image-shrink_480_480/B56ZjauXbfH8AM-/0/1756016248136?e=1775844000&v=beta&t=h7lWFu2_9SrrYNkFp20c6YpNaGgv9vcXrJcgwC-kNew",
}

const achievementItems = [
  {
    title: "AlgoUniversity Graph Camp — Rank 2",
    issuer: "AlgoUniversity",
    logoUrl: "https://d1lrk9cp1c3gxw.cloudfront.net/static/newlanding/logo.png",
    certificateImageUrl: "https://d3uam8jk4sa4y4.cloudfront.net/static/certificates/graph_camp/ankan-ghosh.png",
    points: [
      "Selected among 40,000+ applicants across India.",
      "Ranked 2nd at Lovely Professional University in the flagship accelerator program.",
      "Mentored under engineers from Apple and Google.",
    ],
    links: [
      {
        label: "View Certificate",
        href: "https://d3uam8jk4sa4y4.cloudfront.net/static/certificates/graph_camp/ankan-ghosh.png",
      },
      {
        label: "Verify",
        href: "https://drive.google.com/file/d/1RbPheAzXabYeh_2JgbNZLUsbbPwIpLin/view?usp=sharing",
      },
    ],
  },
  {
    title: "McKinsey Forward Program",
    issuer: "McKinsey & Company",
    logoUrl: "https://media.licdn.com/dms/image/v2/D5610AQH-PLyt9OKifw/videocover-high/B56Zl4AEYzJoB0-/0/1758654917086/LI_AnthemvideowithLogomp4?e=2147483647&v=beta&t=3seNWYpOpUYrWqxLdFIAnZPSsVlHmaYKvdmGJPp2ieU",
    certificateImageUrl:
      "https://media.licdn.com/dms/image/v2/D562DAQGxFtNKmdTySQ/profile-treasury-document-cover-images_480/B56ZfizDj0HUA0-/0/1751856726043?e=1775847600&v=beta&t=CbjoZ0B9U5xIkf7ZRrDOMIIQJF0itWkqdSu5GCg0GLk",
    points: [
      "Selected for the McKinsey Forward Program.",
      "Successfully completed the full program curriculum.",
      "Strengthened practical leadership, problem-solving, and professional execution skills.",
    ],
    links: [
      {
        label: "View Certificate",
        href: "https://media.licdn.com/dms/image/v2/D562DAQGxFtNKmdTySQ/profile-treasury-document-cover-images_480/B56ZfizDj0HUA0-/0/1751856726043?e=1775847600&v=beta&t=CbjoZ0B9U5xIkf7ZRrDOMIIQJF0itWkqdSu5GCg0GLk",
      },
      {
        label: "Verify Link",
        href: "https://www.credly.com/badges/b7227443-0738-4604-a3cd-fb8158361934/public_url",
      },
    ],
  },
]

const technicalSkillCategories = [
  {
    title: "Languages",
    skills: [
      { name: "Python", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "C++", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
      { name: "SQL", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
    ],
  },
  {
    title: "Machine Learning",
    skills: [
      {
        name: "Scikit-learn",
        logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
      },
      { name: "TensorFlow", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
      { name: "PyTorch", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
        { name: "OpenCV", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg" },
        { name: "Hugging Face", logoUrl: "https://cdn.simpleicons.org/huggingface/FFCC4D" },
    ],
  },
  {
    title: "Backend / Data",
    skills: [
      { name: "FastAPI", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
      { name: "Flask", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
      { name: "Django", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
      {
        name: "PostgreSQL",
        logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
      },
      { name: "MongoDB", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
        { name: "Redis", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
        { name: "Hadoop", logoUrl: "https://cdn.simpleicons.org/apachehadoop/66CCFF" },
    ],
  },
  {
    title: "Infra / Analytics",
    skills: [
      { name: "Docker", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
      {
        name: "Kubernetes",
        logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
      },
      {
        name: "CI/CD",
        logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg",
      },
      { name: "Tableau", logoUrl: "https://img.icons8.com/?size=100&id=9Kvi1p1F0tUo&format=png&color=000000" },
        { name: "Power BI", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg" },
      {
        name: "Matplotlib",
        logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg",
      },
      { name: "Seaborn", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    ],
  },
]

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
}

const heroMotion = {
  headline: {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.34, ease: "easeOut", delay: 0.05 } },
  },
  name: {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.52, ease: "easeOut", delay: 0.2 } },
  },
  role: {
    hidden: { opacity: 0, y: 12, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.72, ease: "easeOut", delay: 0.38 } },
  },
}

export default function Home() {
  const [activeModule, setActiveModule] = useState(sectionOrder[0]?.id ?? "about")
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false)
  const [activeFeaturedProjectIndex, setActiveFeaturedProjectIndex] = useState(0)
  const [autoGlidePausedUntil, setAutoGlidePausedUntil] = useState(0)
  const autoGlideResumeTimeoutRef = useRef<number | null>(null)
  const [progressAnimationKey, setProgressAnimationKey] = useState(0)
  const [activeSkillKey, setActiveSkillKey] = useState<string | null>(null)
  const [activeCertificationIndex, setActiveCertificationIndex] = useState<number | null>(null)
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
  const [isExperienceCertificateModalOpen, setIsExperienceCertificateModalOpen] = useState(false)
  const [activeAchievementCertificateIndex, setActiveAchievementCertificateIndex] = useState<number | null>(null)
  const activeCertification = activeCertificationIndex !== null ? certificationItems[activeCertificationIndex] : null
  const activeAchievementCertificate =
    activeAchievementCertificateIndex !== null ? achievementItems[activeAchievementCertificateIndex] : null
  const currentYear = new Date().getFullYear()
  const shouldReduceMotion = useReducedMotion()

  const featuredProjectCount = featuredSystems.length
  const isProjectsSectionActive = activeModule === "projects"
  const isAutoGlidePaused = Date.now() < autoGlidePausedUntil
  const handleContactClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    window.dispatchEvent(
      new CustomEvent("open-bob-chat", {
        detail: { message: "hey bob i want to connect with ankan" },
      }),
    )
  }, [])

  const navSections = [...sectionOrder, { id: "contact", label: "Contact" }]
  const activeProjectSystem = featuredSystems[activeFeaturedProjectIndex]

  const pauseAutoGlide = useCallback(() => {
    const resumeAt = Date.now() + 8000
    setAutoGlidePausedUntil(resumeAt)
    setProgressAnimationKey((key) => key + 1)

    if (autoGlideResumeTimeoutRef.current !== null) {
      window.clearTimeout(autoGlideResumeTimeoutRef.current)
    }

    autoGlideResumeTimeoutRef.current = window.setTimeout(() => {
      setAutoGlidePausedUntil(0)
      setProgressAnimationKey((key) => key + 1)
      autoGlideResumeTimeoutRef.current = null
    }, 8000)
  }, [])

  const handleNextProject = useCallback(() => {
    pauseAutoGlide()
    setActiveFeaturedProjectIndex((currentIndex) => (currentIndex + 1) % featuredProjectCount)
  }, [featuredProjectCount, pauseAutoGlide])

  const handlePreviousProject = useCallback(() => {
    pauseAutoGlide()
    setActiveFeaturedProjectIndex((currentIndex) => (currentIndex - 1 + featuredProjectCount) % featuredProjectCount)
  }, [featuredProjectCount, pauseAutoGlide])

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = "manual"

    const resetToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname)
    }

    const firstFrame = window.requestAnimationFrame(() => {
      resetToTop()
      window.requestAnimationFrame(resetToTop)
    })

    return () => {
      window.cancelAnimationFrame(firstFrame)
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveModule(entry.target.id)
          }
        })
      },
      { root: null, rootMargin: "-46% 0px -46% 0px", threshold: 0.01 },
    )

    const observedIds = [...sectionOrder.map((section) => section.id), "contact"]
    const elements = observedIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element))

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let raf = 0

    const syncScrollState = () => {
      raf = 0
      const nextValue = window.scrollY > 24
      setHasScrolledPastHero((currentValue) => (currentValue === nextValue ? currentValue : nextValue))
    }

    const onScroll = () => {
      if (raf !== 0) {
        return
      }

      raf = window.requestAnimationFrame(syncScrollState)
    }

    syncScrollState()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      if (raf !== 0) {
        window.cancelAnimationFrame(raf)
      }

      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  useEffect(() => {
    if (!isProjectsSectionActive || isAutoGlidePaused) {
      return
    }

    setProgressAnimationKey((key) => key + 1)

    const glideInterval = window.setInterval(() => {
      setActiveFeaturedProjectIndex((currentIndex) => (currentIndex + 1) % featuredProjectCount)
      setProgressAnimationKey((key) => key + 1)
    }, 3500)

    return () => window.clearInterval(glideInterval)
  }, [featuredProjectCount, isAutoGlidePaused, isProjectsSectionActive])

  useEffect(() => {
    return () => {
      if (autoGlideResumeTimeoutRef.current !== null) {
        window.clearTimeout(autoGlideResumeTimeoutRef.current)
      }
    }
  }, [])

  return (
    <main className="relative min-h-[100svh] min-h-[100dvh] overflow-x-clip scroll-smooth text-slate-100 md:supports-[scroll-snap-type:y_mandatory]:snap-y md:supports-[scroll-snap-type:y_mandatory]:snap-mandatory supports-[scroll-snap-type:y_mandatory]:overscroll-y-none">
      <CyberBackground freezeMotion={Boolean(shouldReduceMotion)} />


      <section className="relative z-30 flex min-h-[100svh] min-h-[100dvh] snap-start md:snap-always items-start justify-center overflow-hidden px-5 pb-14 pt-[11dvh] sm:px-6 md:px-12 md:pb-16 md:pt-[11dvh] lg:px-20">
                  <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="show"
                    className="relative mx-auto flex w-full max-w-5xl flex-col items-center overflow-hidden rounded-3xl bg-slate-950/28 px-6 py-8 text-center shadow-[0_0_34px_rgba(34,211,238,0.14)] backdrop-blur-md md:px-10 md:py-10"
                  >
                    <div className="pointer-events-none absolute inset-0">
                      {heroFloatingIcons.map((icon, index) => (
                        <motion.span
                          key={`hero-floating-icon-${index}`}
                          className={`absolute ${icon.className}`}
                          animate={icon.animate}
                          transition={icon.transition}
                        >
                          <Image
                            src={icon.src}
                            alt=""
                            width={44}
                            height={44}
                            className="h-full w-full opacity-70 mix-blend-screen"
                            unoptimized
                          />
                        </motion.span>
                      ))}
                    </div>
                    <h1 className="font-space relative z-10 max-w-5xl text-[clamp(1.55rem,5.4vw,4.2rem)] font-semibold leading-[1.07] tracking-tight [text-shadow:0_0_24px_rgba(34,211,238,0.18)] md:text-[clamp(1.95rem,5.7vw,4.9rem)]">
                      <motion.span
                        variants={heroMotion.headline}
                        initial="hidden"
                        animate="show"
                        className="block text-slate-50"
                      >
                        Welcome to
                      </motion.span>
                      <motion.span
                        variants={heroMotion.name}
                        initial="hidden"
                        animate="show"
                        className="mt-2 block text-[clamp(2rem,6.4vw,5.8rem)] text-red-500 md:mt-3"
                      >
                        Ankan&rsquo;s Portfolio
                      </motion.span>
                    </h1>
                  </motion.div>
        </section>

                <section id="systems" className="relative px-5 pb-0 pt-0 sm:px-6 md:px-12 md:pt-1 lg:px-20">
              <div className="mx-auto w-full max-w-6xl">
                      <div
                        className={`sticky top-3 z-20 mb-5 overflow-hidden rounded-2xl border border-cyan-100/25 bg-gradient-to-r from-slate-950/75 via-slate-900/70 to-slate-950/75 p-2 shadow-[0_0_34px_rgba(34,211,238,0.16)] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:top-4 md:mb-6 md:p-2.5 ${
                          hasScrolledPastHero
                            ? "pointer-events-auto translate-y-0 opacity-100"
                            : "pointer-events-none -translate-y-2 opacity-0"
                        }`}
                      >
                      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/60 to-transparent" />
                      <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-200/45 to-transparent" />
                        <div className="flex w-full items-center justify-between gap-1 lg:gap-2">


                      {navSections.map((section, index) => {
                        const isContactTab = section.id === "contact"

                        return (
                          <a
                            key={`nav-${section.id}`}
                            href={isContactTab ? "#" : `#${section.id}`}
                            onClick={isContactTab ? handleContactClick : undefined}
                                className={`group relative inline-flex min-w-0 flex-1 items-center justify-center gap-1 overflow-hidden rounded-lg border px-1.5 py-1.5 text-[9px] uppercase tracking-[0.11em] transition sm:px-2 sm:py-2 sm:text-[10px] md:gap-1.5 md:text-[11px] ${

                                activeModule === section.id
                                  ? "border-cyan-100/65 bg-gradient-to-r from-cyan-400/28 via-cyan-300/18 to-violet-300/24 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.3)]"
                                  : "border-cyan-100/20 bg-gradient-to-r from-slate-900/65 via-slate-900/45 to-slate-900/65 text-cyan-100/90 hover:border-cyan-100/50 hover:from-cyan-400/16 hover:via-violet-400/12 hover:to-cyan-300/14"
                              }`}

                          >
                            <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-200/0 via-cyan-200/10 to-violet-200/0 opacity-0 transition duration-200 group-hover:opacity-100" />
                              <span className="relative hidden text-cyan-100/70 xl:inline">{String(index + 1).padStart(2, "0")}</span>

                            <span className="relative truncate whitespace-nowrap">{section.label}</span>
                          </a>
                        )
                      })}
                    </div>
              </div>

                              {sectionOrder.map((section, index) => {
                                const isFinalContentSection = index === sectionOrder.length - 1
                                const isProjectsSection = section.id === "projects"
                                const isSectionActive = activeModule === section.id

                                  return (
                                            <motion.article
                                                key={section.id}
                                                id={section.id}
                                                initial={false}
                                                animate={{
                                                  opacity: isSectionActive ? 1 : 0.22,
                                                  y: isSectionActive ? 0 : 12,
                                                  scale: isSectionActive ? 1 : 0.988,
                                                  filter: isSectionActive ? "blur(0px)" : "blur(1.6px)",
                                                }}
                                                transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                                                      className={`group relative flex snap-start md:snap-always scroll-mt-20 md:scroll-mt-24 will-change-transform ${
                                                    isProjectsSection
                                                      ? "min-h-[calc(100svh-4.5rem)] min-h-[calc(100dvh-4.5rem)] items-center py-2 md:py-3"
                                                      : section.id === "about"
                                                        ? "min-h-[72svh] min-h-[72dvh] items-center py-4 md:py-6"
                                                        : isFinalContentSection
                                                          ? "min-h-fit items-center py-3 md:py-4"
                                                          : "min-h-[92svh] min-h-[92dvh] items-center py-4 md:min-h-[100svh] md:min-h-[100dvh] md:py-6"
                                                  }`}




                                    >
                              <div className="relative flex min-h-full w-full items-center">


                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/35 to-transparent" />

                          <motion.div
                            initial={{ opacity: 0, x: index % 2 === 0 ? -18 : 18, y: 10 }}
                            whileInView={{ opacity: 1, x: 0, y: 0 }}
                            viewport={{ once: true, amount: 0.12, margin: "-8% 0px -8% 0px" }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
  className={`tech-border relative w-full rounded-3xl border bg-gradient-to-br from-slate-950/52 via-slate-900/44 to-slate-950/52 p-5 shadow-[0_0_38px_rgba(34,211,238,0.14)] backdrop-blur-xl transition-[border-color,box-shadow,transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform md:p-6 ${
                                activeModule === section.id ? "border-cyan-100/50 shadow-[0_0_42px_rgba(34,211,238,0.2)]" : "border-cyan-100/26"
                              } ${isProjectsSection ? "md:sticky md:top-24" : ""}`}
                          >
                        <div className="absolute -right-10 top-8 hidden h-20 w-20 rounded-full bg-cyan-300/10 blur-2xl md:block" />
                        <div className="absolute -left-10 bottom-8 hidden h-20 w-20 rounded-full bg-violet-300/10 blur-2xl md:block" />

                          <div className="relative flex items-center gap-3">
                              <span className="h-2 w-2 rounded-full bg-cyan-200" />
                              <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-100/90">{section.label}</p>
                              <div className="h-px flex-1 bg-gradient-to-r from-cyan-200/35 to-transparent" />
                            </div>

<div className={`mt-3 grid gap-3 md:gap-4 ${section.id === "about" ? "grid-cols-1 items-center gap-y-4 lg:grid-cols-[minmax(0,1fr)_228px] lg:items-center lg:gap-x-10" : "grid-cols-1 items-start gap-y-3 sm:grid-cols-[minmax(0,1fr)_auto]"}`}>
                                        <div className="min-w-0 self-center">

                                              <h2
                                                className={`font-space tracking-tight text-slate-50 ${
                                                  section.id === "about"
                                                    ? "text-[2.15rem] font-extrabold leading-[1.03] sm:text-[2.5rem] md:text-[2.95rem] md:leading-[0.99] lg:text-[3.25rem] bg-gradient-to-r from-cyan-100 via-slate-50 to-violet-100 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(125,211,252,0.22)]"
                                                    : "text-[1.52rem] font-extrabold leading-[1.1] sm:text-[1.78rem] md:text-[2.08rem] lg:text-[2.3rem] bg-gradient-to-r from-cyan-100 via-slate-50 to-violet-100 bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(34,211,238,0.18)]"
                                                }`}
                                              >
                                              {section.title}
                                            </h2>
                                          <p
                                            className={`mt-1.5 max-w-2xl ${
                                              section.id === "about"
                                                ? "font-medium leading-relaxed text-cyan-50/95 sm:text-base md:text-[1.08rem] md:leading-relaxed lg:text-[1.15rem]"
                                                : "text-sm text-violet-100/90 md:text-[15px]"
                                            }`}
                                          >
                                            {section.subtitle}
                                          </p>
                                      </div>
                                          {section.id === "about" ? (
                                            <div className="profile-avatar profile-image-container relative mx-auto h-[170px] w-[170px] shrink-0 self-center sm:h-[186px] sm:w-[186px] md:h-[204px] md:w-[204px] lg:mx-0 lg:h-[228px] lg:w-[228px]">
                                            <div className="absolute inset-0 rounded-full bg-cyan-300/14 blur-xl" />
                                            <div className="relative h-full w-full overflow-hidden rounded-full border border-cyan-100/35 bg-slate-900/45 p-1.5 shadow-[0_0_24px_rgba(34,211,238,0.16)]">
                                              <div className="relative h-full w-full overflow-hidden rounded-full bg-slate-950/35">
                                                <Image
                                                  src={profilePhotoUrl}
                                                  alt="Ankan Ghosh profile photo"
                                                  fill
sizes="(max-width: 640px) 170px, (max-width: 768px) 186px, (max-width: 1024px) 204px, 228px"
                                                    className="h-full w-full object-cover object-[center_14%]"
                                                  unoptimized
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        ) : (




                                          <div
                                            className={`shrink-0 self-start opacity-95 sm:self-auto ${
                                              section.id === "experience"
                                                ? "h-[72px] w-[72px] sm:h-[76px] sm:w-[76px] md:h-[94px] md:w-[94px]"
                                                : "h-[74px] w-[74px] sm:h-[78px] sm:w-[78px] md:h-[102px] md:w-[102px]"
                                            }`}
                                          >

                                        {section.id === "education" ? (
                                          <Image
                                            src="https://upload.wikimedia.org/wikipedia/en/3/3a/Lovely_Professional_University_logo.png"
                                            alt="Lovely Professional University logo"
                                            width={88}
                                            height={88}
                                            className="h-full w-full object-contain"
                                            unoptimized
                                          />
                                            ) : section.id === "experience" ? (
                                              <div className="h-full w-full overflow-hidden rounded-2xl border border-cyan-100/30 bg-slate-900/55 p-1.5 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
                                                <div className="h-full w-full overflow-hidden rounded-xl border border-cyan-100/20 bg-slate-100/95 p-1">
                                                  <Image
                                                    src="https://media.licdn.com/dms/image/v2/C4D0BAQFcHnAj0BKPiQ/company-logo_100_100/company-logo_100_100/0/1631321153573?e=1776902400&v=beta&t=cEldxjLcRn3BN5EoRAI1jdR3L-T20YPrDdqXfq9gfm4"
                                                    alt="Eastern Coalfields Limited logo"
                                                    width={88}
                                                    height={88}
                                                    className="h-full w-full rounded-lg object-contain object-center"
                                                    unoptimized
                                                  />
                                                </div>
                                              </div>
                                            ) : (
                                              <ModuleIllustration moduleId={section.id} />
                                            )}
                                      </div>
                                  )}
                                </div>



                            {section.id === "projects" ? (
                              <div className="relative mt-4 space-y-3.5">
                                <div className="grid gap-2 sm:grid-cols-3">
                                  <div className="glass-card rounded-xl p-2.5">
                                    <p className="text-[10px] uppercase tracking-[0.16em] text-cyan-100/90">Systems Built</p>
                                    <p className="mt-0.5 font-space text-lg text-slate-50">3</p>
                                  </div>
                                  <div className="glass-card rounded-xl p-2.5">
                                    <p className="text-[10px] uppercase tracking-[0.16em] text-cyan-100/90">APIs Designed</p>
                                    <p className="mt-0.5 font-space text-lg text-slate-50">220+</p>
                                  </div>
                                  <div className="glass-card rounded-xl p-2.5">
                                    <p className="text-[10px] uppercase tracking-[0.16em] text-cyan-100/90">Validated Tests</p>
                                    <p className="mt-0.5 font-space text-lg text-slate-50">290+</p>
                                  </div>
                                </div>

                                <div className="rounded-xl border border-cyan-100/20 bg-slate-950/28 px-4 py-2.5">
                                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                                      <div className="space-y-0.5">
                                        <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/90">
                                          Featured Project {activeFeaturedProjectIndex + 1} of {featuredProjectCount}
                                        </p>
                                      </div>
                                    <div className="inline-flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={handlePreviousProject}
                                        className="inline-flex items-center gap-1 rounded-lg border border-cyan-100/30 bg-slate-900/50 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-cyan-100 transition hover:border-cyan-100/55 hover:bg-cyan-300/12"
                                      >
                                        <ArrowLeft className="h-3.5 w-3.5" />
                                        Previous
                                      </button>
                                      <button
                                        type="button"
                                        onClick={handleNextProject}
                                        className="inline-flex items-center gap-1 rounded-lg border border-cyan-100/30 bg-slate-900/50 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-cyan-100 transition hover:border-cyan-100/55 hover:bg-cyan-300/12"
                                      >
                                        Next
                                        <ArrowRight className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="mt-2 h-1.5 overflow-hidden rounded-full border border-cyan-100/20 bg-slate-900/70">
                                    <motion.div
                                      key={`${activeProjectSystem.name}-${progressAnimationKey}-${isAutoGlidePaused ? "paused" : "active"}`}
                                      initial={{ width: "0%", opacity: 0.55 }}
                                      animate={{
                                        width: isProjectsSectionActive && !isAutoGlidePaused ? "100%" : "0%",
                                        opacity: isProjectsSectionActive && !isAutoGlidePaused ? 0.95 : 0.45,
                                      }}
                                      transition={{ duration: 3.5, ease: "linear" }}
                                      className="h-full rounded-full bg-gradient-to-r from-cyan-200/80 via-cyan-300/90 to-violet-300/80"
                                    />
                                  </div>
                                </div>

                                  <motion.article
                                    key={activeProjectSystem.name}
                                    initial={{ opacity: 0, y: 10, scale: 0.995 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
                                    className="tech-border rounded-2xl bg-slate-900/14 p-3.5 md:p-4"
                                  >
                                  <div className="flex flex-wrap items-start justify-between gap-2">
                                    <div>
                                      <p className="text-[10px] uppercase tracking-[0.16em] text-cyan-100/75">
                                        SYS-{String(activeFeaturedProjectIndex + 1).padStart(2, "0")}
                                      </p>
                                      <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                        <h3 className="font-space text-base font-semibold text-slate-50 md:text-lg">{activeProjectSystem.name}</h3>
                                        <span className="text-[11px] uppercase tracking-[0.12em] text-violet-100/95">{activeProjectSystem.date}</span>
                                      </div>
                                      <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-violet-100/85">{activeProjectSystem.tag}</p>
                                    </div>
                                    <div className="rounded-lg border border-violet-200/30 bg-violet-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-violet-100">
                                      Featured System
                                    </div>
                                  </div>

                                  <div className="relative mt-2.5 overflow-hidden rounded-xl border border-cyan-100/20 bg-slate-950/35 p-1.5">
                                    <div className="relative h-24 w-full overflow-hidden rounded-lg bg-slate-900/65 md:h-28 lg:h-32">
                                      <Image
                                        src={activeProjectSystem.bannerUrl}
                                        alt={`${activeProjectSystem.name} banner`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 88vw, 900px"
                                        className="object-cover object-center"
                                        priority
                                      />
                                    </div>
                                  </div>

                                  <div className="mt-3 space-y-3">
                                    <p className="text-sm leading-relaxed text-slate-200/90 md:text-[13px]">{activeProjectSystem.summary}</p>

                                    <div className="grid items-stretch gap-3 md:grid-cols-3">
                                      <div className="flex h-full flex-col rounded-xl border border-cyan-100/15 bg-slate-950/24 backdrop-blur-sm p-3">
                                        <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/90">Core Capabilities</p>
                                        <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-100/90 md:text-[13px]">
                                          {activeProjectSystem.capabilities.map((item) => (
                                            <li key={item} className="flex gap-2">
                                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-200" />
                                              {item}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>

                                      <div className="flex h-full flex-col rounded-xl border border-cyan-100/15 bg-slate-950/24 backdrop-blur-sm p-3">
                                        <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/90">Impact & Highlights</p>
                                        <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-100/90 md:text-[13px]">
                                          {activeProjectSystem.highlights.map((item) => (
                                            <li key={item} className="flex gap-2">
                                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-200" />
                                              {item}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>

                                      <div className="flex h-full flex-col rounded-xl border border-cyan-100/15 bg-slate-950/24 backdrop-blur-sm p-3">
                                        <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/90">Architecture</p>
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                          {activeProjectSystem.architecture.map((tech) => (
                                            <span
                                              key={tech}
                                              className="rounded-md border border-cyan-100/15 bg-slate-900/55 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-cyan-100/95"
                                            >
                                              {tech}
                                            </span>
                                          ))}
                                        </div>

                                        <div className="mt-auto grid gap-2 pt-3">
                                          {activeProjectSystem.links.map((link) => {
                                            const isExternal = link.href.startsWith("http")

                                            return (
                                              <a
                                                key={link.label}
                                                href={link.href}
                                                target={isExternal ? "_blank" : undefined}
                                                rel={isExternal ? "noopener noreferrer" : undefined}
                                                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-100/35 bg-gradient-to-r from-cyan-400/30 via-violet-400/22 to-cyan-300/26 px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-cyan-50 shadow-[0_0_18px_rgba(34,211,238,0.2)] transition hover:border-cyan-100/60 hover:from-cyan-300/38 hover:via-violet-300/28 hover:to-cyan-200/34 hover:shadow-[0_0_24px_rgba(34,211,238,0.3)]"
                                              >
                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                                {link.label}
                                              </a>
                                            )
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.article>


                                <div className="grid gap-2 sm:grid-cols-3">
                                  {featuredSystems.map((system, index) => (
                                    <button
                                      key={system.name}
                                      type="button"
                                      onClick={() => {
                                        pauseAutoGlide()
                                        setActiveFeaturedProjectIndex(index)
                                      }}
                                      className={`rounded-lg border px-3 py-2 text-left text-[11px] uppercase tracking-[0.12em] transition ${
                                        index === activeFeaturedProjectIndex
                                          ? "border-cyan-100/55 bg-cyan-300/18 text-cyan-50"
                                          : "border-cyan-100/20 bg-slate-900/35 text-cyan-100/80 hover:border-cyan-100/40 hover:bg-cyan-300/10"
                                      }`}
                                    >
                                      {system.name}
                                    </button>
                                  ))}
                                </div>


                              {activeFeaturedProjectIndex === featuredProjectCount - 1 ? (
                                <a
                                  href="https://github.com/ankan00V"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-100/35 bg-cyan-300/10 px-4 py-3 text-xs uppercase tracking-[0.14em] text-cyan-100 transition hover:border-cyan-100/60 hover:bg-cyan-300/20"
                                >
                                  For more such interesting projects, visit my GitHub
                                  <Github className="h-3.5 w-3.5" />
                                </a>
                              ) : null}
                            </div>
                              ) : section.id === "skills" ? (
                                <>
                                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                                    {technicalSkillCategories.map((category) => (
                                      <div
                                        key={category.title}
                                        className="rounded-2xl border border-cyan-100/15 bg-slate-950/12 p-3 md:p-4"
                                      >
                                          <h3 className="text-xs uppercase tracking-[0.18em] text-cyan-100/90">{category.title}</h3>
                                            <div className="mt-3 rounded-xl border border-cyan-100/10 bg-slate-900/20 p-2.5">
                                              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4">
                                            {category.skills.map((skill) => {
                                              const skillKey = `${category.title}-${skill.name}`
                                              const isActiveSkill = activeSkillKey === skillKey
  
                                              return (
                                                <div key={skill.name} className="relative flex items-center justify-center">
                                                    <button
                                                      type="button"
                                                      aria-label={skill.name}
                                                      title={skill.name}
                                                      onMouseEnter={() => setActiveSkillKey(skillKey)}
                                                      onMouseLeave={() => setActiveSkillKey((currentKey) => (currentKey === skillKey ? null : currentKey))}
                                                      onFocus={() => setActiveSkillKey(skillKey)}
                                                      onBlur={() => setActiveSkillKey((currentKey) => (currentKey === skillKey ? null : currentKey))}
                                                        className={`inline-flex h-12 w-12 items-center justify-center rounded-lg border bg-[#f3f1e7] transition focus-visible:outline-none ${
                                                          isActiveSkill
                                                            ? "border-cyan-300/70 shadow-[0_0_16px_rgba(34,211,238,0.28)]"
                                                            : "border-slate-300/85 hover:border-cyan-300/60 hover:bg-[#f8f7f2]"
                                                        }`}
                                                      >
                                                          <Image
                                                            src={skill.logoUrl}
                                                            alt={skill.name}
                                                            width={28}
                                                            height={28}
                                                            className={`h-7 w-7 [filter:drop-shadow(0_0_0.65px_rgba(15,23,42,0.95))_drop-shadow(0_0_1.1px_rgba(15,23,42,0.72))] transition ${isActiveSkill ? "scale-105" : "scale-100"}`}
                                                            unoptimized
                                                          />
                                                    </button>
                                                  <span
                                                    className={`pointer-events-none absolute -bottom-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-cyan-100/25 bg-slate-950/95 px-2 py-1 text-[10px] uppercase tracking-[0.1em] text-cyan-100 transition duration-150 ${
                                                      isActiveSkill ? "opacity-100" : "opacity-0"
                                                    }`}
                                                  >
                                                    {skill.name}
                                                  </span>
                                                </div>
                                              )
                                            })}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
  
                                  <div className="mt-5 flex flex-wrap gap-3">
                                    {section.links.map((link) => {
                                      const Icon = link.icon
                                      const isExternal = link.href.startsWith("http")

                                      return (
                                        <a
                                          key={link.label}
                                          href={link.href}
                                          target={isExternal ? "_blank" : undefined}
                                          rel={isExternal ? "noopener noreferrer" : undefined}
                                          download={link.href.endsWith(".pdf") ? true : undefined}
                                          className="inline-flex items-center gap-2 rounded-lg border border-cyan-100/25 bg-slate-900/40 px-3.5 py-2 text-xs uppercase tracking-[0.14em] text-cyan-100 transition hover:border-cyan-100/50 hover:bg-cyan-300/10"
                                        >
                                          <Icon className="h-3.5 w-3.5" />
                                          {link.label}
                                        </a>
                                      )
                                    })}
                                  </div>
                                </>
                              ) : section.id === "certifications" ? (
                                <>
                                  <ul className="mt-4 grid gap-2 text-sm text-slate-100/90 md:grid-cols-2 md:text-[15px]">
                                    {certificationItems.map((certification, certificationIndex) => {
                                      const isDatabricks = certification.issuer === "Databricks"
                                      const issuerLogoUrl = isDatabricks
                                        ? "https://upload.wikimedia.org/wikipedia/commons/6/63/Databricks_Logo.png"
                                        : "https://img.icons8.com/?size=100&id=39913&format=png&color=000000"

                                      return (
                                        <li key={certification.title}>
                                            <button
                                              type="button"
                                              onClick={() => setActiveCertificationIndex(certificationIndex)}
                                              className="group flex w-full items-start gap-3 rounded-lg border border-cyan-100/15 bg-slate-950/24 backdrop-blur-sm p-3 text-left transition hover:border-cyan-100/45 hover:bg-cyan-300/10 hover:shadow-[0_0_24px_rgba(34,211,238,0.16)]"
                                            >
                                              <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-300/85 bg-[#f3f1e7] p-1.5 shadow-[0_2px_10px_rgba(15,23,42,0.22)]">
                                                <Image
                                                  src={issuerLogoUrl}
                                                  alt={`${certification.issuer} logo`}
                                                  width={32}
                                                  height={32}
                                                  className={`object-contain ${isDatabricks ? "h-7 w-9" : "h-8 w-8"}`}
                                                  unoptimized
                                                />
                                              </div>
                                              <div className="min-w-0 pt-0.5">
                                                <p className="text-sm leading-relaxed text-slate-100/95 transition group-hover:text-cyan-50 md:text-[15px]">
                                                  {certification.title}
                                                </p>
                                                <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-cyan-100/80">
                                                  {certification.issuer} • Click to view certificate
                                                </p>
                                              </div>
                                            </button>
                                        </li>
                                      )
                                    })}
                                  </ul>

                                    <div className="mt-5 flex flex-wrap gap-3">
                                      {section.links.map((link) => {
                                        const Icon = link.icon
                                        const isExternal = link.href.startsWith("http")

                                        return (
                                          <a
                                            key={link.label}
                                            href={link.href}
                                            target={isExternal ? "_blank" : undefined}
                                            rel={isExternal ? "noopener noreferrer" : undefined}
                                            download={link.href.endsWith(".pdf") ? true : undefined}
                                            className="inline-flex items-center gap-2 rounded-lg border border-cyan-100/25 bg-slate-900/40 px-3.5 py-2 text-xs uppercase tracking-[0.14em] text-cyan-100 transition hover:border-cyan-100/50 hover:bg-cyan-300/10"
                                          >
                                            <Icon className="h-3.5 w-3.5" />
                                            {link.label}
                                          </a>
                                        )
                                      })}
                                    </div>
                                </>
                              ) : section.id === "achievements" ? (
                                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                                    {achievementItems.map((achievement, achievementIndex) => (
                                    <article
                                      key={achievement.title}
                                      className="rounded-xl border border-cyan-100/18 bg-slate-950/18 p-3 md:p-4"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cyan-100/30 bg-[#f5f2e8] p-1.5 shadow-[0_0_20px_rgba(34,211,238,0.16)]">
                                              <div className="inline-flex h-full w-full items-center justify-center rounded-lg border border-slate-500/45 bg-[#fcfaf4] p-1">
                                                <Image
                                                  src={achievement.logoUrl}
                                                  alt={`${achievement.issuer} logo`}
                                                  width={40}
                                                  height={40}
                                                  className="h-full w-full object-contain object-center [filter:drop-shadow(0_0_0.8px_rgba(15,23,42,0.9))_drop-shadow(0_0_1.2px_rgba(15,23,42,0.65))]"
                                                  unoptimized
                                                />
                                              </div>
                                            </div>
                                          <div className="min-w-0">
                                          <h3 className="font-space text-base font-semibold text-slate-50 md:text-lg">{achievement.title}</h3>
                                          <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-cyan-100/80">{achievement.issuer}</p>
                                        </div>
                                      </div>

                                      <ul className="mt-3 space-y-2 text-sm text-slate-100/90 md:text-[14px]">
                                        {achievement.points.map((point) => (
                                          <li key={point} className="flex gap-2.5">
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-200" />
                                            {point}
                                          </li>
                                        ))}
                                      </ul>

                                        <div className="mt-4 flex flex-wrap gap-2.5">
                                          {achievement.links.map((link) => {
                                            if (link.label === "View Certificate") {
                                              return (
                                                  <button
                                                    key={`${achievement.title}-${link.label}`}
                                                    type="button"
                                                    onClick={() => setActiveAchievementCertificateIndex(achievementIndex)}
                                                    className="inline-flex items-center gap-2 rounded-lg border border-violet-300/45 bg-gradient-to-r from-violet-500/28 via-fuchsia-400/20 to-cyan-400/18 px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-violet-50 shadow-[0_0_16px_rgba(167,139,250,0.2)] transition hover:border-violet-300/70 hover:from-violet-400/32 hover:via-fuchsia-300/24 hover:to-cyan-300/22 hover:shadow-[0_0_24px_rgba(167,139,250,0.3)]"                                                  >
                                                  <ArrowUpRight className="h-3.5 w-3.5" />
                                                  {link.label}
                                                </button>
                                              )
                                            }

                                            return (
                                              <a
                                                key={`${achievement.title}-${link.label}`}
                                                href={link.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 rounded-lg border border-cyan-100/25 bg-slate-900/45 px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-cyan-100 transition hover:border-cyan-100/50 hover:bg-cyan-300/10"
                                              >
                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                                {link.label}
                                              </a>
                                            )
                                          })}
                                        </div>
                                    </article>
                                  ))}
                                </div>
                              ) : (
                                <>
                                  <ul className="mt-4 grid gap-2 text-sm text-slate-100/90 md:grid-cols-2 md:text-[15px]">
                                    {section.points.map((point) => (
                                      <li key={point} className="flex gap-3 rounded-lg border border-cyan-100/15 bg-slate-950/24 backdrop-blur-sm p-2.5">
                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-200" />
                                        {point}
                                      </li>
                                    ))}
                                  </ul>
  
                                  <div className="mt-5 flex flex-wrap gap-3">
                                    {section.id === "about" ? (
                                      <button
                                        type="button"
                                        onClick={() => setIsResumeModalOpen(true)}
                                        className="inline-flex items-center gap-2 rounded-lg border border-violet-300/45 bg-violet-400/18 px-4 py-2.5 text-xs uppercase tracking-[0.14em] text-violet-50 shadow-[0_0_20px_rgba(167,139,250,0.22)] transition hover:scale-[1.01] hover:border-violet-300/70 hover:bg-violet-300/22"
                                      >
                                        <Download className="h-3.5 w-3.5" />
                                        Download Resume
                                      </button>
                                    ) : (
                                      <>
                                        {section.links.map((link) => {
                                          const Icon = link.icon
                                          const isExternal = link.href.startsWith("http")

                                          return (
                                            <a
                                              key={link.label}
                                              href={link.href}
                                              target={isExternal ? "_blank" : undefined}
                                              rel={isExternal ? "noopener noreferrer" : undefined}
                                              download={link.href.endsWith(".pdf") ? true : undefined}
                                              className="inline-flex items-center gap-2 rounded-lg border border-cyan-100/25 bg-slate-900/40 px-3.5 py-2 text-xs uppercase tracking-[0.14em] text-cyan-100 transition hover:border-cyan-100/50 hover:bg-cyan-300/10"
                                            >
                                              <Icon className="h-3.5 w-3.5" />
                                              {link.label}
                                            </a>
                                          )
                                        })}
                                          {section.id === "experience" ? (
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setIsExperienceCertificateModalOpen(true)
                                                }}
                                                className="inline-flex items-center gap-2 rounded-lg border border-violet-300/45 bg-gradient-to-r from-violet-500/28 via-fuchsia-400/20 to-cyan-400/18 px-3.5 py-2 text-xs uppercase tracking-[0.14em] text-violet-50 shadow-[0_0_16px_rgba(167,139,250,0.2)] transition hover:border-violet-300/70 hover:from-violet-400/32 hover:via-fuchsia-300/24 hover:to-cyan-300/22 hover:shadow-[0_0_24px_rgba(167,139,250,0.3)]"
                                              >
                                              <ArrowUpRight className="h-3.5 w-3.5" />
                                              View Certificate
                                            </button>
                                          ) : null}
                                      </>
                                    )}
                                  </div>
                              </>
                          )}
                      </motion.div>
                    </div>
                    </motion.article>
                        )
                      })}
              </div>
            </section>

<section id="contact" className="relative mt-20 flex min-h-fit snap-end items-end px-5 pb-2 pt-10 sm:px-6 md:mt-28 md:snap-always md:px-12 md:pb-3 md:pt-14 lg:mt-32 lg:px-20">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-3">
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    <a
                      href="mailto:ghoshankan005@gmail.com"
                      aria-label="Email Ankan"
                      title="Gmail"
                      className="flex items-center justify-center rounded-xl border border-cyan-100/18 bg-slate-950/34 px-4 py-4 backdrop-blur-md transition hover:border-cyan-100/45 hover:bg-slate-900/45"
                    >
                      <Image
                        src="https://cdn-icons-png.flaticon.com/512/281/281769.png"
                        alt="Gmail"
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain"
                      />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/ghoshankan"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn profile"
                      title="LinkedIn"
                      className="flex items-center justify-center rounded-xl border border-cyan-100/18 bg-slate-950/34 px-4 py-4 backdrop-blur-md transition hover:border-cyan-100/45 hover:bg-slate-900/45"
                    >
                      <Image
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                        alt="LinkedIn"
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain"
                      />
                    </a>
                    <a
                      href="https://github.com/ankan00V"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub profile"
                      title="GitHub"
                      className="flex items-center justify-center rounded-xl border border-cyan-100/18 bg-slate-950/34 px-4 py-4 backdrop-blur-md transition hover:border-cyan-100/45 hover:bg-slate-900/45"
                    >
                      <Image
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                        alt="GitHub"
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain [filter:invert(1)_brightness(1.15)]"
                      />
                    </a>
                    <a
                      href="https://medium.com/@ghoshankan005"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Medium profile"
                      title="Medium"
                      className="flex items-center justify-center rounded-xl border border-cyan-100/18 bg-slate-950/34 px-4 py-4 backdrop-blur-md transition hover:border-cyan-100/45 hover:bg-slate-900/45"
                    >
                      <Image
                        src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/medium.svg"
                        alt="Medium"
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain [filter:invert(1)_brightness(1.15)]"
                      />
                    </a>
                  </div>

                <footer className="mb-0 rounded-xl border border-cyan-100/18 bg-slate-950/34 px-4 py-3 text-center text-xs uppercase tracking-[0.14em] text-cyan-100/85 backdrop-blur-md">
                © {currentYear} Ankan Ghosh. All rights reserved.
              </footer>
            </div>
          </section>


              {isResumeModalOpen ? (
                <div className="fixed inset-0 z-[75] flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="resume-modal-title">
                  <button
                    type="button"
                    aria-label="Close resume modal"
                    onClick={() => setIsResumeModalOpen(false)}
                    className="absolute inset-0"
                  />

                  <div className="tech-border relative z-10 w-full max-w-2xl rounded-2xl border border-violet-200/25 bg-slate-950/93 p-5 shadow-[0_0_38px_rgba(139,92,246,0.25)] md:p-6">
                    <button
                      type="button"
                      onClick={() => setIsResumeModalOpen(false)}
                      className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-violet-200/35 bg-slate-900/70 text-violet-100 transition hover:border-violet-200/65 hover:bg-violet-300/15"
                      aria-label="Close resume modal"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div className="pr-12">
                      <h3 id="resume-modal-title" className="font-space text-xl font-semibold text-slate-50 md:text-2xl">
                        Select Resume
                      </h3>
                      <p className="mt-1 text-sm text-violet-100/90">Choose the version aligned with your hiring role</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.12em] text-cyan-100/75">
                        Each version highlights relevant projects and experience
                      </p>
                    </div>

                      <div className="mt-5 grid gap-3 md:grid-cols-2">
                        {resumeOptions.map((option, optionIndex) => {
                          const isPrimaryOption = optionIndex === 0

                          return (
                            <a
                              key={option.title}
                              href={option.fileUrl}
                              download={option.fileName}
                              onClick={() => setIsResumeModalOpen(false)}
                              className={`group rounded-xl border p-4 text-left transition duration-200 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/55 ${
                                isPrimaryOption
                                  ? "border-violet-300/60 bg-violet-400/14 shadow-[0_0_26px_rgba(139,92,246,0.22)] hover:border-violet-300/85 hover:bg-violet-300/18"
                                  : "border-cyan-100/20 bg-slate-900/55 hover:border-cyan-100/45 hover:bg-slate-900/80"
                              }`}
                            >
                              <p className="font-space text-base font-semibold text-slate-50">{option.title}</p>
                              <p className="mt-1.5 text-sm leading-relaxed text-slate-300/90">{option.description}</p>
                              <span className="mt-3 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-cyan-100/85 transition group-hover:text-cyan-100">
                                Download
                                <Download className="h-3.5 w-3.5" />
                              </span>
                            </a>
                          )
                        })}
                      </div>
                  </div>
                </div>
              ) : null}

              {activeCertification ? (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/78 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true">
                <button
                  type="button"
                  aria-label="Close certification popup"
                  onClick={() => setActiveCertificationIndex(null)}
                  className="absolute inset-0"
                />
                <div className="tech-border relative z-10 w-full max-w-3xl rounded-2xl bg-slate-950/92 p-4 shadow-[0_0_42px_rgba(34,211,238,0.2)] md:p-5">
                  <button
                    type="button"
                    onClick={() => setActiveCertificationIndex(null)}
                    className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-cyan-100/35 bg-slate-900/70 text-cyan-100 transition hover:border-cyan-100/60 hover:bg-cyan-300/12"
                    aria-label="Close certification popup"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="pr-12">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/85">Certificate Preview</p>
                    <h3 className="mt-1 font-space text-lg text-slate-50 md:text-xl">{activeCertification.title}</h3>
                    <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-violet-100/90">{activeCertification.issuer}</p>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-xl border border-cyan-100/20 bg-slate-900/70 p-1.5">
                    <div className="relative h-[240px] w-full overflow-hidden rounded-lg bg-slate-950/65 md:h-[360px]">
                      <Image
                        src={activeCertification.certificateImageUrl}
                        alt={`${activeCertification.title} certificate`}
                        fill
                        sizes="(max-width: 768px) 95vw, 900px"
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <a
                      href={activeCertification.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-cyan-100/30 bg-cyan-300/12 px-3.5 py-2 text-xs uppercase tracking-[0.14em] text-cyan-100 transition hover:border-cyan-100/55 hover:bg-cyan-300/20"
                    >
                      Verify Certificate
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setActiveCertificationIndex(null)}
                      className="inline-flex items-center gap-2 rounded-lg border border-cyan-100/25 bg-slate-900/45 px-3.5 py-2 text-xs uppercase tracking-[0.14em] text-cyan-100 transition hover:border-cyan-100/50 hover:bg-cyan-300/10"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

              {activeAchievementCertificate ? (
                <div
                  className="fixed inset-0 z-[71] flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="achievement-certificate-title"
                >
                  <button
                    type="button"
                    aria-label="Close achievement certificate popup"
                    onClick={() => setActiveAchievementCertificateIndex(null)}
                    className="absolute inset-0"
                  />
                    <div className="tech-border relative z-10 w-full max-w-5xl rounded-2xl border border-cyan-100/25 bg-slate-950/94 p-3.5 shadow-[0_0_42px_rgba(34,211,238,0.2)] md:p-4 lg:max-w-6xl">
                    <button
                      type="button"
                      onClick={() => setActiveAchievementCertificateIndex(null)}
                      className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-cyan-100/35 bg-slate-900/70 text-cyan-100 transition hover:border-cyan-100/60 hover:bg-cyan-300/12"
                      aria-label="Close achievement certificate popup"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div className="pr-12">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/85">Achievement Certificate</p>
                      <h3 id="achievement-certificate-title" className="mt-1 font-space text-lg text-slate-50 md:text-xl">
                        {activeAchievementCertificate.title}
                      </h3>
                      <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-violet-100/90">
                        {activeAchievementCertificate.issuer}
                      </p>
                    </div>

                      <div className="mt-4 overflow-hidden rounded-xl border border-cyan-100/20 bg-slate-900/70 p-1.5 md:p-2.5">
                        <div className="relative h-[360px] w-full overflow-hidden rounded-lg bg-slate-950/65 sm:h-[440px] md:h-[580px] lg:h-[640px]">
                        <Image
                          src={activeAchievementCertificate.certificateImageUrl}
                          alt={`${activeAchievementCertificate.title} certificate`}
                          fill
                            sizes="(max-width: 768px) 96vw, (max-width: 1280px) 92vw, 1500px"
                            className="object-contain p-1 md:p-2"
                          unoptimized
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2.5">
                      <button
                        type="button"
                        onClick={() => setActiveAchievementCertificateIndex(null)}
                        className="inline-flex items-center gap-2 rounded-lg border border-cyan-100/25 bg-slate-900/45 px-3.5 py-2 text-xs uppercase tracking-[0.14em] text-cyan-100 transition hover:border-cyan-100/50 hover:bg-cyan-300/10"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              {isExperienceCertificateModalOpen ? (
                  <div className="fixed inset-0 z-[72] flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="experience-certificate-title">
                    <button
                      type="button"
                      aria-label="Close experience certificate popup"
                      onClick={() => {
                        setIsExperienceCertificateModalOpen(false)
                      }}
                      className="absolute inset-0"
                    />
                      <div className="tech-border relative z-10 w-full max-w-5xl rounded-2xl border border-violet-200/25 bg-slate-950/94 p-4 shadow-[0_0_42px_rgba(139,92,246,0.22)] md:p-5 lg:max-w-6xl">
                      <button
                        type="button"
                        onClick={() => {
                          setIsExperienceCertificateModalOpen(false)
                        }}
                        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-violet-200/35 bg-slate-900/70 text-violet-100 transition hover:border-violet-200/65 hover:bg-violet-300/15"
                        aria-label="Close experience certificate popup"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <div className="pr-12">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/85">Experience Certificate</p>
                        <h3 id="experience-certificate-title" className="mt-1 font-space text-lg text-slate-50 md:text-xl">
                          {experienceCertificate.title}
                        </h3>
                        <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-violet-100/90">{experienceCertificate.issuer}</p>
                      </div>

                        <div className="mt-4 overflow-hidden rounded-xl border border-cyan-100/20 bg-slate-900/70 p-1.5 md:p-2">
                          <div className="relative h-[320px] w-full overflow-hidden rounded-lg bg-slate-950/65 sm:h-[380px] md:h-[500px] lg:h-[560px]">
                            <Image
                              src={experienceCertificate.certificateImageUrl}
                              alt={`${experienceCertificate.title} preview`}
                              fill
                              sizes="(max-width: 768px) 95vw, (max-width: 1280px) 92vw, 1400px"
                              className="object-contain rotate-90 scale-[1.15] sm:scale-[1.22] md:scale-[1.3]"
                              unoptimized
                            />
                          </div>
                        </div>

                      <div className="mt-4 flex flex-wrap gap-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            setIsExperienceCertificateModalOpen(false)
                          }}
                          className="inline-flex items-center gap-2 rounded-lg border border-cyan-100/25 bg-slate-900/45 px-3.5 py-2 text-xs uppercase tracking-[0.14em] text-cyan-100 transition hover:border-cyan-100/50 hover:bg-cyan-300/10"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
              ) : null}

              <PersonalChatWidget />

        </main>
      )
  }

