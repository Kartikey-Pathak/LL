import { NextResponse } from "next/server";
import { gettokeninfo } from "@/helpers/gettokeninfo";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/dbconfig/dbconfig";

connect();

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        let userId = null;

        if (session) {
            userId = session.user.id;
        } else {
            userId = await gettokeninfo(req);
        }

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }



        const user = await User.findOne({ _id: userId });


        if (!user) {
            return NextResponse.json({ error: "Didnt  Found Name" }, { status: 400 });
        }

        return NextResponse.json({ username: user.username }, { status: 200 });


    } catch (error) {

        return NextResponse.json({ error: "Error In Info" }, { status: 500 });

    }

}