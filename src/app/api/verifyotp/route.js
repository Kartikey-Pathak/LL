import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import { User } from "@/models/User";
import { connect } from "@/dbconfig/dbconfig.js";
connect();

export async function POST(req){

    try {
    const {email,otp}=await req.json();
    const user=await User.findOne({email});
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ error: "Already verified" }, { status: 400 });
    }

    if (user.VerifyCodeExpiry < Date.now()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    const isvalid=await bcrypt.compare(otp,user.VerifyCode);
     if (!isvalid) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }

    user.isVerified=true;
    user.VerifyCode="";
    user.VerifyCodeExpiry=undefined;
     await user.save();

       return NextResponse.json(
      { message: "Email verified successfully", success: true },
      { status: 200 }
    );

    } catch (error) {
        return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
    }
}