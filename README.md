# Ankit Negi - Portfolio

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

Personal portfolio built with Next.js, TypeScript, and Tailwind CSS. Live at [ankit-negi.is-a.dev](https://ankit-negi.is-a.dev).

## Features

- **Dark "engineering console" theme** - custom design tokens, Space Grotesk / Inter / JetBrains Mono type system
- **MDX case studies** - deep-dive write-ups for flagship projects, rendered from `content/projects/*.mdx`, with an optional-by-default workflow: projects without a case study link straight to their live demo/GitHub instead
- **3D agent architecture graph** - an interactive Three.js / React Three Fiber visualization embedded in the TechDesk AI case study, with cursor-driven camera drift instead of static auto-rotation, lazy-loaded via `IntersectionObserver` so it only costs anything once scrolled into view
- **3D retrieval pipeline visualization** - a second Three.js diagram embedded in the DocIntel case study, showing the hybrid vector + BM25 retrieval flow through RRF fusion and re-ranking
- **Hero wireframe centerpiece** - a rotating wireframe icosahedron beside the hero text on desktop, with subtle cursor-driven tilt layered on top of ambient rotation
- **AI assistant widget** - a chat widget grounded in this site's actual content, backed by a separate FastAPI service (see [`/backend`](./backend)) calling the Groq API
- **Framer Motion throughout** - staggered hero entrance, scroll-reveal on cards, hover interactions, page transitions - all respecting `prefers-reduced-motion`
- **Scoped glassmorphism** - frosted-glass surfaces on the nav bar (on scroll) and the assistant widget panel, layered on the existing design tokens rather than a new visual language
- **Cursor-reactive project cards** - subtle 3D tilt on hover using Framer Motion's motion values, disabled under `prefers-reduced-motion`
- **Full SEO/metadata pass** - dynamic OG image generation, JSON-LD Person schema, sitemap, robots.txt
- **Lighthouse: 96 Performance / 100 Accessibility / 100 Best Practices / 100 SEO** (tested on the heaviest page, throttled mobile emulation)

## Tech stack

**Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion, React Three Fiber + Drei
**Content:** MDX via `next-mdx-remote`, `gray-matter` for frontmatter
**Backend:** FastAPI, Groq API (see [`/backend/README.md`](./backend/README.md) for setup)
**Deployment:** Vercel (frontend), Render (backend)

## Project structure

```
app/                  routes (App Router)
├── projects/[slug]/  dynamic case study pages
├── api/chat/         proxy route to the FastAPI backend
components/           UI components
├── animated/         reusable Framer Motion wrappers
content/projects/     MDX case study source files
lib/                  project data, MDX loader, site config
backend/              separate FastAPI service for the AI assistant
```

## Local setup

```
bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To run the AI assistant locally, also start the backend - see [`backend/README.md`](./backend/README.md). Without it, the chat widget still works and returns a graceful fallback message.

### Environment variables

Copy `.env.local.example` to `.env.local`:
RAG_API_URL= # URL of the deployed/local FastAPI backend
NEXT_PUBLIC_SITE_URL= # used for sitemap, robots.txt, and OG tags

## Adding a new project

Add an entry to `lib/projects.ts`. That's it - it'll appear on the home and work pages automatically. If you also want a full case study, add a matching `content/projects/<slug>.mdx` file; without one, the project card links straight to its `demo` or `github` URL instead.

## License

Personal project - feel free to reference the code, but please don't republish it as your own portfolio.