import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { connect } from "@/dbconfig/dbconfig";
import { User } from "@/models/User";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),

        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
    ],

    callbacks: {
        async signIn({ user }) {
            await connect();

            // Check if user exists
            let existingUser = await User.findOne({
                email: user.email,
            });

            // Create user if not exists
            if (!existingUser) {
                existingUser = await User.create({
                    email: user.email,
                    username: user.name,
                    isVerified:true,
                    oauth: true, // optional flag
                });
            }

            return true;
        },

        async session({ session }) {
            await connect();

            const dbUser = await User.findOne({
                email: session.user.email,
            });

            session.user.id = dbUser._id;

            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
