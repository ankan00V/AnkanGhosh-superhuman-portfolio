"use client"

import { motion } from "framer-motion"
import { Section } from "./section"
import { User, BrainCircuit, Database, Cloud, Wrench, BarChart3 } from "lucide-react"

const skillGroups = [
  {
    category: "Languages & Core",
    icon: Wrench,
    items: ["Python", "SQL", "C++", "Data Structures", "Algorithms"],
  },
  {
    category: "ML / AI Stack",
    icon: BrainCircuit,
    items: ["Scikit-learn", "TensorFlow", "PyTorch", "OpenCV", "Transformers", "GenAI"],
  },
  {
    category: "Data Systems",
    icon: Database,
    items: ["Pandas", "NumPy", "SciPy", "PostgreSQL", "MySQL", "MongoDB", "Redis"],
  },
  {
    category: "Backend & Deployment",
    icon: Cloud,
    items: ["FastAPI", "Flask", "Django", "Docker", "Kubernetes", "Celery", "CI/CD"],
  },
  {
    category: "Analytics & BI",
    icon: BarChart3,
    items: ["Power BI", "Tableau", "Matplotlib", "Seaborn", "Jupyter", "Google Colab"],
  },
]

const strengths = [
  "Problem-Solving",
  "Analytical Thinking",
  "Team Collaboration",
  "Adaptability",
  "Communication",
]

export function AboutAndSkills() {
  return (
    <>
      <Section id="about" title="Profile" icon={User}>
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/15 bg-[#0a1123]/70 backdrop-blur-xl p-7 md:p-9"
          >
            <p className="text-lg md:text-xl text-slate-200/90 leading-relaxed">
              Results-driven Data Scientist and AI Engineer with strong foundations in machine learning, data analysis,
              and algorithmic problem solving. I build end-to-end systems from ingestion and feature engineering to
              secure API deployment and interactive dashboards that enable strategic decisions.
            </p>
            <p className="mt-5 text-slate-300/80 leading-relaxed">
              I have delivered measurable outcomes in enterprise and product settings, including data quality improvement,
              process automation, and high-reliability architecture backed by automated tests and cloud-native workflows.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-7">
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4">
                <p className="text-2xl font-space font-bold text-primary">15%</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300/70 mt-1">Data Accuracy Up</p>
              </div>
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4">
                <p className="text-2xl font-space font-bold text-primary">20%</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300/70 mt-1">Efficiency Gain</p>
              </div>
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4">
                <p className="text-2xl font-space font-bold text-primary">2x</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300/70 mt-1">Faster Insights</p>
              </div>
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4">
                <p className="text-2xl font-space font-bold text-primary">30%</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300/70 mt-1">Less Manual Effort</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="rounded-3xl border border-accent/30 bg-[#120f26]/60 backdrop-blur-xl p-7"
          >
            <h3 className="font-space text-2xl font-bold mb-4">Core Strengths</h3>
            <div className="flex flex-wrap gap-2">
              {strengths.map((strength) => (
                <span key={strength} className="px-3 py-1.5 rounded-full text-xs uppercase tracking-[0.14em] border border-accent/35 bg-accent/10">
                  {strength}
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm text-slate-300/80 leading-relaxed">
              Comfortable across Linux, Windows, and macOS with practical experience collaborating in cross-functional,
              high-ownership environments.
            </p>
          </motion.div>
        </div>
      </Section>

      <Section id="skills" title="Tech Stack" icon={BrainCircuit}>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {skillGroups.map((group, index) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="rounded-2xl border border-white/15 bg-[#0a1022]/70 p-6 backdrop-blur-lg hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <group.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-space font-bold text-lg">{group.category}</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 rounded-md text-xs uppercase tracking-[0.12em] border border-white/10 bg-[#111831]/75 text-slate-200/90"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </>
  )
}
