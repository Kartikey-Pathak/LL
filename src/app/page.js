"use client"
import axios from "axios";
import Link from "next/link";
import toast, { Toaster } from 'react-hot-toast';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/stateful-button";

export default function Home() {
  const [name, setname] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [sure, setsure] = useState(false);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    setFormattedDate(`${month}/${day}/${year}`);

    const fetchUser = async () => {
      try {
        const resp = await axios.get("/api/users/info");
        console.log(resp);
        setname(resp.data.username);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [])
  const router = useRouter();

  const Logout = async () => {
    try {
      await axios.get("api/users/logout");
      toast.success("Logged Out!!");
      router.push("/login");

    } catch (error) {
      const message = error?.response?.data?.error || "Something went wrong";

      toast.error(message);
      console.log(error);

    }
  }

  const DeleteUser = async () => {

    try {
      const resp = await axios.delete("/api/users/delete", { withCredentials: true });
      if (resp.status === 201) {
        toast.success("Logged Out!!");
        setsure(false);
        router.push("/login");
        return;
      }
      toast.error("Some Problem Occured Report User..");
    } catch (error) {
      console.log(error);

    }
  };

  return (
    <>
      <div className={`flex min-h-screen relative ${sure ? "overflow-hidden" : "overflow-y-scroll"}  flex-col bg-zinc-50 font-sans dark:bg-black`}>
        {sure ?
          <div onClick={() => { setsure(false) }} className=" backdrop-blur-xl flex items-center justify-center h-full w-full fixed z-50">
            <div onClick={(e) => e.stopPropagation()} className=" absolute z-[100] flex items-center bg-[#303030]/60 flex-col gap-3 justify-center h-44 w-80 md:w-96 rounded-3xl">
              <h1>Are You Sure</h1>
              <h1>Your Chat History Will Be Deleted Too.</h1>
              <div className=" flex items-center justify-center flex-row gap-5">
                <button onClick={DeleteUser} className="btn btn-soft btn-error">Yes</button>
                <button onClick={() => { setsure(false) }} className="btn btn-soft btn-success">No</button>
              </div>
            </div>
          </div>
          : null}
        <div className=" w-full flex justify-between">
          <Link href="/" className=" text-4xl m-5 ml-10 font-bold text-black dark:text-white">LLama   </Link>
          <button onClick={Logout} className=" text-white bg-[#1F1F1F] w-24 h-12 p-3 text-sm font-semibold mt-5 border-2 border-gray-950 cursor-pointer mr-5 hover:bg-[#1F1F1F]/80 transition-all active:opacity-85 rounded-4xl">LogOut</button>
        </div>

        <Link href="/chatai" className=" fixed bottom-10 flex-row flex hover:scale-105 transition-all active:scale-105  items-center justify-between right-0 left-0 mx-auto font-medium backdrop-blur-xl text-[#929292] mt-10 bg-[#3A3A3A] p-4 rounded-4xl w-64 h-14">
          Ask LLama
          <div className=" size-9 rounded-full flex items-center justify-center text-center bg-[#929292]">
            <i className="fa-solid fa-arrow-up font-bold text-[1.1rem] text-[#3A3A3A]"></i>
          </div>
        </Link>
        <div className=" w-full flex items-center  flex-col justify-center mt-5">
          <p className="text-[#929292]">{formattedDate}</p>
          {<h1 className=" dark:text-white text-black text-xl md:text-2xl mt-1 font-semibold">Welcome, <span className=" text-[#929292]">{name}</span></h1>}
          <h1 className=" mt-10 dark:text-white text-black text-4xl md:text-6xl font-semibold">Introducing LLama</h1>
          <Link href="/chatai" className=" mt-10 bg-black dark:bg-white h-12 cursor-pointer hover:opacity-70 transition-all active:opacity-70 w-40 flex items-center justify-center rounded-4xl text-white dark:text-black gap-3">Get Started <i className=" dark:text-black text-white rotate-50 font-semibold fa-solid fa-arrow-up"></i></Link>

          <h3 className=" mt-10 font-semibold text-black dark:text-[#929292]">Note :- This Ai Model Is Trained Till Oct 2023.</h3>


          <div className=" mt-20 border-2 border-[#1F1F1F] w-[90%]  md:w-[50%]"></div>

          <div className=" mt-20 w-[90%]  md:w-[50%] flex-col flex items-center justify-center">
            <h3 className=" dark:text-white">We've built a conversational AI powered by the LLaMA model, designed to interact naturally and intelligently with users.
              Its dialogue-based approach allows it to answer follow-up questions, reason through problems, acknowledge limitations, and respond responsibly.

              This model is accessible through OpenRouter, enabling developers and users to integrate powerful language understanding into their applications with ease.

              We're excited to share this model and gather feedback to improve its performance, reliability, and real-world usefulness.</h3>

            <div className=" bg-[#0E161A]  p-5 rounded-2xl mt-10 text-xs text-gray-400 ">
              Tip: If no error is visible, check whether the response is being filtered,
              streamed, or stopped by the selected model or channel configuration.
            </div>
            <div className=" mt-10 bg-[#1F1F1F]  p-5 rounded-2xl mt-10 text-xs text-gray-400 ">
              The request completed, but no error was returned.
              This can happen if the model channel is misconfigured or the response is blocked upstream.
            </div>
            <div className=" mt-10 bg-[#0E161A]  p-5 rounded-2xl mt-10 text-xs text-gray-400 ">
              LLaMA Assistant : <br />
              <br />

              It's difficult to determine the exact issue without more context about what the code is intended to do and how it behaves at runtime. However, one possible concern in the snippet you shared is that the resultWorkerErr channel is never closed. If this channel is expected to signal completion or failure, leaving it open could cause the program to block indefinitely while waiting for a value.

              This situation can occur if the worker function never returns an error or if execution is interrupted before an error is sent. In such cases, any goroutine waiting on the channel would continue waiting, resulting in a hang.

              To avoid this, you can ensure the channel is properly closed after writing to it. For example, closing the channel immediately after sending the error guarantees that listeners are notified that no further values will be sent:
            </div>

            <h3 className=" dark:text-white mt-10"> <span className=" font-semibold text-2xl">Methods</span> <br />
              <br />

              This model was trained using Reinforcement Learning from Human Feedback (RLHF) to improve helpfulness, accuracy, and alignment with user intent. The training process builds on established instruction-following techniques, with adaptations tailored for conversational use.

              We began with supervised fine-tuning, where human trainers created example conversations by acting as both the user and the assistant. These dialogues were designed to reflect real-world usage, with trainers sometimes referencing model-generated suggestions to improve response quality and consistency. <br />  <br />  This conversational dataset was combined with existing instruction-based data that was reformatted into dialogue form.

              To further refine the model's behavior, we trained a reward model using human preference data. Trainers were shown multiple responses generated by the model for the same prompt and asked to rank them based on quality. These rankings were used to teach the model which responses humans prefer.

              Using this reward model, we applied reinforcement learning techniques, specifically Proximal Policy Optimization (PPO), to iteratively improve performance. This process was repeated multiple times, allowing the model to better align with human expectations over successive training cycles.</h3>

            <h3 className="dark:text-white mt-10">
              <span className="font-semibold text-2xl">Limitations</span>
              <br /><br />

              The model may sometimes generate responses that sound convincing but are incorrect,
              incomplete, or nonsensical. Addressing this is challenging because there is no
              single source of truth during reinforcement learning, and making the model overly
              cautious can reduce its ability to answer valid questions.

              <br /><br />

              The assistant can be sensitive to prompt phrasing. Small changes in wording or
              repeated attempts at the same question may lead to different answers, including
              shifts between uncertainty and confidence.

              <br /><br />

              In some cases, the model may be overly verbose or repeat common explanations. This
              behavior stems from training biases where longer responses are often preferred and
              from known optimization trade-offs.

              <br /><br />

              Ideally, the model would ask clarifying questions when prompts are ambiguous.
              However, it may instead assume user intent, which can lead to inaccurate responses.

              <br /><br />

              While safety mechanisms are in place, the model may occasionally generate biased or
              unsafe content. Continuous user feedback is essential for improving reliability,
              safety, and overall performance.
            </h3>

            <h1 className=" font-semibold text-2xl md:text-4xl mt-20">Things You Can Ask :</h1>

            <div className="mt-10 bg-[#0E161A] p-5 rounded-2xl text-xs text-gray-400">
              You can ask LLama to explain complex programming concepts in simple terms,
              such as how APIs work, what closures are, or how authentication flows function
              in real-world applications.
            </div>

            <div className="mt-10 bg-[#1F1F1F] p-5 rounded-2xl text-xs text-gray-400">
              LLama can help debug code by analyzing logic, identifying common pitfalls,
              and suggesting improvements—whether you're working with JavaScript, React,
              backend APIs, or databases.
            </div>

            <div className="mt-10 bg-[#0E161A] p-5 rounded-2xl text-xs text-gray-400">
              You can use LLama to generate ideas, such as project concepts, feature
              suggestions, UI copy, landing page text, or even naming ideas for products
              and startups.
            </div>

            <div className="mt-10 bg-[#1F1F1F] p-5 rounded-2xl text-xs text-gray-400">
              LLama can assist with learning by breaking down topics step-by-step,
              answering follow-up questions, and adapting explanations based on what
              you already understand.
            </div>

            <div className="mt-10 bg-[#0E161A] p-5 rounded-2xl text-xs text-gray-400">
              You can ask LLama to review text for clarity, rewrite content in a more
              professional or casual tone, summarize long explanations, or improve
              documentation and comments.
            </div>



            <div className=" flex items-center justify-end mt-20">
              <Button onClick={() => setsure(true)} >Delete Profile</Button>
            </div>


            <footer className="w-full mt-32 border-t border-[#1F1F1F] dark:border-[#303030] py-10 text-sm text-[#8F8F8F]">
              <div className="w-[90%] md:w-[95%] mx-auto flex flex-col md:flex-row justify-between gap-6">

                {/* Left */}
                <div>
                  <h4 className="font-semibold text-black dark:text-white">LLama</h4>
                  <p className="mt-2 max-w-sm">
                    A conversational AI powered by LLaMA, built for natural interaction,
                    thoughtful responses, and responsible use.
                  </p>
                </div>

                <div className="flex gap-10">
                  <div className="flex flex-col gap-2">
                    <span className="font-medium text-black dark:text-white">Product</span>
                    <span className="hover:underline cursor-pointer">Chat</span>
                    <span className="hover:underline cursor-pointer">Models</span>
                    <span className="hover:underline cursor-pointer">API</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="font-medium text-black dark:text-white">Resources</span>
                    <span className="hover:underline cursor-pointer">Documentation</span>
                    <span className="hover:underline cursor-pointer">Safety</span>
                    <span className="hover:underline cursor-pointer">Status</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="font-medium text-black dark:text-white">Company</span>
                    <span className="hover:underline cursor-pointer">About</span>
                    <span className="hover:underline cursor-pointer">Privacy</span>
                    <span className="hover:underline cursor-pointer">Terms</span>
                  </div>

                </div>
                <div className="flex flex-col gap-3 w-fit items-start">
                  <span className="font-medium text-black dark:text-white">Developer Profiles</span>
                  <a href="https://github.com/Kartikey-Pathak"><span className="hover:underline cursor-pointer flex items-center justify-center gap-1">GitHub <i class="fa-brands font-semibold text-2xl fa-github"></i></span></a>
                  <a href="https://www.linkedin.com/in/kartikey-pathakb580297/"><span className="hover:underline cursor-pointer flex items-center justify-center gap-1">Linkedin <i class="fa-brands font-semibold text-2xl fa-linkedin"></i></span></a>
                  <a href="https://x.com/Kartikey7070"><span className="hover:underline cursor-pointer flex items-center justify-center gap-1">Twitter(X) <i class="fa-brands font-semibold text-2xl fa-twitter"></i></span></a>
                </div>


              </div>

              {/* Bottom line */}
              <div className="w-[90%] md:w-[70%] mx-auto mt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                <span>© {new Date().getFullYear()} LLama. All rights reserved.</span>
                <span className="opacity-70">
                  Built with OpenRouter • LLaMA Model
                </span>
              </div>
            </footer>





          </div>
        </div>

      </div>
    </>
  );
}
