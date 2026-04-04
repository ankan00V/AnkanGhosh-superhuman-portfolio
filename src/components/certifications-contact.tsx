"use client"

import { motion } from "framer-motion"
import { Section } from "./section"
import { GraduationCap, Award, Trophy, BookOpen, HandHeart, Mail, Phone, Linkedin, Github, MapPin } from "lucide-react"

const education = [
  {
    degree: "Bachelor of Technology, Computer Science and Engineering",
    school: "Lovely Professional University",
    period: "Aug 2023 - Present",
    location: "Phagwara, Punjab",
    grade: "CGPA: 8.0",
  },
]

const certifications = [
  "Oracle Cloud Infrastructure 2025 Certified Data Science Professional",
  "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional",
  "Oracle Certified Associate - Java SE 8",
  "Databricks Accredited Generative AI Fundamentals",
  "Oracle AI Vector Search Certified Professional",
  "Oracle Autonomous Database Cloud Certified Professional",
]

const achievements = [
  "Rank 2 at LPU in Graph Camp (AlgoUniversity).",
  "Selected Top 50 from 40,000+ pan-India applicants for AlgoUniversity flagship accelerator.",
]

const publications = [
  "Operating System Security: A Comprehensive Analysis of Modern Threat Mitigation Techniques (JETNR, Oct 2024)",
]

const community = [
  "Educational Instructor at Dhagagia Social Welfare Society, delivered interactive sustainability workshops reaching 200+ participants.",
]

export function CertificationsContact() {
  return (
    <>
      <Section id="education" title="Education" icon={GraduationCap}>
        <div className="grid md:grid-cols-2 gap-5">
          {education.map((item) => (
            <motion.article
              key={item.degree}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/15 bg-[#0b1226]/70 p-6 backdrop-blur-lg"
            >
              <h3 className="font-space text-xl font-bold text-primary">{item.degree}</h3>
              <p className="mt-2 text-slate-100/90">{item.school}</p>
              <div className="mt-4 space-y-2 text-sm text-slate-300/80">
                <p className="inline-flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" />{item.location}</p>
                <p className="text-primary">{item.period}</p>
                <p>{item.grade}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </Section>

      <Section id="certifications" title="Certifications" icon={Award}>
        <div className="grid md:grid-cols-2 gap-4">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm leading-relaxed"
            >
              {cert}
            </motion.div>
          ))}
        </div>
      </Section>

      <Section id="achievements" title="Achievements" icon={Trophy}>
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-white/15 bg-[#0b1226]/70 p-6 backdrop-blur-lg space-y-3">
            {achievements.map((item) => (
              <p key={item} className="flex gap-3 text-slate-300/85 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </p>
            ))}
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-white/15 bg-[#0b1226]/70 p-6 backdrop-blur-lg">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="font-space text-lg font-bold">Publication</h3>
              </div>
              {publications.map((item) => (
                <p key={item} className="text-slate-300/85 leading-relaxed">{item}</p>
              ))}
            </div>

            <div className="rounded-2xl border border-white/15 bg-[#0b1226]/70 p-6 backdrop-blur-lg">
              <div className="flex items-center gap-3 mb-3">
                <HandHeart className="w-5 h-5 text-primary" />
                <h3 className="font-space text-lg font-bold">Community Service</h3>
              </div>
              {community.map((item) => (
                <p key={item} className="text-slate-300/85 leading-relaxed">{item}</p>
              ))}
            </div>
          </div>
        </div>
      </Section>

        <Section id="contact" title="Contact" icon={Mail} className="pt-52 md:pt-64">
        <div className="rounded-3xl border border-primary/25 bg-[#0a1123]/80 p-7 md:p-9 backdrop-blur-xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-space text-3xl font-bold leading-tight">
                Let us build your next
                <span className="text-primary"> data-driven product</span>
              </h3>
              <div className="mt-6 space-y-3 text-slate-200/90">
                <p className="inline-flex items-center gap-3"><Mail className="w-4 h-4 text-primary" />ghoshankan005@gmail.com</p>
                <p className="inline-flex items-center gap-3"><Phone className="w-4 h-4 text-primary" />+91 90463 59825</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="http://www.linkedin.com/in/ghoshankan/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/15 bg-[#111a34]/70 p-4 hover:border-primary/40 transition-colors flex items-center justify-between"
              >
                <span className="inline-flex items-center gap-3"><Linkedin className="w-5 h-5 text-primary" />LinkedIn</span>
                <span className="text-primary">{"->"}</span>
              </a>
              <a
                href="https://github.com/ankan00V"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/15 bg-[#111a34]/70 p-4 hover:border-primary/40 transition-colors flex items-center justify-between"
              >
                <span className="inline-flex items-center gap-3"><Github className="w-5 h-5 text-primary" />GitHub</span>
                <span className="text-primary">{"->"}</span>
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
