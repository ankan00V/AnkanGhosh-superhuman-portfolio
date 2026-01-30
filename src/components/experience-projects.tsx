"use client"

import { motion } from "framer-motion"
import { Section } from "./section"
import { Briefcase, Code, ExternalLink, Calendar, MapPin } from "lucide-react"

const experiences = [
  {
    title: "IT Analyst Intern",
    company: "Eastern Coalfields Limited (Govt. of India)",
    location: "Asansol, West Bengal",
    period: "07/2025 – 08/2025",
    description: [
      "Assisted in managing and analyzing organizational data, improving accuracy and accessibility by 15%.",
      "Utilized MS Office, Excel, and Power BI to perform data analysis and create visual reports, enhancing efficiency by 20%.",
      "Gained hands-on exposure to SAP systems for enterprise data handling and process optimization.",
      "Collaborated with IT teams and nodal officers, streamlining workflows and improving communication by 10%.",
    ],
  },
]

const projects = [
  {
    title: "Quality Control Chatbot",
    category: "AI & Manufacturing",
    period: "02/2025 – 04/2025",
    tech: ["JavaScript", "Node.js", "Python", "MongoDB"],
    description: "Engineered a multimodal chatbot to detect product defects from text and images. Built a full-stack solution with dynamic responses and defect-based visualizations.",
    result: "Improved reporting accuracy and reduced manual inspection time.",
  },
  {
    title: "Credit Card Fraud Detection",
    category: "Financial Technology",
    period: "01/2025 – 03/2025",
    tech: ["Python", "Isolation Forest", "Scikit-learn"],
    description: "Developed an ML model to identify fraudulent transactions in an imbalanced dataset of 284,807 transactions (0.172% fraud).",
    result: "Achieved an AUPRC of 22%, enhancing financial security measures.",
  },
]

export function ExperienceProjects() {
  return (
    <>
      <Section id="experience" title="Professional Experience" icon={Briefcase}>
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card tech-border"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-space font-bold text-primary">{exp.title}</h3>
                  <p className="text-lg font-medium">{exp.company}</p>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {exp.period}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {exp.location}
                  </div>
                </div>
              </div>
              <ul className="space-y-3">
                {exp.description.map((item, i) => (
                  <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section id="projects" title="Featured Projects" icon={Code}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-space font-bold uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full">
                  {project.category}
                </span>
                <span className="text-xs text-muted-foreground">{project.period}</span>
              </div>
              <h3 className="text-2xl font-space font-bold mb-4 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-muted-foreground mb-6 flex-grow leading-relaxed">
                {project.description}
              </p>
              <div className="space-y-4">
                 <p className="text-sm font-medium">
                   <span className="text-primary">Result: </span> {project.result}
                 </p>
                 <div className="flex flex-wrap gap-2">
                   {project.tech.map((t) => (
                     <span key={t} className="text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded bg-white/5 border border-white/10">
                       {t}
                     </span>
                   ))}
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </>
  )
}
