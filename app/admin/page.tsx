import { auth, signOut } from "@/auth";

export default async function AdminPage() {
  const session = await auth();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs text-[var(--text-muted)]">
                {"// Admin Dashboard"}
          </p>
          <h1 className="font-display text-xl font-semibold">
            Welcome, {session?.user?.name}
          </h1>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>

      <p className="text-sm text-[var(--text-secondary)]">
        Dashboard content coming next.
      </p>
    </div>
  );
}