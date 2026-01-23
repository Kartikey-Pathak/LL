"use client";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import { use, useState } from "react";
import Link from 'next/link'
import { useRouter } from "next/navigation";



export default function Signup() {
    const [loading, setloading] = useState(false);
    const router = useRouter();
    const [user, setuser] = useState({
        username: "",
        email: "",
        password: ""
    });

    const notify = () => toast('Created Account.');

    const Signup = async () => {
      
        if (!user.email || !user.username || !user.password) {
            alert("Fill The Details");
            return;
        }
        try {
            setloading(true);
             const resp= await axios.post("/api/users/signup",user);
             console.log("Sign Up Success",resp.data);

             router.push(`/verify?email=${encodeURIComponent(user.email)}`);
              notify();
        } catch (error) {
             const message =error?.response?.data?.error || "Something went wrong";
            
                toast.error(message);
            console.log(error);

        } finally {
            setloading(false);
        }



    }


    return (
        <>
            <div className=" w-full h-screen flex items-center flex-col justify-center">
                <Toaster />

                <h1 className=" font-bold text-white text-5xl mb-11">Create Account</h1>
                {loading ? <h1 className=" font-bold text-white text-xl mb-2">Creating....</h1> : null}
                <div className=" flex items-center justify-center flex-col gap-5">
                    <div className=" flex items-center w-full max-w-md gap-5 justify-between">
                        <label htmlFor="username">UserName : </label>
                        <input type="text" id="username" className=" border-2 border-gray-300 rounded-xl p-2" placeholder="Enter Name" onChange={(e) => { setuser({ ...user, username: e.target.value }) }} />
                    </div>
                    <div className=" flex items-center w-full max-w-md gap-5 justify-between">
                        <label htmlFor="email">Email : </label>
                        <input type="email" id="email" className=" border-2 border-gray-300 rounded-xl p-2" placeholder="Enter email" onChange={(e) => { setuser({ ...user, email: e.target.value }) }} />
                    </div>
                    <div className=" flex items-center gap-5 w-full  max-w-md justify-between">
                        <label htmlFor="password">Password : </label>
                        <input type="password" id="password" className=" border-2 border-gray-300 rounded-xl p-2" placeholder="Enter password" onChange={(e) => { setuser({ ...user, password: e.target.value }) }} />
                    </div>
                    <button onClick={Signup} className=" text-white bg-gray-700 px-7 py-3 mt-5 border-2 border-gray-950 cursor-pointer hover:opacity-85 transition-all active:opacity-85 rounded-xl">Submit</button>

                    <h3 className=" mt-5 text-gray-400 font-medium text-xl">Already have account? <Link href="/login" className=" text-blue-700">Login</Link></h3>
                </div>
            </div>
        </>
    )
}