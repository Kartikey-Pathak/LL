import { connect } from "@/dbconfig/dbconfig.js";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import { Sendotpemail } from "@/helpers/Sendotpemail";

connect();  //DB Connection

export async function POST(req) {
    try {
        const body = await req.json();
        const { username, email, password } = body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashotp = await bcrypt.hash(otp, 10);

        console.log(body);
        const user = await User.findOne({ email });
        const nameexists=await User.findOne({username});
        if(nameexists){
            return NextResponse.json({ error: "UserName Exists, Try Different Name.." }, { status: 401 })
        }
        

        if (user && user.isVerified) {
            return NextResponse.json({ error: "User Exists, You Can LogIn.." }, { status: 401 })
        }
        if (user && !user.isVerified) {
            //otp Sent..
            await Sendotpemail(email, otp);

            return NextResponse.json({ message: "OTP Sent Verify And You Can LogIn.." }, { status: 205 })
        }

        const hash = await bcrypt.hash(password, 10);


        const newuser = new User({
            username,
            email,
            password: hash,
            oauth: false,
            isVerified: false,
            VerifyCode: hashotp,
            VerifyCodeExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 min
        })

        const save = await newuser.save();
        console.log(save);

        //otp Sent..
        await Sendotpemail(email, otp);

        return NextResponse.json({ message: "User Created", success: true, newuser }, { status: 201 })


    } catch (error) {
        console.log(error, "Problem occured");
        return NextResponse.json({ error: "Server Error" }, { status: 500 })
    }

}