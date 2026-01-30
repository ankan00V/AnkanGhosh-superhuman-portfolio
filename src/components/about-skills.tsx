"use client"

import { motion } from "framer-motion"
import { Section } from "./section"
import { User, Cpu, Database, Cloud, Terminal, Palette, Award } from "lucide-react"

const skills = [
  {
    category: "Programming & Core",
    icon: Terminal,
    items: ["Python", "C++", "SQL", "DSA", "FastAPI", "Flask"],
  },
  {
    category: "Data & ML",
    icon: Database,
    items: ["Scikit-learn", "TensorFlow", "PyTorch", "PySpark", "Hadoop", "XGBoost", "MLOps"],
  },
  {
    category: "AI & Emerging",
    icon: Cpu,
    items: ["LLMs", "RAG", "Vision Transformers", "CNNs", "Diffusion Models", "Vector DBs"],
  },
  {
    category: "Cloud & Deployment",
    icon: Cloud,
    items: ["AWS", "GCP", "Azure", "Snowflake", "Docker", "Kubernetes", "Kafka"],
  },
  {
    category: "Visualization",
    icon: Palette,
    items: ["Tableau", "Power BI", "Matplotlib", "Seaborn", "Plotly"],
  },
]

export function AboutAndSkills() {
  return (
    <>
      <Section id="about" title="About Me" icon={User}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-xl text-muted-foreground leading-relaxed">
              Results-driven with a solid foundation in data analysis, machine learning, and algorithmic problem solving. 
              Hands‐on experience developing end‐to‐end solutions—from data ingestion and feature engineering in Python 
              to performant C++ implementations of core algorithms.
            </p>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Passionate about transforming complex datasets into clear, actionable insights and dashboards that drive 
              strategic decision‐making. I thrive in cross‐functional teams and am eager to contribute to innovative, 
              data‐driven projects.
            </p>
            <div className="flex items-center gap-6 pt-4">
               <div className="flex flex-col">
                 <span className="text-primary font-space text-3xl font-bold">15%</span>
                 <span className="text-xs uppercase tracking-widest text-muted-foreground">Accuracy Improvement</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-primary font-space text-3xl font-bold">20%</span>
                 <span className="text-xs uppercase tracking-widest text-muted-foreground">Efficiency Boost</span>
               </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card flex items-center justify-center p-12 min-h-[300px] border-primary/20"
          >
             <div className="text-center">
                <Award className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce" />
                <h3 className="text-2xl font-space font-bold mb-2">Oracle Certified</h3>
                <p className="text-muted-foreground">Data Science & GenAI Professional</p>
             </div>
          </motion.div>
        </div>
      </Section>

      <Section id="skills" title="Tech Stack" icon={Cpu}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <skill.icon className="w-6 h-6" />
                </div>
                <h3 className="font-space font-bold text-lg">{skill.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 rounded-md bg-secondary/30 text-xs font-medium border border-white/5 group-hover:border-primary/30 transition-colors"
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
