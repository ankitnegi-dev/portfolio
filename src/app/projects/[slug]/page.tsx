import { notFound } from 'next/navigation'
import { getProject, projects } from '@/lib/projects'
import type { Metadata } from 'next'
import ProjectClient from './ProjectClient'

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: project.name + ' — Ankit Negi',
    description: project.tagline,
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()
  return <ProjectClient project={project} />
}
