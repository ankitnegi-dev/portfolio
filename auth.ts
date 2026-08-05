import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ profile }) {
      const allowedUsername = process.env.ADMIN_GITHUB_USERNAME;
      const login = (profile as { login?: string } | undefined)?.login;
      return login === allowedUsername;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
});