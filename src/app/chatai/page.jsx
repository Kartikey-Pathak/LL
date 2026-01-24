"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Input } from "../../components/ui/input";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [currentTitle, setCurrentTitle] = useState(null);
    const [chats, setChats] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false); //loader state

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]); // scroll

    useEffect(() => {
        const loadChats = async () => {
            try {
                const res = await axios.get("/api/chatai", { withCredentials: true });
                setChats(res.data.chats || []);

                if (res.data.chats?.length) {
                    const lastChat = res.data.chats[res.data.chats.length - 1];
                    setCurrentTitle(lastChat.title);
                    setMessages(lastChat.messages);
                }
            } catch (err) {
                console.error("Failed to load chats", err);
            }
        };
        loadChats();
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const text = input;
        setMessages((prev) => [...prev, { role: "user", content: text }]);
        setInput("");
        setLoading(true); // loader

        try {
            const res = await axios.post(
                "/api/chatai",
                { message: text, isNewChat: currentTitle === null, currentTitle },
                { withCredentials: true }
            );

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: res.data.reply },
            ]);

            if (!currentTitle) {
                const newChat = {
                    title: res.data.title,
                    messages: [
                        { role: "user", content: text },
                        { role: "assistant", content: res.data.reply },
                    ],
                };
                setChats((prev) => [...prev, newChat]);
                setCurrentTitle(res.data.title);
            } else {
                setChats((prev) =>
                    prev.map((chat) =>
                        chat.title === currentTitle
                            ? {
                                  ...chat,
                                  messages: [
                                      ...chat.messages,
                                      { role: "user", content: text },
                                      { role: "assistant", content: res.data.reply },
                                  ],
                              }
                            : chat
                    )
                );
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false); //hide loader
        }
    };

    const startNewChat = () => {
        setMessages([]);
        setCurrentTitle(null);
    };

    const openChat = (chat) => {
        setCurrentTitle(chat.title);
        setMessages(chat.messages);
        setSidebarOpen(false);
    };

    const deleteChat = async (title) => {
        try {
            await axios.delete("/api/chatai", { data: { title }, withCredentials: true });
            setChats((prev) => prev.filter((c) => c.title !== title));

            if (currentTitle === title) {
                setMessages([]);
                setCurrentTitle(null);
            }
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const Toastit=()=>
    [
        toast.error("This Ai Can Reply False It Is For Testing Only")
    ]

    return (
        <>
            <nav className="h-12 border-b-2 border-[#CBCBCB] flex-row flex items-center p-5 dark:border-[#303030] justify-between">
                <h2 className="dark:text-white text-black text-2xl font-medium">LLama</h2>

                <button
                    className="lg:hidden text-2xl font-bold dark:text-white"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    ☰
                </button>
                
            
            </nav>

            <section    onClick={() => setSidebarOpen(false)} className="flex dark:bg-[#212121] h-[40.3rem] w-full bg-white relative">
                <Toaster/>
                {/*SIDEBAR*/}
                <div
                    className={`fixed top-0 left-0 h-full w-64 p-5 bg-white dark:bg-[#181818] border-r-2 border-[#CBCBCB] dark:border-[#303030] lg:relative lg:translate-x-0 transition-transform ${
                        sidebarOpen ? "translate-x-0 z-50" : "-translate-x-full"
                    }`}
                >
                    
                    <Image className=" ml-20" src="/llama.png" width={30} height={30} alt="Llama" />
                       <div onClick={Toastit} className=" size-7 rounded-full bg-white text-xl cursor-pointer hover:opacity-80 transition-all active:opacity-80 text-shadow-black text-black font-extrabold flex items-center justify-center">i</div>

                    <div className="flex items-center justify-between mt-10">
                        <h3 className="font-bold text-[#AFAFAF]">Your Chats</h3>
                        <button
                            onClick={startNewChat}
                            className="text-xl cursor-pointer hover:bg-gray-400 transition-all rounded-full px-2 py-1 font-bold dark:text-white"
                        >
                            +
                        </button>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                        {chats.map((chat, i) => (
                            <div
                                key={i}
                                className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                                    chat.title === currentTitle
                                        ? "bg-gray-200 dark:bg-[#303030]"
                                        : "hover:bg-gray-100 dark:hover:bg-[#252525]"
                                }`}
                            >
                                <button
                                    onClick={() => openChat(chat)}
                                    className="text-left flex-1"
                                >
                                    {chat.title}
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteChat(chat.title);
                                    }}
                                    className="text-red-500 hover:text-red-700 px-2"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/*CHAT AREA*/}
                <div className="flex-1 items-center w-full justify-center flex flex-col ">
                    <div className="flex-1 border-2 w-full rounded-4xl border-[#CBCBCB] dark:border-[#303030] overflow-y-scroll p-4 mt-1 ml-1 mr-1">
                        {messages.map((msg, i) => (
                            <div
                                key={`${msg.role}-${i}`}
                                className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                            >
                                <div className="chat-bubble">{msg.content}</div>
                            </div>
                        ))}

                        {/*Loader */}
                        {loading && (
                            <div className="flex justify-start p-2">
                                <span className="loading loading-dots loading-lg text-blue-400"></span>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>

                    <div className="p-3 border-t flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className="flex-1 px-10 md:w-[40rem] py-2 rounded-lg border"
                        />
                        <button
                            onClick={sendMessage}
                            className="px-4 md:px-9 py-2 bg-blue-600 text-white rounded-lg"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}
