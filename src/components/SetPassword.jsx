"use client";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";


import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import {
    IconBrandGithub,
    IconBrandGoogle,
    IconBrandOnlyfans,
} from "@tabler/icons-react";



export default function SetPassword() {
    const [passwords, setpasswords] = useState({
        password: "",
        confpassword: "",
    });
    
      const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            if (!passwords.password || !passwords.confpassword) {
                alert("Fill Both...");
                return;
            }
            if (passwords.password != passwords.confpassword) {
                alert("Both field should have same values...");
                return;

            }
            const pass=passwords.confpassword;

            const resp = await axios.post("/api/users/set-password", {email,pass});
            console.log("set password Success", resp.data);
            toast.success("Password Saved You Can Log In.");


            router.push("/login");


        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <section className=" h-screen w-full flex items-center justify-center">
                <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
                    <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                        Set Password
                    </h2>
                    <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                        Login to aceternity if you can because we don&apos;t have a login flow
                        yet
                    </p>

                    <form className="my-8" onSubmit={handlesubmit} >

                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="password">Password</Label>
                            <Input value={passwords.password} onChange={(e) => setpasswords({ ...passwords, password: e.target.value })} id="password" placeholder="projectmayhem@fc.com" type="password" />
                        </LabelInputContainer>

                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="confpassword">Confirm Password</Label>
                            <Input value={passwords.confpassword} onChange={(e) => setpasswords({ ...passwords, confpassword: e.target.value })} id="confpassword" placeholder="••••••••" type="password" />
                        </LabelInputContainer>


                        <button
                            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                            type="submit"
                        >
                            Save &rarr;
                            <BottomGradient />
                        </button>

                        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
                    </form>
                </div>
            </section>
        </>
    )
}
const BottomGradient = () => {
    return (
        <>
            <span
                className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span
                className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className
}) => {
    return (
        <div className={cn("flex w-full flex-col space-y-2", className)}>
            {children}
        </div>
    );
};