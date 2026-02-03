import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { connect } from "@/dbconfig/dbconfig";
import { gettokeninfo } from "@/helpers/gettokeninfo";
connect();

export async function DELETE(req) {
    try {
        const userid = await gettokeninfo();
        const user = await User.findById(userid);

        if (!user) {
            return NextResponse.json({ error: "Cannot Find User" }, { status: 401 })
        }

        await User.deleteOne({ _id: userid });

        const resp = NextResponse.json({ message: "Delete Success", success: true },{status:201});

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