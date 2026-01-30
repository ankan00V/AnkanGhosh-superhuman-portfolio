## Project Summary
A high-end, futuristic personal portfolio website for Ankan Ghosh, a Data Scientist and AI Engineer. The site features a 3D starfield background, glassmorphism effects, and a "techie hub" aesthetic designed for recruiters and LinkedIn display.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Icons**: Lucide React
- **Theming**: next-themes (Dark mode default)
- **Fonts**: Space Grotesk (Headers/Futuristic), Inter (Body)

## Architecture
- `src/app`: Main routing and layout.
- `src/components`: UI components including:
  - `cyber-background.tsx`: R3F starfield.
  - `hero.tsx`: Interactive hero section.
  - `section.tsx`: Animated section wrapper.
  - `about-skills.tsx`: Experience summaries and tech stack grids.
  - `experience-projects.tsx`: Career timeline and project showcases.
  - `certifications-contact.tsx`: Education, Oracle certifications, and social links.

## User Preferences
- **Theme**: Always use dark, futuristic theme with teal/purple accents.
- **Components**: Functional components with "use client" where needed.
- **Styling**: Use utility classes for glassmorphism (`glass`, `glass-card`) and tech borders (`tech-border`).
- **Aesthetics**: Avoid generic AI slop; use Space Grotesk and sharp accents.

## Project Guidelines
- No comments unless requested.
- Maintain responsive design for all sections.
- Ensure 3D background doesn't interfere with readability (using gradients and backdrop blurs).

## Common Patterns
- Section titles with a primary color dot and horizontal line.
- Glassmorphism cards for projects and skills.
- Hover effects with primary color glows.
