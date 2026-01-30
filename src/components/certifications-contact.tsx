"use client"

import { motion } from "framer-motion"
import { Section } from "./section"
import { GraduationCap, Award, Mail, Phone, MapPin, Linkedin, Github } from "lucide-react"

const education = [
  {
    degree: "B.Tech, Computer Science Engineering",
    school: "Lovely Professional University",
    period: "08/2023 – Present",
    location: "Punjab, India",
    grade: "CGPA 7.6",
  },
  {
    degree: "Senior Secondary",
    school: "R.L.J.D.M.C D.A.V Public School",
    period: "03/2022 – 03/2023",
    location: "West Bengal, India",
    grade: "CGPA 7.24",
  },
]

const certifications = [
  "OCI 2025 Certified Data Science Professional",
  "OCI 2025 Generative AI Certified Professional",
  "OCI AI Vector Search Certified Professional",
  "Oracle Certified Associate, Java SE 8 Programmer",
  "Gen AI exchange program - Hack2Skill & Google Cloud",
  "Cisco Python Essentials (1 and 2)",
]

export function CertificationsContact() {
  return (
    <>
      <Section id="education" title="Education" icon={GraduationCap}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card"
            >
              <h3 className="text-xl font-space font-bold text-primary mb-2">{edu.degree}</h3>
              <p className="font-medium mb-4">{edu.school}</p>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {edu.location}
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  {edu.grade}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section id="certifications" title="Certifications" icon={Award}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="glass p-4 rounded-xl border-l-4 border-l-primary flex items-center gap-4"
            >
              <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
              <span className="text-sm font-medium">{cert}</span>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section id="contact" title="Get In Touch" icon={Mail}>
        <div className="glass-card max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="text-3xl font-space font-bold">Let's build something <span className="text-primary">extraordinary</span>.</h3>
              <p className="text-muted-foreground text-lg">
                I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
              </p>
              <div className="space-y-4">
                <a href="mailto:ghoshankan005@gmail.com" className="flex items-center gap-4 hover:text-primary transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <span>ghoshankan005@gmail.com</span>
                </a>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <span>+91-9046359825</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-4">
               <a 
                 href="https://linkedin.com/in/ghoshankan" 
                 target="_blank" 
                 className="glass p-6 rounded-2xl flex items-center justify-between group hover:bg-primary/10 transition-all"
               >
                 <div className="flex items-center gap-4">
                   <Linkedin className="w-6 h-6 text-primary" />
                   <span className="font-space font-bold uppercase tracking-widest">LinkedIn</span>
                 </div>
                 <div className="w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                   →
                 </div>
               </a>
               <a 
                 href="https://github.com" 
                 target="_blank" 
                 className="glass p-6 rounded-2xl flex items-center justify-between group hover:bg-primary/10 transition-all"
               >
                 <div className="flex items-center gap-4">
                   <Github className="w-6 h-6 text-primary" />
                   <span className="font-space font-bold uppercase tracking-widest">GitHub</span>
                 </div>
                 <div className="w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                   →
                 </div>
               </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
