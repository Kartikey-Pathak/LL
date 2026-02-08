"use client";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Label } from "../../components/ui/label";
import Link from "next/link";
import { Input } from "../../components/ui/input";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";

export default function SignupFormDemo() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.username || !user.email || !user.password) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const resp = await axios.post("/api/users/signup", user);
      console.log("Sign Up Success", resp.data);
      toast.success("Created Account.");
      router.push(`/verify?email=${encodeURIComponent(user.email)}`);
    } catch (error) {
      const message = error?.response?.data?.error || "Something went wrong";
      toast.error(message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    toast.success("Note : - Your Password Will Be Encrypted");

  }, [])

  return (
    <section className=" w-full dark:bg-black  h-full flex items-center justify-center">
      <div className="shadow-input mx-auto w-full h-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <Toaster />
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Welcome to LLama
        </h2>
        <p className="mt-10 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          Create Account In LLama,And Chat With Our AI
        </p>
        <form className="my-8 mt-10" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="projectmayhem"
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="projectmayhem@fc.com"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </LabelInputContainer>

          <button
            className="group/btn relative hover:opacity-70 active:opacity-60 active:border-2 active:border-white active:dark:opacity-60 transition-all mt-10 cursor-pointer block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Sign up →"}
            <BottomGradient />
          </button>
        </form>


        <div className="my-2 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => signIn("github")}
            className="group/btn shadow-input relative active:opacity-70 active:dark:opacity-70 flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            type="submit"
          >
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Continue with GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            onClick={() => signIn("google")}
            className="group/btn active:opacity-70 active:dark:opacity-70 shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            type="submit"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Continue with Google
            </span>
            <BottomGradient />
          </button>
        </div>
        <h3 className=" mt-9 text-sm text-neutral-600 dark:text-neutral-300">Already have account? <Link href="/login" className="cursor-pointer hover:text-blue-400 active:text-blue-400  transition-all text-blue-700">Login</Link></h3>

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
