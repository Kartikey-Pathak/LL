"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Input } from "../../components/ui/input";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function Chat() {
    const [side, setside] = useState();
    const [input, setinput] = useState("");


    const [chatList, setChatList] = useState([]);
    const [activeChatIndex, setActiveChatIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingchat, setLoadingchat] = useState(true);

    const chatRef = useRef(null);

    //for Auto Scroll
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatList, activeChatIndex]);


    useEffect(() => {
        const loadChats = async () => {
            try {
                toast.success("Loading Chats");
                setLoadingchat(true);

                const res = await axios.get("/api/chatai", { withCredentials: true });
                const chatsArray = [];

                res.data.messages.forEach(msg => {

                    let chat = chatsArray.find(c => c.id === msg.chatId);

                    if (!chat) {
                        chat = { id: msg.chatId, title: msg.title, messages: [] };
                        chatsArray.push(chat);
                    }

                    chat.messages.push({
                        role: msg.role,
                        content: msg.content
                    });
                });
                setChatList(chatsArray);
                setActiveChatIndex(chatsArray.length ? 0 : null);
            } catch (err) {
                console.log(err);
            } finally {
                toast("Your Chats Are Being Saved. !");
                setLoadingchat(false);
            }
        };

        loadChats();
    }, []);


    useEffect(() => {
        const handlesize = () => {
            if (window.innerWidth < 1100) {
                setside(true);
            } else {
                setside(false);
            }
        }
        window.addEventListener("resize", handlesize);
        handlesize();

        return () => window.removeEventListener("resize", handlesize);
    })

    // useEffect(() => {
    //     const gettitle = async () => {
    //         try {
    //             let resp = await axios.get("/api/chatai", { withCredentials: true });
    //             console.log(resp);

    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    //     gettitle();
    // })

    const send = async () => {
        try {
            if (!input) {
                alert("Ask Anything !");
                return;
            }

            let updatedChatList = [...chatList];
            let chatIndex = activeChatIndex;

            //new chat
            if (chatIndex === null) {
                updatedChatList.push({
                    title: input.slice(0, 10),
                    id: crypto.randomUUID(),
                    messages: []
                });
                chatIndex = updatedChatList.length - 1;
                setActiveChatIndex(chatIndex);
            }

            // Add user message
            updatedChatList[chatIndex].messages.push({
                role: "user",
                content: input
            });
            setChatList(updatedChatList);
            setinput("");

            setLoading(true);

            // Prepare LLM memory
            const llmChats = updatedChatList[chatIndex].messages;
            const title = updatedChatList[chatIndex].title;
            const chatId = updatedChatList[chatIndex].id;

            let resp = await axios.post("/api/chatai", { chats: llmChats, chatId: chatId, title: title }, { withCredentials: true });

            //sync title from backend
            updatedChatList[chatIndex].title = resp.data.title;

            // Add The LLm Reply In State 
            updatedChatList[chatIndex].messages.push({
                role: "assistant",
                content: resp.data.message
            });


            setChatList([...updatedChatList]);
        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false); // stop loading
        }
    }

    const deletechat = async (index) => {
        try {
            const title = chatList[index].title;
            const resp = await axios.delete("/api/chatai", { data: { title }, withCredentials: true })
            if (resp.status === 200) {
                const chatIdToDelete = chatList[index].id;

                const newChatList = chatList.filter(chat => chat.id !== chatIdToDelete);
                setChatList(newChatList);

                //if the selected chat was deleted
                if (activeChatIndex !== null && chatList[activeChatIndex].id === chatIdToDelete) {
                    setActiveChatIndex(null);
                }



                toast.success("Chat Deleted");

            }

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            <nav className="h-12 border-b-2 border-[#CBCBCB] flex-row flex justify-between items-center p-5 dark:border-[#303030]">
                <Link href="/" className="dark:text-white text-black text-2xl font-medium">LLama  </Link>

                {side ?
                    <div>
                        <div className="drawer">
                            <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
                            <div className="drawer-content ">
                                {/* Page content here */}
                                <label htmlFor="my-drawer-1" className=" drawer-button"><i class="fa-solid fa-bars text-2xl cursor-pointer hover:text-gray-500 transition-all active:text-gray-500 active:dark:text-gray-500"></i></label>
                            </div>
                            <div className="drawer-side ">
                                <label htmlFor="my-drawer-1" aria-label="close sidebar" className="drawer-overlay bg-white/30 dark:bg-black/30 transition-all backdrop-blur-sm"></label>

                                <div className=" h-full w-80 bg-gray-200 dark:bg-[#181818] overflow-hidden">
                                    <div className="  h-12 mt-20 justify-between px-15 flex items-center flex-row gap-5">
                                        <h2 className=" m-1 font-semibold text-black dark:text-[#AFAFAF] ">Your Chats</h2>
                                        <button
                                            onClick={() => {
                                                setActiveChatIndex(null);
                                                toast.success("New Chat Created..");
                                            }
                                            }
                                            className="text-2xl size-9 flex items-center justify-center bg-[#242424] hover:dark:bg-[#242424]/50 active:bg-[#242424]/50 hover:bg-[#242424]/50 rounded-full cursor-pointer text-white hover:text-gray-300"
                                        >
                                            <i className=" text-white text-sm font-semibold fa-solid fa-plus"></i>
                                        </button>
                                    </div>
                                    <div className="  mt-10 w-full h-full flex-col ml-5  gap-3 flex justify-start items-start overflow-y-scroll">

                                        {chatList.map((chat, index) => (
                                            <div onClick={() => setActiveChatIndex(index)} key={index} className={` bg-[#242424] ${activeChatIndex === index ? "dark:bg-[#242424] bg-[#242424]/50 " : "bg-[#242424]/20"} justify-between flex-row h-10 w-56 flex items-center px-6 rounded-4xl`}>
                                                <h2>{chat.title}</h2>
                                                <i onClick={() => { deletechat(index) }} className=" text-red-500 font-semibold cursor-pointer hover:dark:text-red-300 hover:text-red-300 transition-all active:text-red-300 active:dark:text-red-300 fa-solid fa-trash"></i>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : null
                }

            </nav>

            <section className=" flex-row  flex dark:bg-[#212121]  xl:h-[93vh] h-[92vh] w-full bg-white ">
                <Toaster />
                {
                    loadingchat ?
                        <span className=" fixed z-50 left-0 right-0 mx-auto bottom-0 top-0 my-auto loading loading-spinner loading-xl text-white"></span> : null
                }
                {/* side Area */}
                {!side ?
                    <div className=" h-full w-80 bg-[#F9FAFB] dark:bg-[#181818] overflow-hidden">
                        <div className="  h-12 mt-20 justify-between px-5 flex items-center flex-row gap-5">
                            <h2 className=" m-1 font-semibold text-[#AFAFAF] ">Your Chats</h2>
                            <button
                                onClick={() => {
                                    setActiveChatIndex(null);
                                    toast.success("New Chat Created..");
                                }}
                                className="text-2xl size-9 flex items-center justify-center bg-[#242424] hover:dark:bg-[#242424]/50 active:bg-[#242424]/50 hover:bg-[#242424]/50 rounded-full cursor-pointer text-white hover:text-gray-300"
                            >
                                <i className=" text-white text-sm font-semibold fa-solid fa-plus"></i>
                            </button>
                        </div>
                        <div className="  mt-10 w-full h-full flex-col  gap-3 flex justify-start items-center overflow-y-scroll">

                            {chatList.map((chat, index) => (
                                <div onClick={() => setActiveChatIndex(index)} key={index} className={` bg-[#242424] ${activeChatIndex === index ? "bg-[#242424]" : "bg-[#242424]/20"} justify-between flex-row h-10 w-56 flex items-center px-6 rounded-4xl`}>
                                    <h2 className=" dark:text-white text-white">{chat.title}</h2>
                                    <i onClick={() => { deletechat(index) }} className=" text-red-500 font-semibold cursor-pointer hover:dark:text-red-300 hover:text-red-300 transition-all active:text-red-300 active:dark:text-red-300 fa-solid fa-trash"></i>
                                </div>
                            ))}
                        </div>
                    </div> : null
                }

                {/* chat area */}

                <div className=" px-1 lg:px-5 xl:px-7 w-full h-full flex flex-col items-center justify-center">

                    <div className="   w-full h-screen mb-10 lg:mb-1 overflow-y-scroll ">

                        {activeChatIndex !== null &&
                            chatList[activeChatIndex]?.messages?.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                                >
                                    <div
                                        className={` rounded-xl px-4 chat-content py-3 chat-bubble ${msg.role === "user" ? "dark:bg-[#303030] bg-gray-200 text-black dark:text-white " : " bg-transparent text-gray-800 dark:text-white chat-start"}`}
                                        dangerouslySetInnerHTML={{ __html: msg.content }}
                                    />
                                </div>
                            ))}
                        {/* Loader */}
                        {loading && activeChatIndex !== null && (
                            <div className="chat chat-start">
                                <div className="rounded-xl px-4 py-3 chat-bubble bg-transparent text-black dark:text-white">
                                    <span className="loading loading-ball loading-xl"></span>
                                </div>
                            </div>
                        )}
                        <div ref={chatRef} />
                    </div>

                    <div className=" fixed xl:static mb-2 md:mb-1 gap-2  bottom-0  w-full flex items-center justify-center">
                        <Input

                            type="text"
                            placeholder="Ask Anything"
                            onChange={(e) => setinput(e.target.value)}
                            value={input}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    send();
                                }}}

                            className=" p-5 cursor-pointer rounded-4xl h-13 md:h-14 w-[17rem] md:w-[35rem]  lg:w-[55rem]"
                        />
                        <button onClick={send} className=" cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-300 transition-all active:dark:bg-gray-400 active:bg-gray-400 size-11 md:size-12 dark:bg-white bg-black rounded-full flex items-center justify-center"><i className=" text-white dark:text-black fa-solid fa-arrow-up"></i></button>
                    </div>
                </div>

            </section>
        </>
    );
}
