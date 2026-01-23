"use client"
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"
import toast from "react-hot-toast";

export default function Verify() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => {
            toast.success("OTP Sent. Check your email (and spam)");
        }, 300);
    }, [])

    const [otp, setotp] = useState("");
    const Verify = async () => {
        if (!otp) {
            toast("Fill The OTP")
            return;
        }
        try {
            setLoading(true);

            const res = await axios.post("/api/verifyotp", {
                email,
                otp,
            });

            toast.success(res.data.message || "Verified successfully");

            // redirect
            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);

        } catch (error) {
            const msg =
                error.response?.data?.message || "Verification failed";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className=" w-full h-screen flex items-center justify-center flex-col">
                <h1 className=" font-bold text-white text-3xl">Verify OTP</h1>
                <input value={otp} onChange={(e) => { setotp(e.target.value) }} type="number" placeholder="Enter 6 Digit OTP" className=" h-12 w-40 border-2 rounded-xl p-2" />
                <button onClick={Verify} className=" text-white bg-gray-700 px-7 py-3 mt-5 border-2 border-gray-950 cursor-pointer hover:opacity-85 transition-all active:opacity-85 rounded-xl">{loading ? "Verifying..." : "Submit"}</button>
            </div>
        </>
    )
}