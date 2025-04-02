import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import type { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
const bcrypt = require("bcrypt");

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt" as const,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            role: true,
            fullName: true,
            position: true,
            height: true,
            jerseyNumber: true,
            playerCode: true,
            passwordHash: true,
          },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          position: user.position || undefined,
          height: user.height || undefined,
          jerseyNumber: user.jerseyNumber || undefined,
          playerCode: user.playerCode || undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.fullName = user.fullName;
        token.position = user.position;
        token.height = user.height;
        token.jerseyNumber = user.jerseyNumber;
        token.playerCode = user.playerCode;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.email = token.email;
      session.user.fullName = token.fullName;
      session.user.position = token.position;
      session.user.height = token.height;
      session.user.jerseyNumber = token.jerseyNumber;
      session.user.playerCode = token.playerCode;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
