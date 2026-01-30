import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { CyberBackground } from "@/components/cyber-background"
import { AboutAndSkills } from "@/components/about-skills"
import { ExperienceProjects } from "@/components/experience-projects"
import { CertificationsContact } from "@/components/certifications-contact"

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <CyberBackground />
      <Navbar />
      <Hero />
      <div className="relative z-10">
        <AboutAndSkills />
        <ExperienceProjects />
        <CertificationsContact />
      </div>
      
      <footer className="py-12 px-6 border-t border-white/5 text-center text-muted-foreground text-sm">
        <div className="container mx-auto">
          <p className="font-space tracking-widest uppercase">
            © 2026 ANKAN GHOSH. BUILT FOR THE FUTURE.
          </p>
        </div>
      </footer>
    </main>
  )
}
