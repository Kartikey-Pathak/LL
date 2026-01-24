import { connect } from "@/dbconfig/dbconfig.js";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

connect();  //DB Connection

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password } = body;

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User Does Not Exist" }, { status: 400 });
        }
        if (user && !user.isVerified) {
            return NextResponse.json({ error: "User Not Verified,Re-Create Account" }, { status: 300 });

        }

        const iscorrect = await bcrypt.compare(password, user.password);
        if (!iscorrect) {
            return NextResponse.json({ error: "Invalid Password" }, { status: 401 });
        }

        const tokendata = {
            id: user._id,
            email: user.email,
            username: user.username
        }
        const token = jwt.sign(tokendata, process.env.TOKEN_SECRET, { expiresIn: "7d" });
        const resp = NextResponse.json({
            message: "LogIn Success",
            success: true,
        })
        resp.cookies.set("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        return resp;

    } catch (error) {
        return NextResponse.json({ error: "problem" }, { status: 500 });
    }

}
