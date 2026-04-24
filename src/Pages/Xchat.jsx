import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8001";
const API = import.meta.env.VITE_CHAT_API || "http://localhost:8001/api";

const ROOMS = [
    { id: "general", name: "General", avatar: "GN", color: "bg-emerald-500", joinEvent: "join-general" },
    { id: "kitchen", name: "Kitchen", avatar: "KT", color: "bg-orange-500", joinEvent: "join-kitchen" },
    { id: "delivery", name: "Delivery Team", avatar: "DL", color: "bg-blue-500", joinEvent: "join-delivery" },
    { id: "support", name: "Support", avatar: "SP", color: "bg-purple-500", joinEvent: "join-support" },
];

const ME = {
    name: localStorage.getItem("sedap-session")
        ? JSON.parse(localStorage.getItem("sedap-session") || "{}").fullName || "Me"
        : "Me",
    avatar: "https://i.pravatar.cc/150?u=sedap-me",
};

let socket = null;

export default function Xchat() {
    const [room, setRoom] = useState("general");
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [search, setSearch] = useState("");
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [unread, setUnread] = useState({});
    const bottomRef = useRef(null);
    const activeRoom = useRef(room);

    // Xona o'zgarganda refni yangilash
    useEffect(() => {
        activeRoom.current = room;
    }, [room]);

    useEffect(() => {
        socket = io(SOCKET_URL, { transports: ["polling", "websocket"] });

        socket.on("connect", () => setConnected(true));
        socket.on("disconnect", () => setConnected(false));

        socket.on("receive-message", (msg) => {
            if (msg.room === activeRoom.current) {
                setMessages(prev => {
                    // Dublikat xabarlar tushishini oldini olish (ID yoki matn/vaqt bo'yicha)
                    const exists = prev.some(m => m._id === msg._id || (m.text === msg.text && m.sender === msg.sender && Math.abs(new Date(m.createdAt) - new Date(msg.createdAt)) < 1000));
                    if (exists) return prev;
                    return [...prev, msg];
                });
            } else {
                setUnread(prev => ({ ...prev, [msg.room]: (prev[msg.room] || 0) + 1 }));
            }
        });

        const sysMsg = (label) => (data) => {
            const sys = {
                _id: Date.now(), room: activeRoom.current, sender: "System",
                text: `${label}: #${data?._id || data?.id || ""}`,
                avatar: null, createdAt: new Date().toISOString(), isSystem: true,
            };
            setMessages(prev => [...prev, sys]);
        };
        socket.on("new-order", sysMsg("Yangi order"));
        socket.on("order-ready", sysMsg("Order tayyor"));
        socket.on("order-status-changed", sysMsg("Status o'zgardi"));

        return () => { socket.disconnect(); socket = null; };
    }, []);

    useEffect(() => {
        if (!socket) return;

        const found = ROOMS.find(r => r.id === room);
        socket.emit("join-room", room);
        if (found) socket.emit(found.joinEvent);

        setUnread(prev => ({ ...prev, [room]: 0 }));

        // Local storage'dan ushbu xona uchun keshni tekshirish
        const cachedMessages = localStorage.getItem(`sedap-chat-${room}`);
        if (cachedMessages) {
            setMessages(JSON.parse(cachedMessages));
        } else {
            setMessages([]);
        }

        setLoading(true);

        fetch(`${API}/chat?room=${room}`)
            .then(r => r.json())
            .then(json => {
                const fetchedMessages = Array.isArray(json) ? json : json.data || [];
                setMessages(fetchedMessages);
                // Kelgan xabarlarni keshga saqlash
                localStorage.setItem(`sedap-chat-${room}`, JSON.stringify(fetchedMessages));
            })
            .catch(() => setMessages([]))
            .finally(() => setLoading(false));
    }, [room]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Xabarlar ro'yxati o'zgarganda (yangi xabar kelganda yoki yuborilganda) saqlash
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(`sedap-chat-${room}`, JSON.stringify(messages));
        }
    }, [messages, room]);

    const send = () => {
        if (!text.trim() || !socket) return;
        
        const newMsg = {
            _id: `temp-${Date.now()}`, // Vaqtinchalik ID
            room,
            sender: ME.name,
            text: text.trim(),
            avatar: ME.avatar,
            createdAt: new Date().toISOString(),
        };

        // 1. Serverga yuborish
        socket.emit("send-message", newMsg);

        // 2. Local state'ga darhol qo'shish (Optimistic update)
        setMessages(prev => [...prev, newMsg]);

        // 3. Inputni tozalash
        setText("");
    };

    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
    };

    const filtered = ROOMS.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase())
    );

    const current = ROOMS.find(r => r.id === room);

    return (
        <div className="flex h-[calc(100vh-120px)] bg-[#F0F2F5] dark:bg-slate-900/50 rounded-[32px] p-4 gap-4 font-sans text-[#333] dark:text-slate-100">
            {/* Sidebar */}
            <div className="w-[280px] bg-white dark:bg-slate-800 rounded-[28px] p-5 shadow-sm flex flex-col border border-transparent dark:border-slate-700">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-[16px] text-slate-800 dark:text-slate-100">Chat</h2>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${connected ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-500"}`}>
                        {connected ? "● Online" : "○ Offline"}
                    </span>
                </div>

                <div className="relative mb-5">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search rooms..."
                        className="w-full bg-slate-100 dark:bg-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                </div>

                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-3">Rooms</p>

                <div className="space-y-1 flex-1 overflow-y-auto">
                    {filtered.map(r => (
                        <button
                            key={r.id}
                            onClick={() => setRoom(r.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all text-left ${room === r.id
                                ? "bg-slate-100 dark:bg-slate-700"
                                : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center font-bold text-xs text-white flex-shrink-0 ${r.color}`}>
                                {r.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold truncate ${room === r.id ? "text-slate-800 dark:text-slate-100" : "text-slate-600 dark:text-slate-300"}`}>
                                    {r.name}
                                </p>
                                <p className="text-[10px] text-slate-400"># {r.id}</p>
                            </div>
                            {unread[r.id] > 0 && (
                                <span className="bg-[#4285F4] text-white text-[10px] font-bold min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full">
                                    {unread[r.id]}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mt-4 flex items-center gap-3">
                    <img src={ME.avatar} className="w-9 h-9 rounded-full ring-2 ring-emerald-400" alt="me" />
                    <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[160px]">{ME.name}</p>
                        <p className="text-[10px] text-emerald-500 font-semibold">● Online</p>
                    </div>
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-[28px] flex flex-col shadow-sm overflow-hidden border border-gray-100 dark:border-slate-700">
                <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center text-white font-bold text-sm ${current?.color}`}>
                            {current?.avatar}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100"># {current?.name}</h3>
                            <p className="text-[11px] text-slate-400">{messages.filter(m => !m.isSystem).length} messages</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-900/50">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-300 dark:text-slate-600 gap-3">
                            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            <p className="text-sm font-medium">Hali xabar yo'q. Birinchi bo'lib yozing!</p>
                        </div>
                    ) : (
                        messages.map((msg, i) => {
                            if (msg.isSystem) return (
                                <div key={msg._id || i} className="flex justify-center">
                                    <span className="text-[11px] bg-slate-100 dark:bg-slate-700 text-slate-400 px-4 py-1.5 rounded-full">{msg.text}</span>
                                </div>
                            );

                            const isMe = msg.sender === ME.name;
                            const time = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }) : "";

                            return (
                                <div key={msg._id || i} className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                                    <img
                                        src={msg.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender)}&background=random&size=64`}
                                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                        alt={msg.sender}
                                    />
                                    <div className={`max-w-[62%] flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
                                        <span className="text-[11px] text-slate-400 font-medium px-1">{msg.sender}</span>
                                        <div className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed ${isMe ? "bg-[#00B074] text-white rounded-br-none" : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-none shadow-sm"}`}>
                                            {msg.text}
                                        </div>
                                        {time && <span className="text-[10px] text-slate-300 dark:text-slate-600 px-1">{time}</span>}
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={bottomRef} />
                </div>

                <div className="px-6 pb-6 pt-3 bg-slate-50 dark:bg-slate-900/50 flex-shrink-0">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl px-5 py-4 border border-slate-100 dark:border-slate-700 shadow-lg flex gap-3 items-end">
                        <textarea
                            value={text}
                            onChange={e => setText(e.target.value)}
                            onKeyDown={handleKey}
                            placeholder="Xabar yozing... (Enter — yuborish)"
                            rows={2}
                            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-600 dark:text-slate-200 resize-none"
                        />
                        <button onClick={send} disabled={!text.trim()} className="bg-[#00B074] disabled:opacity-40 text-white px-5 py-2 rounded-xl text-sm font-bold transition">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}