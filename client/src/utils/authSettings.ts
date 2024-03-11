import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/libs/db";
import bcrypt from "bcrypt";

export const authSettings = {
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text", placeholder: "naruto123" },
          password: {
            label: "Password",
            type: "password",
            placeholder: "******",
          },
        },
  
        // verify user account
        async authorize(credentials, req) : Promise<any>{
          console.log("credentials: ", credentials);
  
          // find user email
          const userFound = await db.user.findUnique({
            where: {
              email: credentials.email,
            },
          });
  
          if (!userFound) throw new Error("No user found");
          console.log("user Found: ", userFound);
  
          //compare passwords
          const matchPassword = await bcrypt.compare(
            credentials.password,
            userFound.password
          );
          if (!matchPassword) throw new Error("Wrong password");
  
          return {
            id: userFound.id.toString(),
            name: userFound.username,
            email: userFound.email,
          } as any
  
          return null;
        },
      }),
    ],
    pages: {
      signIn: "/auth/login",
    },
  //   secret: process.env.NEXTAUTH_SECRET,
  };

