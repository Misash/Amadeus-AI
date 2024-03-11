import NextAuth from "next-auth";
import { authSettings } from "@/utils/authSettings";


const handler = NextAuth(authSettings);

export { handler as GET, handler as POST };

