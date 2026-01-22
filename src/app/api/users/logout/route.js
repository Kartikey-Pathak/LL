import { NextResponse } from "next/server";
export async function GET(req){
   try {
    
    const resp=NextResponse.json({
        message:"Logout Success",
        success:true
    })

    resp.cookies.set("token","",{httpOnly:true,expires:new Date(0)});

    return resp;
   } catch (error) {
    console.log("Error At LogOut Route",error);
    return NextResponse.json({error:"Problem"},{status:500});
   } 
}