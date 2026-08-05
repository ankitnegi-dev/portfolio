import { signIn } from "@/auth";

export default function AdminLoginPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-sm w-full text-center">
        <p className="font-mono text-xs text-[var(--text-muted)] mb-2">
            {"// Restricted Area"}
        </p>
        <h1 className="font-display text-xl font-semibold mb-6">
          Admin access
        </h1>
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/admin" });
          }}
        >
          <button
            type="submit"
            className="w-full rounded-[var(--radius-sm)] bg-[var(--accent)] text-[var(--bg)] text-sm font-medium px-4 py-2.5 hover:opacity-90 transition-opacity"
          >
            Sign in with GitHub
          </button>
        </form>
      </div>
    </div>
  );
}