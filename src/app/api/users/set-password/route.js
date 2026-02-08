import { connect } from "@/dbconfig/dbconfig.js";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

connect();  //DB Connection

export async function POST(req) {

    try {
        const body = await req.json();
        const { email, pass } = body;

        const user = await User.findOne({ email });
        if (!user || !user.oauth) {
            return NextResponse.json(
                { error: "Invalid request" },
                { status: 400 }
            );
        }
        const hashed = await bcrypt.hash(pass, 10);
        user.password = hashed;
        await user.save();

        return NextResponse.json({
            message: "Password set successfully",
        },{status:200});

    } catch (error) {
        return NextResponse.json({ error: "problem" }, { status: 500 });
    }
}
