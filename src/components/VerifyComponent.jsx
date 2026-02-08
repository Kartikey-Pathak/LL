"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function Verify() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      toast.success("OTP Sent. Check your email (and spam)");
    }, 300);

    return () => clearTimeout(t);
  }, []);

  const handleVerify = async () => {
    if (!otp) {
      toast.error("Fill The OTP");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("/api/verifyotp", { email, otp });
      toast.success(res.data.message || "Verified successfully");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      console.log(error);
      const msg = error.response?.data?.error || error.response?.data?.message || "Verification failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow-input mx-auto w-full h-screen max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black flex flex-col items-center justify-center">
      <Toaster />
      <h1 className="font-bold text-3xl text-neutral-800 dark:text-neutral-200 mb-6">
        Verify OTP
      </h1>
      <input
        type="number"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter 6 Digit OTP"
        className="h-12 w-full max-w-xs border-2 rounded-xl p-2 mb-4 text-black dark:text-white dark:bg-neutral-800"
      />
      <button
        onClick={handleVerify}
        className="text-white  bg-gray-700 px-7 py-3 mt-2 border-2 border-gray-950 cursor-pointer hover:opacity-85 transition-all active:opacity-85 rounded-xl w-full max-w-xs"
        disabled={loading}
      >
        {loading ? "Verifying..." : "Submit"}
      </button>
    </div>
  );
}
