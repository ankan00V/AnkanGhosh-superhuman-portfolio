"use client"

import { motion } from "framer-motion"
import { Section } from "./section"
import { Briefcase, FolderKanban, CalendarRange, Building2 } from "lucide-react"

const experiences = [
  {
    title: "IT Analyst Intern",
    company: "Eastern Coalfields Limited (Govt. of India)",
    period: "Jul 2025 - Aug 2025",
    details: [
      "Managed and analyzed enterprise datasets, improving data accuracy by 15%.",
      "Built analytical reports and dashboards using Excel and Power BI.",
      "Worked with SAP systems for enterprise-grade data handling.",
      "Collaborated with IT teams to improve reporting efficiency by 20%.",
    ],
  },
]

const projects = [
  {
    name: "LPU Smart Campus",
    period: "Jan 2026 - Mar 2026",
    stack: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "OpenCV"],
    points: [
      "Built production-grade smart campus platform spanning 6+ workflows including facial attendance, remedial management, faculty messaging, and analytics.",
      "Designed scalable backend with 209 REST APIs across 14 modules using PostgreSQL, MongoDB, Redis streams, and Celery.",
      "Implemented RBAC, OTP, MFA, SSO/SCIM and encrypted PII handling for secure operations.",
      "Shipped reliability with 45 pytest suites, 180+ tests, accessibility checks, and CI/CD pipelines.",
    ],
  },
  {
    name: "SATYQ CORE (Quality Control Chatbot)",
    period: "Dec 2025 - Feb 2026",
    stack: ["GenAI", "Data Science", "Multimodal AI", "Analytics"],
    points: [
      "Built browser-native industrial AI for multimodal analysis across structured data, images, and logs.",
      "Implemented intelligent task routing with advanced GPT models reducing manual inspection by about 30%.",
      "Created telemetry analytics and interactive visualizations enabling 2x faster insight generation.",
      "Improved defect detection efficiency and decision turnaround by around 25%.",
    ],
  },
]

export function ExperienceProjects() {
  return (
    <>
      <Section id="experience" title="Experience" icon={Briefcase}>
        <div className="space-y-6">
          {experiences.map((experience, index) => (
            <motion.article
              key={experience.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl border border-white/15 bg-[#0a1123]/70 p-7 backdrop-blur-xl"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-space text-2xl font-bold text-primary">{experience.title}</h3>
                  <p className="text-lg text-slate-100/95 mt-1">{experience.company}</p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs uppercase tracking-[0.16em]">
                  <CalendarRange className="w-4 h-4 text-primary" />
                  {experience.period}
                </div>
              </div>

              <ul className="space-y-3">
                {experience.details.map((detail) => (
                  <li key={detail} className="flex gap-3 text-slate-300/85">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <span className="leading-relaxed">{detail}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </Section>

      <Section id="projects" title="Projects" icon={FolderKanban}>
        <div className="grid lg:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.article
              key={project.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-3xl border border-white/15 bg-[#0a1021]/75 p-7 backdrop-blur-lg hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-space text-2xl leading-tight font-bold text-slate-100">{project.name}</h3>
                  <div className="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-primary/90">
                    <Building2 className="w-4 h-4" />
                    Production-Oriented Build
                  </div>
                </div>
                <span className="text-xs uppercase tracking-[0.16em] text-slate-300/65">{project.period}</span>
              </div>

              <ul className="space-y-3 text-slate-300/85 leading-relaxed">
                {project.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2 mt-5">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-md border border-white/10 bg-[#121931]/80 text-[11px] uppercase tracking-[0.14em]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </Section>
    </>
  )
}
