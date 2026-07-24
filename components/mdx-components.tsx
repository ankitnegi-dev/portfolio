import type { MDXComponents } from "mdx/types";
import { AgentGraph3D } from "@/components/agent-graph-3d";

export const mdxComponents: MDXComponents = {
  AgentGraph3D,
  h2: (props) => (
    <h2
      className="font-display text-xl font-semibold mt-10 mb-3 first:mt-0"
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4"
      {...props}
    />
  ),
  strong: (props) => (
    <strong className="text-[var(--text-primary)] font-medium" {...props} />
  ),
  ul: (props) => (
    <ul
      className="list-disc list-inside space-y-1 text-[var(--text-secondary)] text-sm mb-4"
      {...props}
    />
  ),
  a: (props) => (
    <a
      className="text-[var(--accent)] hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="font-mono text-xs bg-[var(--surface-2)] border border-[var(--border)] rounded px-1.5 py-0.5"
      {...props}
    />
  ),
};