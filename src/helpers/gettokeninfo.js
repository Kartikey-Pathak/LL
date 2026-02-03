
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function gettokeninfo(req) {

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) {
            throw new Error("Token not found");
        }
        const encode_data = jwt.verify(token, process.env.TOKEN_SECRET);

        return encode_data.id;

    } catch (error) {
        throw new Error(error.message);
    }

}