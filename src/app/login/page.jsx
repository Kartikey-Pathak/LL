"use client";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "@/lib/utils";

export default function LoginFormDemo() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    if (!user.email || !user.password) {
      toast.error("Fill The Details");
      return;
    }
    try {
      setLoading(true);
      const resp = await axios.post("/api/users/login", user);
      console.log("Login Success", resp.data);
      toast.success("Logged In Account.");
      router.push("/");
    } catch (error) {
      const message = error?.response?.data?.error || "Something went wrong";
      toast.error(message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className=" w-full dark:bg-black  h-fit flex items-center justify-center">
    <div className="shadow-input mx-auto w-full h-screen max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black flex flex-col justify-center">
      <Toaster />
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Log In
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Enter your credentials to continue
      </p>

      <div className="my-8 flex flex-col gap-4">
        <LabelInputContainer>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="projectmayhem@fc.com"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </LabelInputContainer>

        <button
          onClick={handleLogin}
          className="group/btn relative hover:opacity-70 active:opacity-60 active:border-2 active:border-white active:dark:opacity-60 transition-all mt-4 cursor-pointer block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          disabled={loading}
        >
          {loading ? "Logging In..." : "Submit"}
          <BottomGradient />
        </button>

        <h3 className="mt-5 text-sm text-neutral-600 dark:text-neutral-300">
          Don't have an account?{" "}
          <Link href="/signup" className=" cursor-pointer hover:text-blue-400 active:text-blue-400  transition-all text-blue-700">
            Sign Up
          </Link>
        </h3>
      </div>
    </div>
    </section>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>;
};
