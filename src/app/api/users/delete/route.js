import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { connect } from "@/dbconfig/dbconfig";
import { gettokeninfo } from "@/helpers/gettokeninfo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
connect();

export async function DELETE(req) {
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
            return NextResponse.json({ error: "Cannot Find User" }, { status: 401 })
        }

        await User.deleteOne({ _id: userId });

        const resp = NextResponse.json({ message: "Delete Success", success: true }, { status: 201 });

        resp.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
        console.log(resp);

        return resp;
    } catch (error) {
        console.log(error, "Occured at deleting user");
        return NextResponse.json({
            error: "Error Occured While Deleting User"
        }, { status: 500 })
    }

}