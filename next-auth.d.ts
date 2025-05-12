import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            fullName: string;
            role: [string];
            claims: [object];
        } & DefaultSession["user"];
    }
    interface User {
        id: string;
        fullName: string;
        role: [string];
        claims: [object];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        fullName: string;
        role: [string];
        claims: [object];
    }
}