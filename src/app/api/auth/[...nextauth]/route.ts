import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {cookies} from "next/headers";

const handler = NextAuth({
    pages: {
        signIn: "/account/login"
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { },
                password: { }
            },
            async authorize(credentials) {
                if (!credentials) {
                    return null;
                }

                try {
                    const cookiesStore = await cookies();

                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/login`,
                        {
                            method: "POST",
                            body: JSON.stringify(credentials),
                            headers: {
                                "Content-Type": "application/json",
                            }
                        }
                    );

                    if (!response.ok) {
                        return null
                    }

                    const authData = await response.json();

                    if (!authData.accessToken) {
                        return null
                    }

                    cookiesStore.set("accessToken", authData.accessToken);

                    return await authData.userToken;
                } catch (error) {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.claims = user.claims;
                token.fullName = user.fullName;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.fullName = token.fullName;
            session.user.role = token.role;
            session.user.claims = token.claims;
            return session;
        },
    },
    session: {
        strategy: 'jwt',
        maxAge: 40 * 60 * 60
    }
})

export { handler as GET, handler as POST }