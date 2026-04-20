import React from 'react';
import { useSelector } from 'react-redux';

const Xchat = () => {
    const { mode } = useSelector((state) => state.theme);

    return (
        <div className="flex h-[calc(100vh-120px)] bg-[#F0F2F5] dark:bg-slate-900/50 rounded-[32px] p-8 font-sans text-[#333] dark:text-slate-100 transition-colors">
            {/* SIDEBAR */}
            <div className="w-[350px] bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-sm dark:shadow-slate-950/20 flex flex-col mr-6 border border-transparent dark:border-slate-700">
                {/* Search & Add Button */}
                <div className="flex gap-3 mb-8">
                    <div className="relative flex-1">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search here..."
                            className="w-full bg-[#F3F4F9] dark:bg-slate-700 border-none rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:text-slate-100 dark:placeholder:text-slate-500"
                        />
                    </div>
                    <button className="bg-[#00B074] p-3 rounded-xl text-white shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                </div>

                {/* Contacts List */}
                <div className="overflow-y-auto flex-1 custom-scrollbar">
                    <h3 className="text-gray-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-5">Pinned Message</h3>
                    <ContactItem name="Robert Johanson" msg="Hi David, can you send your..." time="2min ago" badge={2} />
                    <ContactItem name="Chloe Jess" msg="I have done my task last week.." time="15min ago" status="read" online />

                    <h3 className="text-gray-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-wider mt-8 mb-5">Recent Message</h3>
                    <ContactItem name="Roberto" msg="Last week, do you remember?" time="02:45 AM" status="read" />
                    <ContactItem name="Lisa Blekcurent" msg="My boss give me that task last.." time="2 min ago" online />
                    <ContactItem name="Olivia Braun" msg="Hei, you forget to upload submi.." time="Yesterday" />
                    <ContactItem name="James Sudayat" msg="Hi David, can you send your..." time="Yesterday" online />
                </div>
            </div>

            {/* MAIN CHAT WINDOW */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-[32px] flex flex-col shadow-sm dark:shadow-slate-900/20 overflow-hidden border border-gray-100 dark:border-slate-700">
                {/* Chat Header */}
                <div className="px-8 py-5 flex items-center justify-between border-b border-gray-50 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden ring-1 ring-gray-100 dark:ring-slate-600">
                            <img src="https://i.pravatar.cc/150?u=roberto" alt="Roberto" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#2E3A59] dark:text-slate-100">Roberto</h3>
                            <p className="text-[11px] text-[#4285F4] dark:text-blue-400 flex items-center gap-1.5 font-semibold">
                                <span className="w-2 h-2 bg-[#4285F4] rounded-full"></span> Online
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 text-gray-400 dark:text-slate-500">
                        <svg className="cursor-pointer hover:text-gray-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        <svg className="cursor-pointer hover:text-gray-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <svg className="cursor-pointer hover:text-gray-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        <svg className="cursor-pointer hover:text-gray-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </div>
                </div>

                {/* Message Area */}
                <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-[#FAFBFF] dark:bg-slate-900/50">
                    {/* Incoming Messages */}
                    <div className="space-y-3">
                        <div className="max-w-[65%] bg-[#F3F4F9] dark:bg-slate-700 p-4 rounded-[20px] rounded-tl-none text-[14px] text-[#4F5E7B] dark:text-slate-300 leading-relaxed">
                            Hi everyone! Let's start our discussion now about kick off meeting next week.
                        </div>
                        <div className="max-w-[65%] bg-[#F3F4F9] dark:bg-slate-700 p-4 rounded-[20px] rounded-tl-none text-[14px] text-[#4F5E7B] dark:text-slate-300 leading-relaxed font-medium">
                            Is everyone ok about that schedule?
                        </div>
                    </div>

                    {/* Outgoing Messages */}
                    <div className="flex flex-col items-end gap-2">
                        <span className="text-[11px] font-bold text-gray-800 dark:text-slate-200 mr-12 uppercase tracking-tight">Eren Yeager</span>
                        <div className="flex items-end gap-3">
                            <div className="flex flex-col items-end gap-2">
                                <div className="bg-[#78C9F3] dark:bg-blue-600 text-white p-4 rounded-[20px] rounded-br-none text-[14px] shadow-sm max-w-[400px]">
                                    Uhm, can I reschedule meeting?
                                </div>
                                <div className="bg-[#78C9F3] dark:bg-blue-600 text-white p-4 rounded-[20px] rounded-br-none text-[14px] shadow-sm max-w-[400px]">
                                    I still have 2 task left at that day. I worried can't attend that meeting
                                </div>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-slate-700 overflow-hidden ring-2 ring-emerald-400 ring-offset-2">
                                <img src="https://i.pravatar.cc/150?u=eren" alt="Eren" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Text Editor / Input Area */}
                <div className="px-8 pb-8 pt-2 bg-[#FAFBFF] dark:bg-slate-900/50">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-gray-100 dark:border-slate-700 shadow-2xl shadow-gray-200/50 dark:shadow-none">
                        <textarea
                            placeholder="Write your message here..."
                            className="w-full bg-transparent border-none focus:outline-none text-[14px] text-gray-600 dark:text-slate-200 resize-none h-14"
                        />
                        <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-5 text-gray-300 dark:text-slate-600">
                                <button className="text-[#00B074] font-extrabold text-lg">B</button>
                                <button className="italic font-serif text-lg">I</button>
                                <button className="underline text-lg">U</button>
                                <button className="line-through text-lg">T</button>
                                <div className="h-5 w-[1px] bg-gray-100 dark:bg-slate-700 mx-1"></div>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 border-[1.5px] border-[#00B074] text-[#00B074] px-6 py-2.5 rounded-xl text-[14px] font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    Cancel
                                </button>
                                <button className="flex items-center gap-2 bg-[#00B074] text-white px-7 py-2.5 rounded-xl text-[14px] font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" transform="rotate(-45)"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* Yordamchi kichik komponent */
const ContactItem = ({ name, msg, time, badge, status, online }) => (
    <div className="flex items-center gap-4 mb-6 cursor-pointer group px-2 py-1 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-2xl transition-all">
        <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-[18px] bg-gray-100 dark:bg-slate-700 overflow-hidden shadow-sm">
                <img src={`https://ui-avatars.com/api/?name=${name}&background=random`} alt={name} />
            </div>
            {online && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#00B074] border-[3px] border-white rounded-full"></div>}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
                <h4 className="font-bold text-[14px] text-[#2E3A59] dark:text-slate-200 truncate">{name}</h4>
                <span className="text-[10px] text-gray-400 dark:text-slate-500 font-semibold">{time}</span>
            </div>
            <div className="flex justify-between items-center">
                <p className="text-[12px] text-gray-500 dark:text-slate-400 truncate pr-2">{msg}</p>
                {badge ? (
                    <span className="bg-[#4285F4] text-white text-[10px] font-bold h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-lg shadow-md shadow-blue-100 dark:shadow-none">{badge}</span>
                ) : status === 'read' ? (
                    <div className="flex text-[#00B074]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 13 12 18 22 8"></polyline><polyline points="2 13 7 18 17 8"></polyline></svg>
                    </div>
                ) : null}
            </div>
        </div>
    </div>
);

export default Xchat;