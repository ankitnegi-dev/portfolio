"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useSession } from "next-auth/react";
import {
  IconHome,
  IconBriefcase,
  IconUser,
  IconMail,
  IconMessageCircle2,
  IconFileDownload,
  IconBrandGithub,
  IconLockAccess,
  IconExternalLink,
  IconTerminal2,
} from "@tabler/icons-react";
import { projects } from "@/lib/projects";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: IconHome },
  { label: "Work", href: "/projects", icon: IconBriefcase },
  { label: "About", href: "/about", icon: IconUser },
  { label: "Contact", href: "/contact", icon: IconMail },
];

const ITEM_CLASS =
  "flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--text-secondary)] cursor-pointer data-[selected=true]:bg-[var(--surface-2)] data-[selected=true]:text-[var(--text-primary)]";

const GROUP_CLASS =
  "font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wide px-2 pt-3 pb-1 first:pt-2 [&_[cmdk-group-items]]:mt-1";

const HIDDEN_PHRASE = "open sesame";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [easterEggMessage, setEasterEggMessage] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = Boolean(session?.user);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const go = useCallback(
    (href: string, external?: boolean) => {
      setOpen(false);
      if (external) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        router.push(href);
      }
    },
    [router]
  );

  const openAssistant = useCallback(() => {
    setOpen(false);
    window.dispatchEvent(new Event("open-assistant"));
  }, []);

  function showEasterEgg(message: string) {
    setEasterEggMessage(message);
  }

  if (!open) return null;

  const isHiddenPhraseMatched =
    search.trim().toLowerCase() === HIDDEN_PHRASE;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-1)] shadow-2xl overflow-hidden"
      >
        <Command
          filter={(value, search) =>
            value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
          }
        >
          <div className="flex items-center gap-2 border-b border-[var(--border)] px-4">
            <span className="font-mono text-xs text-[var(--text-muted)]">
              {">"}
            </span>
            <Command.Input
              autoFocus
              value={search}
              onValueChange={(v) => {
                setSearch(v);
                setEasterEggMessage(null);
              }}
              placeholder="Jump to a page, project, or action…"
              className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[var(--text-muted)]"
            />
            <kbd className="font-mono text-[10px] text-[var(--text-muted)] border border-[var(--border)] rounded px-1.5 py-0.5">
              esc
            </kbd>
          </div>

          {easterEggMessage && (
            <div className="px-4 py-3 border-b border-[var(--border)] font-mono text-xs text-[var(--accent)]">
              {easterEggMessage}
            </div>
          )}

          {isHiddenPhraseMatched && (
            <button
              onClick={() =>
                showEasterEgg(
                  "Okay, you actually typed that. respect. - ank12it11@gmail.com if you want to talk"
                )
              }
              className="w-full flex items-center gap-2.5 px-4 py-3 text-left text-sm text-[var(--accent)] hover:bg-[var(--surface-2)] transition-colors"
            >
              <IconTerminal2 size={16} stroke={1.5} />
              ... you found it.
            </button>
          )}

          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="px-3 py-6 text-center text-sm text-[var(--text-secondary)]">
              No results.
            </Command.Empty>

            <Command.Group heading="Navigate" className={GROUP_CLASS}>
              {NAV_ITEMS.map((item) => (
                <Command.Item
                  key={item.href}
                  value={item.label}
                  onSelect={() => go(item.href)}
                  className={ITEM_CLASS}
                >
                  <item.icon size={16} stroke={1.5} />
                  {item.label}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Projects" className={GROUP_CLASS}>
              {projects.map((project) => (
                <Command.Item
                  key={project.slug}
                  value={`${project.title} ${project.tagline}`}
                  onSelect={() => go(`/projects/${project.slug}`)}
                  className={ITEM_CLASS}
                >
                  <span className="w-4 text-center text-[var(--accent)]">·</span>
                  {project.title}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Actions" className={GROUP_CLASS}>
              <Command.Item
                value="Open AI assistant ask about Ankit"
                onSelect={openAssistant}
                className={ITEM_CLASS}
              >
                <IconMessageCircle2 size={16} stroke={1.5} />
                Ask the AI assistant
              </Command.Item>
              <Command.Item
                value="Download resume pdf contact"
                onSelect={() => go("/contact")}
                className={ITEM_CLASS}
              >
                <IconFileDownload size={16} stroke={1.5} />
                Download resume
              </Command.Item>
              <Command.Item
                value="GitHub open source code"
                onSelect={() => go("https://github.com/ankitnegi-dev", true)}
                className={ITEM_CLASS}
              >
                <IconBrandGithub size={16} stroke={1.5} />
                Open GitHub
                <IconExternalLink
                  size={12}
                  stroke={1.5}
                  className="ml-auto text-[var(--text-muted)]"
                />
              </Command.Item>
            </Command.Group>

            <Command.Group heading="???" className={GROUP_CLASS}>
              <Command.Item
                value="sudo"
                onSelect={() =>
                  showEasterEgg("sudo: permission denied - nice try though")
                }
                className={ITEM_CLASS}
              >
                <IconTerminal2 size={16} stroke={1.5} />
                sudo
              </Command.Item>
              <Command.Item
                value="whoami"
                onSelect={() =>
                  showEasterEgg(
                    "You're the kind of person who checks command palettes for hidden commands. respect."
                  )
                }
                className={ITEM_CLASS}
              >
                <IconTerminal2 size={16} stroke={1.5} />
                whoami
              </Command.Item>
              <Command.Item
                value="matrix"
                onSelect={() =>
                  showEasterEgg(
                    "There is no spoon - but there is a real 3D agent graph on the TechDesk AI case study, go look"
                  )
                }
                className={ITEM_CLASS}
              >
                <IconTerminal2 size={16} stroke={1.5} />
                matrix
              </Command.Item>
            </Command.Group>

            {isAdmin && (
              <Command.Group heading="Admin" className={GROUP_CLASS}>
                <Command.Item
                  value="admin dashboard"
                  onSelect={() => go("/admin")}
                  className={ITEM_CLASS}
                >
                  <IconLockAccess
                    size={16}
                    stroke={1.5}
                    className="text-[var(--accent)]"
                  />
                  Go to admin dashboard
                </Command.Item>
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}