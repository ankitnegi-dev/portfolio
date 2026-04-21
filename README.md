# Ankit Negi — 3D Portfolio

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Three.js](https://img.shields.io/badge/Three.js-r128-black?style=flat-square&logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

> A production-grade 3D portfolio built with Next.js, React Three Fiber, and GSAP — featuring a neon racing track environment, scroll-driven camera, AI chat assistant, and full case study pages.

**[Live Demo](https://portfolio-nu-amber-sg31cyo8d3.vercel.app)** · **[LinkedIn](https://www.linkedin.com/in/ankit-negi-2aa98232a)** · **[Twitter](https://x.com/ankit_07_negi)**

---

## Features

- **Immersive 3D Scene** — Neon racing track built with React Three Fiber, scroll-driven camera path via CatmullRomCurve3, bloom + chromatic aberration post-processing
- **5 Portfolio Sections** — Hero, About, Projects, Skills, Contact — each linked to a camera position on the track
- **3D Skills Visualization** — Floating pill labels organized by category fly past the camera
- **AI Chat Assistant** — Powered by Groq LLaMA 3.1 — visitors can ask anything about my experience and get real answers
- **Project Case Studies** — 4 full case study pages with problem, solution, features, and tech breakdown
- **Contact Form** — Wired to Resend API — messages land directly in my inbox
- **Neon Cursor Trail** — Canvas-based particle system matching the racing aesthetic
- **Loading Screen** — Animated progress bar before the 3D scene initializes
- **Mobile Responsive** — Hamburger nav, bottom-anchored panels, touch-friendly form
- **OG Image** — Dynamic social preview at `/api/og` for LinkedIn/Twitter sharing
- **CI/CD** — GitHub Actions pipeline: lint → typecheck → build on every push

## Tech Stack

| Category | Technologies |
|---|---|
| Framework | Next.js 16, TypeScript, App Router |
| 3D | Three.js, React Three Fiber, Drei, @react-three/postprocessing |
| Animation | GSAP, Framer Motion |
| Styling | Tailwind CSS |
| AI | Groq API (LLaMA 3.1 8B Instant) |
| Email | Resend API |
| Analytics | Vercel Analytics |
| Deployment | Vercel |
| CI/CD | GitHub Actions |

## Project Structure

\`\`\`
src/
├── app/
│   ├── api/
│   │   ├── chat/        # AI assistant (Groq)
│   │   ├── contact/     # Email form (Resend)
│   │   └── og/          # Dynamic OG image
│   ├── projects/[slug]/ # Case study pages
│   ├── layout.tsx       # Root layout + SEO metadata
│   └── page.tsx         # Home page
├── components/
│   ├── three/
│   │   ├── Scene.tsx    # Canvas + ScrollControls + post-processing
│   │   ├── Track.tsx    # Neon racing track geometry
│   │   └── Skills.tsx   # 3D floating skill pills
│   └── ui/
│       ├── Overlay.tsx      # HTML sections over the 3D scene
│       ├── Nav.tsx          # Navigation + scroll dots
│       ├── ChatAssistant.tsx # AI chat bubble
│       ├── ContactForm.tsx  # Email form
│       ├── CursorTrail.tsx  # Neon particle trail
│       └── LoadingScreen.tsx
├── lib/
│   ├── scrollStore.ts   # Shared scroll progress ref
│   └── projects.ts      # Project data
└── hooks/
\`\`\`

## Getting Started

### Prerequisites
- Node.js 20+
- npm or pnpm

### Installation

\`\`\`bash
git clone https://github.com/ankitnegi-dev/portfolio.git
cd portfolio
npm install
\`\`\`

### Environment Variables

Create a \`.env.local\` file:

\`\`\`env
GROQ_API_KEY=your_groq_api_key        # Free at console.groq.com
RESEND_API_KEY=your_resend_api_key    # Free tier at resend.com
\`\`\`

### Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

\`\`\`bash
npm run build
npm run start
\`\`\`

## Featured Projects

| Project | Tech | Live |
|---|---|---|
| [TechDesk AI](https://github.com/ankitnegi-dev/Techdesk-ai-social-agent) | LangGraph, Kafka, RAG, Groq | GitHub |
| [FoodBridge](https://foodbridgeseven.vercel.app) | React 19, Supabase Realtime, PWA | Live |
| [ParForCharity](https://parforcharity.vercel.app) | Next.js, Stripe, Supabase | Live |
| [AI Dungeon Master](https://dungeon-master-kappa.vercel.app) | Groq LLaMA 3.3 70B, FLUX.1 | Live |

## License

MIT — feel free to use this as inspiration for your own portfolio. If you do, a star would be appreciated!

---

Built by [Ankit Negi](https://github.com/ankitnegi-dev) — CS undergraduate at IIITDM Kancheepuram
