
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from "bcrypt"
import db from '@/libs/db'

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        return NextResponse.json('registering');
    } catch (error) {
        console.error('Error:', error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}

export async function POST(req: NextRequest, res: NextResponse): Promise<NextResponse> {
    try {

        const data = await req.json();
        console.log("api_data:",data);

        //Find user email on db
        const userFound = await db.user.findUnique({
            where:{
                email: data.email
            }
        })

        //verified if useremail is unique
        if(userFound){
            return NextResponse.json({
                message: "Email already  exists!"
            },{
                status: 400
            })
        }
        
        //Find user name on db
        const usernameFound = await db.user.findUnique({
            where: {
              username: data.username,
            },
        })
      
        //verified if username is unique
        if (usernameFound) {
            return NextResponse.json(
              {
                message: "username already exists",
              },
              {
                status: 400,
              }
            );
        }

        //cypher password
        const cypherPassword = await bcrypt.hash(data.password, 10);

        //create user on DB
        const newUser = await db.user.create({
            data:{
                username: data.username,
                email: data.email,
                password: cypherPassword,
            },
        })

        // send user data without password
        const { password: _, ...user } = newUser;

        //send response
        return NextResponse.json(user);
    } catch (error) {
        console.error('Error:', error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
