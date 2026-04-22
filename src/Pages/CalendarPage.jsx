// /**
//  * Sedap — Full Functional Calendar Page
//  * Vite + React
//  *
//  * Features:
//  *  ✅ Month / Week / Day views
//  *  ✅ Prev / Next / Today navigation per view
//  *  ✅ Create event — modal form (+ New Schedule OR double-click on cell)
//  *  ✅ Edit event — click any chip → modal pre-filled
//  *  ✅ Delete event — button inside edit modal
//  *  ✅ In-memory live store (swap saveEvent/deleteEvent with real fetch() for backend)
//  *  ✅ 5 event colors with picker
//  *  ✅ All-day toggle + timed events with start/end
//  *  ✅ "+N more" overflow in month cells
//  *  ✅ Selected-day panel in month view (shows all events for that day)
//  *  ✅ Today highlight (green circle), Sunday red, active-day highlight
//  *  ✅ Week view: all-day row + hourly slots
//  *  ✅ Day view: full 24h timeline
//  */

// import { useState, useCallback, useId } from "react";
// import { useSelector } from "react-redux";

// // ─── Color palette ────────────────────────────────────────────────────────────
// const COLORS = {
//   orange: { bg: "#FFF0D6", text: "#a05c00", dot: "#f5a623" },
//   teal:   { bg: "#D6F3E9", text: "#0a6b4a", dot: "#1D9E75" },
//   red:    { bg: "#FDEAEA", text: "#b02020", dot: "#e05252" },
//   purple: { bg: "#EEEDFE", text: "#3C3489", dot: "#7F77DD" },
//   blue:   { bg: "#E6F1FB", text: "#0C447C", dot: "#378ADD" },
// };
// const COLOR_KEYS = Object.keys(COLORS);

// let _nextId = 20;
// function uid() { return ++_nextId; }

// const SEED = [
//   { id:1,  title:"Spicy Nugget",                  date:"2026-04-02", startTime:"09:00", endTime:"10:00", color:"orange", allDay:true  },
//   { id:2,  title:"Pizza la Piazza With Barbeque",  date:"2026-04-02", startTime:"12:00", endTime:"13:30", color:"teal",   allDay:false },
//   { id:3,  title:"Event",                          date:"2026-04-03", startTime:"08:00", endTime:"09:00", color:"blue",   allDay:false },
//   { id:4,  title:"Fast",                           date:"2026-04-03", startTime:"10:00", endTime:"11:00", color:"purple", allDay:false },
//   { id:5,  title:"Staff Meeting",                  date:"2026-04-03", startTime:"14:00", endTime:"15:00", color:"orange", allDay:false },
//   { id:6,  title:"Event",                          date:"2026-04-07", startTime:"09:00", endTime:"10:00", color:"blue",   allDay:true  },
//   { id:7,  title:"New Event",                      date:"2026-04-09", startTime:"08:04", endTime:"10:23", color:"red",    allDay:false },
//   { id:8,  title:"Event Pass",                     date:"2026-04-14", startTime:"11:00", endTime:"12:00", color:"purple", allDay:false },
//   { id:9,  title:"Spicy Nugget",                   date:"2026-04-18", startTime:"09:00", endTime:"10:00", color:"orange", allDay:true  },
//   { id:10, title:"Pizza la Piazza With Barbeque",  date:"2026-04-18", startTime:"12:00", endTime:"13:30", color:"teal",   allDay:false },
//   { id:11, title:"Design Review",                  date:"2026-04-18", startTime:"15:00", endTime:"16:00", color:"blue",   allDay:false },
//   { id:12, title:"Spicy Nugget",                   date:"2026-04-22", startTime:"09:00", endTime:"10:00", color:"orange", allDay:true  },
//   { id:13, title:"Pizza la Piazza With Barbeque",  date:"2026-04-22", startTime:"12:00", endTime:"13:30", color:"teal",   allDay:false },
//   { id:14, title:"Sprint Planning",                date:"2026-04-22", startTime:"10:00", endTime:"11:30", color:"purple", allDay:false },
//   { id:15, title:"New Event",                      date:"2026-04-25", startTime:"08:04", endTime:"10:23", color:"red",    allDay:false },
//   { id:16, title:"Lunch with Sam",                 date:"2026-04-25", startTime:"12:00", endTime:"13:00", color:"teal",   allDay:false },
//   { id:17, title:"Weekly Standup",                 date:"2026-04-26", startTime:"09:00", endTime:"09:30", color:"blue",   allDay:false },
//   { id:18, title:"Client Call",                    date:"2026-04-27", startTime:"14:00", endTime:"15:00", color:"orange", allDay:false },
//   { id:19, title:"Release Day",                    date:"2026-04-30", startTime:"10:00", endTime:"18:00", color:"red",    allDay:true  },
// ];

// const MONTHS     = ["January","February","March","April","May","June","July","August","September","October","November","December"];
// const DAYS_FULL  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
// const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
// const TODAY = new Date().toISOString().split("T")[0];
// const pad  = n => String(n).padStart(2,"0");
// const dKey = (y,m,d) => `${y}-${pad(m+1)}-${pad(d)}`;
// function parseDKey(k) {
//   const [y,m,d] = k.split("-").map(Number);
//   return { year:y, month:m-1, day:d };
// }
// function fmt12(t) {
//   if(!t) return "";
//   const [h,m] = t.split(":").map(Number);
//   return `${h%12||12}:${pad(m)} ${h>=12?"PM":"AM"}`;
// }
// function buildMonthCells(year, month) {
//   const first = new Date(year,month,1).getDay();
//   const total = Math.ceil((first + new Date(year,month+1,0).getDate())/7)*7;
//   const prevDays = new Date(year,month,0).getDate();
//   return Array.from({length:total},(_,i) => {
//     if(i<first) {
//       const d=prevDays-first+1+i, m=month-1<0?11:month-1, y=month-1<0?year-1:year;
//       return {day:d,month:m,year:y,isOther:true};
//     }
//     const dim=new Date(year,month+1,0).getDate();
//     if(i>=first+dim) {
//       const d=i-first-dim+1, m=month+1>11?0:month+1, y=month+1>11?year+1:year;
//       return {day:d,month:m,year:y,isOther:true};
//     }
//     return {day:i-first+1,month,year,isOther:false};
//   });
// }
// function weekStart(dk) {
//   const d=new Date(dk+"T00:00:00");
//   d.setDate(d.getDate()-d.getDay());
//   return dKey(d.getFullYear(),d.getMonth(),d.getDate());
// }
// function buildWeek(dk) {
//   const s=new Date(weekStart(dk)+"T00:00:00");
//   return Array.from({length:7},(_,i)=>{
//     const dd=new Date(s); dd.setDate(s.getDate()+i);
//     return dKey(dd.getFullYear(),dd.getMonth(),dd.getDate());
//   });
// }
// function addDays(dk,n) {
//   const d=new Date(dk+"T00:00:00"); d.setDate(d.getDate()+n);
//   return dKey(d.getFullYear(),d.getMonth(),d.getDate());
// }

// function EventChip({ ev, onEdit }) {
//   const c = COLORS[ev.color]||COLORS.orange;
//   return (
//     <div
//       title={ev.title}
//       onClick={e=>{e.stopPropagation();onEdit(ev);}}
//       style={{
//         background:c.bg,color:c.text,borderRadius:20,
//         padding:"3px 9px",fontSize:11,fontWeight:600,marginBottom:3,
//         display:"flex",alignItems:"center",gap:4,
//         width:"100%",cursor:"pointer",overflow:"hidden",
//         transition:"filter 0.1s",
//       }}
//       onMouseEnter={e=>e.currentTarget.style.filter="brightness(0.93)"}
//       onMouseLeave={e=>e.currentTarget.style.filter=""}
//     >
//       <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>
//         {!ev.allDay && ev.startTime ? `${fmt12(ev.startTime)} ${ev.title}` : ev.title}
//       </span>
//     </div>
//   );
// }

// // ─── DayCell ──────────────────────────────────────────────────────────────────
// const MAX_CHIPS = 2;
// function DayCell({ cell, isToday, isSel, evs, onSel, onEdit, onNew, isDark }) {
//   const key  = dKey(cell.year,cell.month,cell.day);
//   const isSun= new Date(cell.year,cell.month,cell.day).getDay()===0;
//   const over = evs.length-MAX_CHIPS;
//   return (
//     <div
//       onClick={()=>!cell.isOther&&onSel(key)}
//       onDoubleClick={()=>!cell.isOther&&onNew(key)}
//       style={{
//         borderRight: isDark ? "1px solid #334155" : "1px solid #ebebeb", borderBottom: isDark ? "1px solid #334155" : "1px solid #ebebeb",
//         padding:"10px 10px 8px",minHeight:110,
//         cursor:cell.isOther?"default":"pointer",
//         background:isSel ? (isDark ? "rgba(29, 158, 117, 0.2)" : "#f0faf6") : evs.length && !cell.isOther ? (isDark ? "rgba(29, 158, 117, 0.05)" : "#fafdf9") : (isDark ? "#1e293b" : "#fff"),
//         outline:isSel?"2px solid #1D9E75":"none",outlineOffset:-1,
//         transition:"background 0.12s",
//       }}
//     >
//       <div style={{
//         width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",
//         borderRadius:"50%",fontSize:13,fontWeight:600,marginBottom:5,
//         ...(isToday?{background:"#1D9E75",color:"#fff"}
//           :cell.isOther?{color: isDark ? "#64748b" : "#ccc",fontWeight:400}
//           :isSun?{color:"#e05252"}
//           :{color: isDark ? "#f1f5f9" : "#1a1a1a"}),
//       }}>{cell.day}</div>
//       {!cell.isOther&&evs.slice(0,MAX_CHIPS).map(ev=>(
//         <EventChip key={ev.id} ev={ev} onEdit={onEdit}/>
//       ))}
//       {!cell.isOther&&over>0&&(
//         <div
//           onClick={e=>{e.stopPropagation();onSel(key);}}
//           style={{fontSize:11,color:"#1D9E75",fontWeight:600,cursor:"pointer",paddingLeft:4}}
//         >+{over} more</div>
//       )}
//     </div>
//   );
// }

// function MonthView({ year, month, evs, selDate, onSel, onEdit, onNew, isDark }) {
//   const cells = buildMonthCells(year,month);
//   const byDate = {};
//   evs.forEach(e=>{ (byDate[e.date]||(byDate[e.date]=[])).push(e); });
//   return (
//     <div style={{flex:1,overflow:"auto"}}>
//       <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderTop: isDark ? "1px solid #334155" : "1px solid #ebebeb", borderBottom: isDark ? "1px solid #334155" : "1px solid #ebebeb", background: isDark ? "#0f172a" : "#fafaf8"}}>
//         {DAYS_FULL.map(d=>(
//           <div key={d} style={{textAlign:"center",padding:"10px 0",fontSize:12,fontWeight:600,color: isDark ? "#94a3b8" : "#aaa",letterSpacing:0.3}}>{d}</div>
//         ))}
//       </div>
//       <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
//         {cells.map((cell,i)=>{
//           const key=dKey(cell.year,cell.month,cell.day);
//           return (
//             <DayCell key={i} cell={cell}
//               isToday={key===TODAY} isSel={key===selDate}
//               evs={(!cell.isOther&&byDate[key])||[]}
//               onSel={onSel} onEdit={onEdit} onNew={onNew}
//               isDark={isDark}
//             />
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // ─── Selected Day Panel ────────────────────────────────────────────────────────
// function SelPanel({ dk, evs, onEdit, onNew, isDark }) {
//   if(!dk) return null;
//   const {day,month,year}=parseDKey(dk);
//   const dayEvs=evs.filter(e=>e.date===dk);
//   return (
//     <div style={{background: isDark ? "#1e293b" : "#fff", border: isDark ? "1px solid #334155" : "1px solid #e8e8e0", borderRadius:12,margin:"0 16px 16px",padding:"16px 20px"}}>
//       <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
//         <span style={{fontSize:12,fontWeight:600,color: isDark ? "#94a3b8" : "#aaa",letterSpacing:0.3}}>
//           {MONTHS[month]} {day}, {year}
//         </span>
//         <button onClick={()=>onNew(dk)} style={{
//           background:"#1D9E75",color:"#fff",border:"none",
//           borderRadius:8,padding:"4px 12px",fontSize:12,fontWeight:600,cursor:"pointer",
//         }}>+ Add</button>
//       </div>
//       {dayEvs.length===0
//         ?<div style={{fontSize:13,color: isDark ? "#64748b" : "#bbb",textAlign:"center",padding:"12px 0"}}>No events — double-click a cell to add</div>
//         :dayEvs.map(ev=>{
//           const c=COLORS[ev.color]||COLORS.orange;
//           return (
//             <div key={ev.id} onClick={()=>onEdit(ev)}
//               style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,marginBottom:4,cursor:"pointer",background: isDark ? "#0f172a" : "#fafaf8",transition:"background 0.1s"}}
//               onMouseEnter={e=>e.currentTarget.style.background = isDark ? "#334155" : "#f0f0ea"}
//               onMouseLeave={e=>e.currentTarget.style.background = isDark ? "#0f172a" : "#fafaf8"}
//             >
//               <div style={{width:10,height:10,borderRadius:"50%",background:c.dot,flexShrink:0}}/>
//               <div style={{flex:1,fontSize:13,fontWeight:500,color: isDark ? "#f1f5f9" : "#1a1a1a"}}>{ev.title}</div>
//               <div style={{fontSize:11,color: isDark ? "#94a3b8" : "#aaa"}}>{ev.allDay?"All day":fmt12(ev.startTime)}</div>
//             </div>
//           );
//         })
//       }
//     </div>
//   );
// }

// // ─── Week View ─────────────────────────────────────────────────────────────────
// function WeekView({ refDk, evs, onEdit, onNew, isDark }) {
//   const week=buildWeek(refDk);
//   const byDate={};
//   evs.forEach(e=>(byDate[e.date]||(byDate[e.date]=[])).push(e));
//   const HOURS=Array.from({length:24},(_,i)=>i);
//   return (
//     <div style={{flex:1,overflow:"auto"}}>
//       <div style={{display:"grid",gridTemplateColumns:"56px repeat(7,1fr)",minWidth:600}}>
//         <div style={{background: isDark ? "#0f172a" : "#fafaf8", borderBottom: isDark ? "1px solid #334155" : "1px solid #ebebeb", borderRight: isDark ? "1px solid #334155" : "1px solid #ebebeb"}}/>
//         {week.map(dk=>{
//           const {day,month,year}=parseDKey(dk);
//           const isT=dk===TODAY;
//           const dow=new Date(year,month,day).getDay();
//           const adEvs=(byDate[dk]||[]).filter(e=>e.allDay);
//           return (
//             <div key={dk} style={{textAlign:"center",padding:"8px 4px 4px",borderBottom: isDark ? "1px solid #334155" : "1px solid #ebebeb", borderRight: isDark ? "1px solid #334155" : "1px solid #ebebeb", background: isDark ? "#0f172a" : "#fafaf8"}}>
//               <div style={{fontSize:10,fontWeight:600,color:isT?"#1D9E75":isDark?"#94a3b8":"#aaa",letterSpacing:0.3}}>{DAYS_SHORT[dow]}</div>
//               <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:28,height:28,borderRadius:"50%",margin:"2px auto",background:isT?"#1D9E75":"transparent",color:isT?"#fff":isDark?"#f1f5f9":"#1a1a1a",fontSize:14,fontWeight:700}}>{day}</div>
//               {adEvs.map(ev=><EventChip key={ev.id} ev={ev} onEdit={onEdit}/>)}
//             </div>
//           );
//         })}
//         {HOURS.map(h=>[
//           <div key={"lbl"+h} style={{borderBottom: isDark ? "1px solid #1e293b" : "1px solid #f0f0ea", borderRight: isDark ? "1px solid #334155" : "1px solid #ebebeb", padding:"4px 8px 0",height:56,background: isDark ? "#0f172a" : "#fafaf8",fontSize:11,color: isDark ? "#64748b" : "#bbb",fontWeight:500}}>
//             {h===0?"12 AM":h<12?`${h} AM`:h===12?"12 PM":`${h-12} PM`}
//           </div>,
//           ...week.map(dk=>{
//             const isT=dk===TODAY;
//             const slotEvs=(byDate[dk]||[]).filter(e=>!e.allDay&&parseInt(e.startTime?.split(":")[0]||0)===h);
//             return (
//               <div key={dk+h} onDoubleClick={()=>onNew(dk)}
//                 style={{borderBottom: isDark ? "1px solid #1e293b" : "1px solid #f0f0ea", borderRight: isDark ? "1px solid #334155" : "1px solid #ebebeb", height:56,padding:"3px 4px",cursor:"pointer",background:isT ? (isDark ? "rgba(29, 158, 117, 0.05)" : "#fafdf9") : (isDark ? "#1e293b" : "#fff")}}
//               >
//                 {slotEvs.map(ev=><EventChip key={ev.id} ev={ev} onEdit={onEdit}/>)}
//               </div>
//             );
//           })
//         ])}
//       </div>
//     </div>
//   );
// }

// // ─── Day View ──────────────────────────────────────────────────────────────────
// function DayView({ dk, evs, onEdit, onNew, isDark }) {
//   const {day,month,year}=parseDKey(dk);
//   const dow=new Date(year,month,day).getDay();
//   const isT=dk===TODAY;
//   const dayEvs=evs.filter(e=>e.date===dk);
//   const adEvs=dayEvs.filter(e=>e.allDay);
//   const timedEvs=dayEvs.filter(e=>!e.allDay);
//   const HOURS=Array.from({length:24},(_,i)=>i);
//   return (
//     <div style={{flex:1,overflow:"auto"}}>
//       <div style={{display:"grid",gridTemplateColumns:"56px 1fr",borderBottom: isDark ? "1px solid #334155" : "1px solid #ebebeb", background: isDark ? "#0f172a" : "#fafaf8"}}>
//         <div/>
//         <div style={{padding:"12px 16px"}}>
//           <div style={{fontSize:11,fontWeight:600,color: isDark ? "#94a3b8" : "#aaa",letterSpacing:0.3}}>{DAYS_FULL[dow].toUpperCase()}</div>
//           <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:36,height:36,borderRadius:"50%",marginTop:4,background:isT?"#1D9E75":"transparent",color:isT?"#fff":isDark?"#f1f5f9":"#1a1a1a",fontSize:22,fontWeight:700}}>{day}</div>
//           {adEvs.map(ev=><EventChip key={ev.id} ev={ev} onEdit={onEdit}/>)}
//         </div>
//       </div>
//       {HOURS.map(h=>{
//         const slotEvs=timedEvs.filter(e=>parseInt(e.startTime?.split(":")[0]||0)===h);
//         return (
//           <div key={h} style={{display:"grid",gridTemplateColumns:"56px 1fr"}}>
//             <div style={{borderBottom: isDark ? "1px solid #1e293b" : "1px solid #f0f0ea", borderRight: isDark ? "1px solid #334155" : "1px solid #ebebeb", padding:"4px 8px 0",height:60,background: isDark ? "#0f172a" : "#fafaf8",fontSize:11,color: isDark ? "#64748b" : "#bbb",fontWeight:500}}>
//               {h===0?"12 AM":h<12?`${h} AM`:h===12?"12 PM":`${h-12} PM`}
//             </div>
//             <div onDoubleClick={()=>onNew(dk)} style={{borderBottom: isDark ? "1px solid #1e293b" : "1px solid #f0f0ea", height:60,padding:"3px 8px",cursor:"pointer", background: isDark ? "#1e293b" : "#fff"}}>
//               {slotEvs.map(ev=>{
//                 const c=COLORS[ev.color]||COLORS.orange;
//                 return (
//                   <div key={ev.id} onClick={e=>{e.stopPropagation();onEdit(ev);}}
//                     style={{background:c.bg,color:c.text,borderLeft:`3px solid ${c.dot}`,borderRadius:"0 8px 8px 0",padding:"4px 10px",fontSize:12,fontWeight:600,marginBottom:2,cursor:"pointer"}}
//                   >
//                     {fmt12(ev.startTime)} – {fmt12(ev.endTime)} &nbsp; {ev.title}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// // ─── Event Modal ──────────────────────────────────────────────────────────────
// function EventModal({ ev, defDate, onSave, onDelete, onClose, isDark }) {
//   const S = {
//     navBtn: {
//       width:32,height:32,borderRadius:8,border:isDark ? "1px solid #475569" : "1px solid #e0e0d8",
//       background:isDark ? "#334155" : "#fff",cursor:"pointer",color:isDark ? "#f1f5f9" : "#444",fontSize:20,
//       display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,
//     },
//     todayBtn: {
//       padding:"7px 16px",fontSize:13,borderRadius:10,
//       border:isDark ? "1px solid #475569" : "1px solid #e0e0d8",background:isDark ? "#334155" : "#fff",
//       cursor:"pointer",color:isDark ? "#f1f5f9" : "#1a1a1a",fontWeight:500,
//     },
//     newBtn: {
//       padding:"7px 16px",fontSize:13,borderRadius:10,
//       border:"none",background:"#1D9E75",color:"#fff",
//       cursor:"pointer",fontWeight:600,
//     },
//     input: {
//       width:"100%",padding:"9px 12px",borderRadius:10,
//       border:isDark ? "1px solid #475569" : "1px solid #e0e0d8",fontSize:13,color:isDark ? "#f1f5f9" : "#1a1a1a",
//       outline:"none",fontFamily:"inherit",background:isDark ? "#0f172a" : "#fff",
//       boxSizing:"border-box",
//     },
//     label: {
//       fontSize:12,fontWeight:600,color:isDark ? "#94a3b8" : "#aaa",
//       letterSpacing:0.3,display:"block",marginBottom:4,
//     },
//     cancelBtn: {
//       padding:"8px 16px",borderRadius:10,border:isDark ? "1px solid #475569" : "1px solid #e0e0d8",
//       background:isDark ? "#334155" : "#fff",color:isDark ? "#cbd5e1" : "#555",fontSize:13,fontWeight:500,cursor:"pointer"
//     }
//   };

//   const pid=useId();
//   const isEdit=!!ev?.id;
//   const [form,setForm]=useState({
//     title:     ev?.title     || "",
//     date:      ev?.date      || defDate || TODAY,
//     startTime: ev?.startTime || "09:00",
//     endTime:   ev?.endTime   || "10:00",
//     color:     ev?.color     || "orange",
//     allDay:    ev?.allDay    ?? false,
//   });
//   const [err,setErr]=useState("");
//   const set=(k,v)=>setForm(f=>({...f,[k]:v}));

//   function handleSave() {
//     if(!form.title.trim()){setErr("Title is required");return;}
//     if(!form.date){setErr("Date is required");return;}
//     onSave({...ev,...form,title:form.title.trim()});
//   }

//   return (
//     <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}}>
//       <div onClick={e=>e.stopPropagation()} style={{background: isDark ? "#1e293b" : "#fff",borderRadius:16,width:"100%",maxWidth:440,boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.4)" : "0 20px 60px rgba(0,0,0,0.18)",overflow:"hidden",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>

//         <div style={{background:isEdit?"#1D9E75":"#1a1a1a",padding:"18px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
//           <span style={{color:"#fff",fontSize:16,fontWeight:600}}>{isEdit?"Edit Schedule":"+ New Schedule"}</span>
//           <button onClick={onClose} style={{background:"rgba(255,255,255,0.18)",border:"none",color:"#fff",width:28,height:28,borderRadius:8,cursor:"pointer",fontSize:18,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
//         </div>

//         <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:14}}>
//           {err&&<div style={{background:"#FDEAEA",color:"#b02020",borderRadius:8,padding:"8px 12px",fontSize:13}}>{err}</div>}

//           <div>
//             <label htmlFor={pid+"t"} style={S.label}>Title</label>
//             <input id={pid+"t"} value={form.title} onChange={e=>{set("title",e.target.value);setErr("");}} placeholder="Event name..." style={S.input} autoFocus/>
//           </div>

//           <div>
//             <label htmlFor={pid+"d"} style={S.label}>Date</label>
//             <input id={pid+"d"} type="date" value={form.date} onChange={e=>set("date",e.target.value)} style={S.input}/>
//           </div>

//           <div style={{display:"flex",alignItems:"center",gap:10}}>
//             <input id={pid+"ad"} type="checkbox" checked={form.allDay} onChange={e=>set("allDay",e.target.checked)} style={{width:16,height:16,cursor:"pointer",accentColor:"#1D9E75", background: isDark ? "#0f172a" : "#fff"}}/>
//             <label htmlFor={pid+"ad"} style={{fontSize:13,color: isDark ? "#cbd5e1" : "#555",cursor:"pointer"}}>All day event</label>
//           </div>

//           {!form.allDay&&(
//             <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
//               <div>
//                 <label htmlFor={pid+"st"} style={S.label}>Start</label>
//                 <input id={pid+"st"} type="time" value={form.startTime} onChange={e=>set("startTime",e.target.value)} style={S.input}/>
//               </div>
//               <div>
//                 <label htmlFor={pid+"et"} style={S.label}>End</label>
//                 <input id={pid+"et"} type="time" value={form.endTime} onChange={e=>set("endTime",e.target.value)} style={S.input}/>
//               </div>
//             </div>
//           )}

//           <div>
//             <label style={S.label}>Color</label>
//             <div style={{display:"flex",gap:8,marginTop:6}}>
//               {COLOR_KEYS.map(c=>(
//                 <button key={c} title={c} onClick={()=>set("color",c)} style={{width:28,height:28,borderRadius:"50%",background:COLORS[c].dot,border:form.color===c ? (isDark ? "2.5px solid #f1f5f9" : "2.5px solid #1a1a1a") :"2.5px solid transparent",cursor:"pointer",transform:form.color===c?"scale(1.2)":"scale(1)",transition:"transform 0.1s"}}/>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div style={{padding:"14px 24px 20px",display:"flex",justifyContent:isEdit?"space-between":"flex-end",gap:10}}>
//           {isEdit&&(
//             <button onClick={()=>onDelete(ev.id)} style={{padding:"8px 16px",borderRadius:10,border:"1px solid #FDEAEA",background:"#FDEAEA",color:"#b02020",fontSize:13,fontWeight:600,cursor:"pointer"}}>Delete</button>
//           )}
//           <div style={{display:"flex",gap:8}}>
//             <button onClick={onClose} style={S.cancelBtn}>Cancel</button>
//             <button onClick={handleSave} style={{padding:"8px 20px",borderRadius:10,border:"none",background:"#1D9E75",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>{isEdit?"Save changes":"Create"}</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function CalendarPage() {
//   const { mode } = useSelector((state) => state.theme);
//   const isDark = mode === "dark";

//   const S = {
//     navBtn: {
//       width:32,height:32,borderRadius:8,border:isDark ? "1px solid #475569" : "1px solid #e0e0d8",
//       background:isDark ? "#334155" : "#fff",cursor:"pointer",color:isDark ? "#f1f5f9" : "#444",fontSize:20,
//       display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,
//     },
//     todayBtn: {
//       padding:"7px 16px",fontSize:13,borderRadius:10,
//       border:isDark ? "1px solid #475569" : "1px solid #e0e0d8",background:isDark ? "#334155" : "#fff",
//       cursor:"pointer",color:isDark ? "#f1f5f9" : "#1a1a1a",fontWeight:500,
//     },
//     newBtn: {
//       padding:"7px 16px",fontSize:13,borderRadius:10,
//       border:"none",background:"#1D9E75",color:"#fff",
//       cursor:"pointer",fontWeight:600,
//     },
//     input: {
//       width:"100%",padding:"9px 12px",borderRadius:10,
//       border:isDark ? "1px solid #475569" : "1px solid #e0e0d8",fontSize:13,color:isDark ? "#f1f5f9" : "#1a1a1a",
//       outline:"none",fontFamily:"inherit",background:isDark ? "#0f172a" : "#fff",
//       boxSizing:"border-box",
//     },
//     label: {
//       fontSize:12,fontWeight:600,color:isDark ? "#94a3b8" : "#aaa",
//       letterSpacing:0.3,display:"block",marginBottom:4,
//     },
//   };

//   const [evs,    setEvs]    = useState(SEED);
//   const [year,   setYear]   = useState(2026);
//   const [month,  setMonth]  = useState(3);
//   const [weekDk, setWeekDk] = useState(TODAY);
//   const [dayDk,  setDayDk]  = useState(TODAY);
//   const [view,   setView]   = useState("Month");
//   const [selDk,  setSelDk]  = useState(null);
//   const [modal,  setModal]  = useState(null);

//   // ── Navigation ──────────────────────────────────────────────────────────
//   function prev() {
//     if(view==="Month"){
//       let m=month-1,y=year;
//       if(m<0){m=11;y--;} setMonth(m);setYear(y);setSelDk(null);
//     } else if(view==="Week"){
//       setWeekDk(addDays(weekDk,-7));
//     } else {
//       setDayDk(addDays(dayDk,-1));
//     }
//   }
//   function next() {
//     if(view==="Month"){
//       let m=month+1,y=year;
//       if(m>11){m=0;y++;} setMonth(m);setYear(y);setSelDk(null);
//     } else if(view==="Week"){
//       setWeekDk(addDays(weekDk,7));
//     } else {
//       setDayDk(addDays(dayDk,1));
//     }
//   }
//   function goToday() {
//     const {year:y,month:m}=parseDKey(TODAY);
//     setYear(y);setMonth(m);setWeekDk(TODAY);setDayDk(TODAY);setSelDk(TODAY);
//   }

//   function periodLabel() {
//     if(view==="Month") return `${MONTHS[month]} ${year}`;
//     if(view==="Week") {
//       const w=buildWeek(weekDk);
//       const a=parseDKey(w[0]),b=parseDKey(w[6]);
//       if(a.month===b.month) return `${MONTHS[a.month]} ${a.day}–${b.day}, ${a.year}`;
//       return `${MONTHS[a.month]} ${a.day} – ${MONTHS[b.month]} ${b.day}, ${a.year}`;
//     }
//     const {day:d,month:m,year:y}=parseDKey(dayDk);
//     return `${MONTHS[m]} ${d}, ${y}`;
//   }
//   function todayLbl() {
//     const {year:y,month:m,day:d}=parseDKey(TODAY);
//     if(view==="Month"&&year===y&&month===m) return `Today (${d})`;
//     return "Today";
//   }

//   // ── CRUD ────────────────────────────────────────────────────────────────
//   const saveEv = useCallback(ev=>{
//     if(ev.id) setEvs(p=>p.map(e=>e.id===ev.id?ev:e));
//     else      setEvs(p=>[...p,{...ev,id:uid()}]);
//     setModal(null);
//   },[]);
//   const delEv = useCallback(id=>{
//     setEvs(p=>p.filter(e=>e.id!==id));
//     setModal(null);
//   },[]);

//   function openNew(defDate) { setModal({mode:"new",defDate:defDate||selDk||TODAY}); }
//   function openEdit(ev)     { setModal({mode:"edit",ev}); }

//   function changeView(v) {
//     setView(v);
//     if(v==="Week") setWeekDk(selDk||TODAY);
//     if(v==="Day")  setDayDk(selDk||TODAY);
//   }

//   const VIEWS=["Month","Week","Day"];

//   return (
//     <div style={{background: "transparent",minHeight:"100vh",padding:24,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
//       <div style={{background: isDark ? "#1e293b" : "#fff", border: isDark ? "1px solid #334155" : "1px solid #e8e8e0", borderRadius:16,overflow:"hidden",maxWidth:1200,margin:"0 auto",display:"flex",flexDirection:"column",minHeight:"calc(100vh - 48px)"}}>

//         {/* Toolbar */}
//         <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 28px 14px",flexWrap:"wrap",gap:12,borderBottom: isDark ? "1px solid #334155" : "1px solid #ebebeb"}}>
//           <div style={{display:"flex",alignItems:"center",gap:10}}>
//             <button onClick={prev} style={S.navBtn}>‹</button>
//             <span style={{fontSize:20,fontWeight:700,color: isDark ? "#f1f5f9" : "#1a1a1a",minWidth:200,textAlign:"center",letterSpacing:-0.3}}>{periodLabel()}</span>
//             <button onClick={next} style={S.navBtn}>›</button>
//           </div>
//           <div style={{display:"flex",background: isDark ? "#0f172a" : "#f0f0ea", borderRadius:10,padding:4}}>
//             {VIEWS.map(v=>(
//               <button key={v} onClick={()=>changeView(v)} style={{padding:"6px 18px",fontSize:13,borderRadius:7,border:"none",cursor:"pointer",fontWeight:500,background:view===v ? (isDark ? "#334155" : "#fff") : "transparent",color:view===v ? (isDark ? "#1D9E75" : "#1a9e75") : (isDark ? "#94a3b8" : "#888"),boxShadow:view===v?"0 1px 3px rgba(0,0,0,0.08)":"none",transition:"all 0.15s"}}>{v}</button>
//             ))}
//           </div>
//           <div style={{display:"flex",gap:10}}>
//             <button onClick={goToday} style={S.todayBtn}>{todayLbl()}</button>
//             <button onClick={()=>openNew(null)} style={S.newBtn}>+ New Schedule</button>
//           </div>
//         </div>

//         {/* Views */}
//         {view==="Month"&&<MonthView year={year} month={month} evs={evs} selDate={selDk} onSel={dk=>setSelDk(p=>p===dk?null:dk)} onEdit={openEdit} onNew={openNew} isDark={isDark}/>}
//         {view==="Week" &&<WeekView  refDk={weekDk} evs={evs} onEdit={openEdit} onNew={dk=>{setDayDk(dk);openNew(dk);}} isDark={isDark}/>}
//         {view==="Day"  &&<DayView   dk={dayDk}     evs={evs} onEdit={openEdit} onNew={openNew} isDark={isDark}/>}

//         {/* Selected panel */}
//         {view==="Month"&&selDk&&<SelPanel dk={selDk} evs={evs} onEdit={openEdit} onNew={openNew} isDark={isDark}/>}
//       </div>

//       {/* Modal overlay */}
//       {modal&&(
//         <EventModal
//           ev={modal.mode==="edit"?modal.ev:null}
//           defDate={modal.defDate}
//           onSave={saveEv}
//           onDelete={delEv}
//           onClose={()=>setModal(null)}
//           isDark={isDark}
//         />
//       )}
//     </div>
//   );
// }







/**
 * Sedap — Full Functional Calendar Page
 * Vite + React + Redux Toolkit backend integration
 *
 * Features:
 *  ✅ Month / Week / Day views
 *  ✅ Prev / Next / Today navigation per view
 *  ✅ Create event — modal form (+ New Schedule OR double-click on cell)
 *  ✅ Edit event — click any chip → modal pre-filled
 *  ✅ Delete event — button inside edit modal
 *  ✅ Redux Toolkit store (calendarSlice) — fetchEvents / createEvent / updateEvent / deleteEvent
 *  ✅ Auto-fetch on mount + on month/year change
 *  ✅ SEED fallback if backend is unavailable
 *  ✅ 5 event colors with picker
 *  ✅ All-day toggle + timed events with start/end
 *  ✅ "+N more" overflow in month cells
 *  ✅ Selected-day panel in month view (shows all events for that day)
 *  ✅ Today highlight (green circle), Sunday red, active-day highlight
 *  ✅ Week view: all-day row + hourly slots
 *  ✅ Day view: full 24h timeline
 */

/**
 * Sedap — Full Functional Calendar Page
 * Vite + React + Redux Toolkit backend integration
 *
 * Features:
 *  ✅ Month / Week / Day views
 *  ✅ Prev / Next / Today navigation per view
 *  ✅ Create event — modal form (+ New Schedule OR double-click on cell)
 *  ✅ Edit event — click any chip → modal pre-filled
 *  ✅ Delete event — button inside edit modal
 *  ✅ Redux Toolkit store (calendarSlice) — fetchEvents / createEvent / updateEvent / deleteEvent
 *  ✅ Auto-fetch on mount + on month/year change
 *  ✅ SEED fallback if backend is unavailable
 *  ✅ 5 event colors with picker
 *  ✅ All-day toggle + timed events with start/end
 *  ✅ "+N more" overflow in month cells
 *  ✅ Selected-day panel in month view (shows all events for that day)
 *  ✅ Today highlight (green circle), Sunday red, active-day highlight
 *  ✅ Week view: all-day row + hourly slots
 *  ✅ Day view: full 24h timeline
 */

import { useState, useCallback, useId, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../store/slices/calendarSlice";

// ─── Color palette ────────────────────────────────────────────────────────────
const COLORS = {
  orange: { bg: "#FFF0D6", text: "#a05c00", dot: "#f5a623" },
  teal:   { bg: "#D6F3E9", text: "#0a6b4a", dot: "#1D9E75" },
  red:    { bg: "#FDEAEA", text: "#b02020", dot: "#e05252" },
  purple: { bg: "#EEEDFE", text: "#3C3489", dot: "#7F77DD" },
  blue:   { bg: "#E6F1FB", text: "#0C447C", dot: "#378ADD" },
};
const COLOR_KEYS = Object.keys(COLORS);

const MONTHS     = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_FULL  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const TODAY = new Date().toISOString().split("T")[0];
const pad  = n => String(n).padStart(2,"0");
const dKey = (y,m,d) => `${y}-${pad(m+1)}-${pad(d)}`;
function parseDKey(k) {
  const [y,m,d] = k.split("-").map(Number);
  return { year:y, month:m-1, day:d };
}
function fmt12(t) {
  if(!t) return "";
  const [h,m] = t.split(":").map(Number);
  return `${h%12||12}:${pad(m)} ${h>=12?"PM":"AM"}`;
}
function buildMonthCells(year, month) {
  const first = new Date(year,month,1).getDay();
  const total = Math.ceil((first + new Date(year,month+1,0).getDate())/7)*7;
  const prevDays = new Date(year,month,0).getDate();
  return Array.from({length:total},(_,i) => {
    if(i<first) {
      const d=prevDays-first+1+i, m=month-1<0?11:month-1, y=month-1<0?year-1:year;
      return {day:d,month:m,year:y,isOther:true};
    }
    const dim=new Date(year,month+1,0).getDate();
    if(i>=first+dim) {
      const d=i-first-dim+1, m=month+1>11?0:month+1, y=month+1>11?year+1:year;
      return {day:d,month:m,year:y,isOther:true};
    }
    return {day:i-first+1,month,year,isOther:false};
  });
}
function weekStart(dk) {
  const d=new Date(dk+"T00:00:00");
  d.setDate(d.getDate()-d.getDay());
  return dKey(d.getFullYear(),d.getMonth(),d.getDate());
}
function buildWeek(dk) {
  const s=new Date(weekStart(dk)+"T00:00:00");
  return Array.from({length:7},(_,i)=>{
    const dd=new Date(s); dd.setDate(s.getDate()+i);
    return dKey(dd.getFullYear(),dd.getMonth(),dd.getDate());
  });
}
function addDays(dk,n) {
  const d=new Date(dk+"T00:00:00"); d.setDate(d.getDate()+n);
  return dKey(d.getFullYear(),d.getMonth(),d.getDate());
}

function EventChip({ ev, onEdit }) {
  const c = COLORS[ev.color]||COLORS.orange;
  return (
    <div
      title={ev.title}
      onClick={e=>{e.stopPropagation();onEdit(ev);}}
      style={{
        background:c.bg,color:c.text,borderRadius:20,
        padding:"3px 9px",fontSize:11,fontWeight:600,marginBottom:3,
        display:"flex",alignItems:"center",gap:4,
        width:"100%",cursor:"pointer",overflow:"hidden",
        transition:"filter 0.1s",
      }}
      onMouseEnter={e=>e.currentTarget.style.filter="brightness(0.93)"}
      onMouseLeave={e=>e.currentTarget.style.filter=""}
    >
      <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>
        {!ev.allDay && ev.startTime ? `${fmt12(ev.startTime)} ${ev.title}` : ev.title}
      </span>
    </div>
  );
}

// ─── DayCell ──────────────────────────────────────────────────────────────────
const MAX_CHIPS = 2;
function DayCell({ cell, isToday, isSel, evs, onSel, onEdit, onNew, isDark }) {
  const key  = dKey(cell.year,cell.month,cell.day);
  const isSun= new Date(cell.year,cell.month,cell.day).getDay()===0;
  const over = evs.length-MAX_CHIPS;
  return (
    <div
      onClick={()=>!cell.isOther&&onSel(key)}
      onDoubleClick={()=>!cell.isOther&&onNew(key)}
      style={{
        borderRight: isDark ? "1px solid #334155" : "1px solid #ebebeb", borderBottom: isDark ? "1px solid #334155" : "1px solid #ebebeb",
        padding:"10px 10px 8px",minHeight:110,
        cursor:cell.isOther?"default":"pointer",
        background:isSel ? (isDark ? "rgba(29, 158, 117, 0.2)" : "#f0faf6") : evs.length && !cell.isOther ? (isDark ? "rgba(29, 158, 117, 0.05)" : "#fafdf9") : (isDark ? "#1e293b" : "#fff"),
        outline:isSel?"2px solid #1D9E75":"none",outlineOffset:-1,
        transition:"background 0.12s",
      }}
    >
      <div style={{
        width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",
        borderRadius:"50%",fontSize:13,fontWeight:600,marginBottom:5,
        ...(isToday?{background:"#1D9E75",color:"#fff"}
          :cell.isOther?{color: isDark ? "#64748b" : "#ccc",fontWeight:400}
          :isSun?{color:"#e05252"}
          :{color: isDark ? "#f1f5f9" : "#1a1a1a"}),
      }}>{cell.day}</div>
      {!cell.isOther&&evs.slice(0,MAX_CHIPS).map(ev=>(
        <EventChip key={ev.id} ev={ev} onEdit={onEdit}/>
      ))}
      {!cell.isOther&&over>0&&(
        <div
          onClick={e=>{e.stopPropagation();onSel(key);}}
          style={{fontSize:11,color:"#1D9E75",fontWeight:600,cursor:"pointer",paddingLeft:4}}
        >+{over} more</div>
      )}
    </div>
  );
}

function MonthView({ year, month, evs, selDate, onSel, onEdit, onNew, isDark }) {
  const cells = buildMonthCells(year,month);
  const byDate = {};
  evs.forEach(e=>{ (byDate[e.date]||(byDate[e.date]=[])).push(e); });
  return (
    <div style={{flex:1,overflow:"auto"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderTop: isDark ? "1px solid #334155" : "1px solid #ebebeb", borderBottom: isDark ? "1px solid #334155" : "1px solid #ebebeb", background: isDark ? "#0f172a" : "#fafaf8"}}>
        {DAYS_FULL.map(d=>(
          <div key={d} style={{textAlign:"center",padding:"10px 0",fontSize:12,fontWeight:600,color: isDark ? "#94a3b8" : "#aaa",letterSpacing:0.3}}>{d}</div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
        {cells.map((cell,i)=>{
          const key=dKey(cell.year,cell.month,cell.day);
          return (
            <DayCell key={i} cell={cell}
              isToday={key===TODAY} isSel={key===selDate}
              evs={(!cell.isOther&&byDate[key])||[]}
              onSel={onSel} onEdit={onEdit} onNew={onNew}
              isDark={isDark}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Selected Day Panel ────────────────────────────────────────────────────────
function SelPanel({ dk, evs, onEdit, onNew, isDark }) {
  if(!dk) return null;
  const {day,month,year}=parseDKey(dk);
  const dayEvs=evs.filter(e=>e.date===dk);
  return (
    <div style={{background: isDark ? "#1e293b" : "#fff", border: isDark ? "1px solid #334155" : "1px solid #e8e8e0", borderRadius:12,margin:"0 16px 16px",padding:"16px 20px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <span style={{fontSize:12,fontWeight:600,color: isDark ? "#94a3b8" : "#aaa",letterSpacing:0.3}}>
          {MONTHS[month]} {day}, {year}
        </span>
        <button onClick={()=>onNew(dk)} style={{
          background:"#1D9E75",color:"#fff",border:"none",
          borderRadius:8,padding:"4px 12px",fontSize:12,fontWeight:600,cursor:"pointer",
        }}>+ Add</button>
      </div>
      {dayEvs.length===0
        ?<div style={{fontSize:13,color: isDark ? "#64748b" : "#bbb",textAlign:"center",padding:"12px 0"}}>No events — double-click a cell to add</div>
        :dayEvs.map(ev=>{
          const c=COLORS[ev.color]||COLORS.orange;
          return (
            <div key={ev.id} onClick={()=>onEdit(ev)}
              style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,marginBottom:4,cursor:"pointer",background: isDark ? "#0f172a" : "#fafaf8",transition:"background 0.1s"}}
              onMouseEnter={e=>e.currentTarget.style.background = isDark ? "#334155" : "#f0f0ea"}
              onMouseLeave={e=>e.currentTarget.style.background = isDark ? "#0f172a" : "#fafaf8"}
            >
              <div style={{width:10,height:10,borderRadius:"50%",background:c.dot,flexShrink:0}}/>
              <div style={{flex:1,fontSize:13,fontWeight:500,color: isDark ? "#f1f5f9" : "#1a1a1a"}}>{ev.title}</div>
              <div style={{fontSize:11,color: isDark ? "#94a3b8" : "#aaa"}}>{ev.allDay?"All day":fmt12(ev.startTime)}</div>
            </div>
          );
        })
      }
    </div>
  );
}

// ─── Week View ─────────────────────────────────────────────────────────────────
function WeekView({ refDk, evs, onEdit, onNew, isDark }) {
  const week=buildWeek(refDk);
  const byDate={};
  evs.forEach(e=>(byDate[e.date]||(byDate[e.date]=[])).push(e));
  const HOURS=Array.from({length:24},(_,i)=>i);
  return (
    <div style={{flex:1,overflow:"auto"}}>
      <div style={{display:"grid",gridTemplateColumns:"56px repeat(7,1fr)",minWidth:600}}>
        <div style={{background: isDark ? "#0f172a" : "#fafaf8", borderBottom: isDark ? "1px solid #334155" : "1px solid #ebebeb", borderRight: isDark ? "1px solid #334155" : "1px solid #ebebeb"}}/>
        {week.map(dk=>{
          const {day,month,year}=parseDKey(dk);
          const isT=dk===TODAY;
          const dow=new Date(year,month,day).getDay();
          const adEvs=(byDate[dk]||[]).filter(e=>e.allDay);
          return (
            <div key={dk} style={{textAlign:"center",padding:"8px 4px 4px",borderBottom: isDark ? "1px solid #334155" : "1px solid #ebebeb", borderRight: isDark ? "1px solid #334155" : "1px solid #ebebeb", background: isDark ? "#0f172a" : "#fafaf8"}}>
              <div style={{fontSize:10,fontWeight:600,color:isT?"#1D9E75":isDark?"#94a3b8":"#aaa",letterSpacing:0.3}}>{DAYS_SHORT[dow]}</div>
              <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:28,height:28,borderRadius:"50%",margin:"2px auto",background:isT?"#1D9E75":"transparent",color:isT?"#fff":isDark?"#f1f5f9":"#1a1a1a",fontSize:14,fontWeight:700}}>{day}</div>
              {adEvs.map(ev=><EventChip key={ev.id} ev={ev} onEdit={onEdit}/>)}
            </div>
          );
        })}
        {HOURS.map(h=>[
          <div key={"lbl"+h} style={{borderBottom: isDark ? "1px solid #1e293b" : "1px solid #f0f0ea", borderRight: isDark ? "1px solid #334155" : "1px solid #ebebeb", padding:"4px 8px 0",height:56,background: isDark ? "#0f172a" : "#fafaf8",fontSize:11,color: isDark ? "#64748b" : "#bbb",fontWeight:500}}>
            {h===0?"12 AM":h<12?`${h} AM`:h===12?"12 PM":`${h-12} PM`}
          </div>,
          ...week.map(dk=>{
            const isT=dk===TODAY;
            const slotEvs=(byDate[dk]||[]).filter(e=>!e.allDay&&parseInt(e.startTime?.split(":")[0]||0)===h);
            return (
              <div key={dk+h} onDoubleClick={()=>onNew(dk)}
                style={{borderBottom: isDark ? "1px solid #1e293b" : "1px solid #f0f0ea", borderRight: isDark ? "1px solid #334155" : "1px solid #ebebeb", height:56,padding:"3px 4px",cursor:"pointer",background:isT ? (isDark ? "rgba(29, 158, 117, 0.05)" : "#fafdf9") : (isDark ? "#1e293b" : "#fff")}}
              >
                {slotEvs.map(ev=><EventChip key={ev.id} ev={ev} onEdit={onEdit}/>)}
              </div>
            );
          })
        ])}
      </div>
    </div>
  );
}

// ─── Day View ──────────────────────────────────────────────────────────────────
function DayView({ dk, evs, onEdit, onNew, isDark }) {
  const {day,month,year}=parseDKey(dk);
  const dow=new Date(year,month,day).getDay();
  const isT=dk===TODAY;
  const dayEvs=evs.filter(e=>e.date===dk);
  const adEvs=dayEvs.filter(e=>e.allDay);
  const timedEvs=dayEvs.filter(e=>!e.allDay);
  const HOURS=Array.from({length:24},(_,i)=>i);
  return (
    <div style={{flex:1,overflow:"auto"}}>
      <div style={{display:"grid",gridTemplateColumns:"56px 1fr",borderBottom: isDark ? "1px solid #334155" : "1px solid #ebebeb", background: isDark ? "#0f172a" : "#fafaf8"}}>
        <div/>
        <div style={{padding:"12px 16px"}}>
          <div style={{fontSize:11,fontWeight:600,color: isDark ? "#94a3b8" : "#aaa",letterSpacing:0.3}}>{DAYS_FULL[dow].toUpperCase()}</div>
          <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:36,height:36,borderRadius:"50%",marginTop:4,background:isT?"#1D9E75":"transparent",color:isT?"#fff":isDark?"#f1f5f9":"#1a1a1a",fontSize:22,fontWeight:700}}>{day}</div>
          {adEvs.map(ev=><EventChip key={ev.id} ev={ev} onEdit={onEdit}/>)}
        </div>
      </div>
      {HOURS.map(h=>{
        const slotEvs=timedEvs.filter(e=>parseInt(e.startTime?.split(":")[0]||0)===h);
        return (
          <div key={h} style={{display:"grid",gridTemplateColumns:"56px 1fr"}}>
            <div style={{borderBottom: isDark ? "1px solid #1e293b" : "1px solid #f0f0ea", borderRight: isDark ? "1px solid #334155" : "1px solid #ebebeb", padding:"4px 8px 0",height:60,background: isDark ? "#0f172a" : "#fafaf8",fontSize:11,color: isDark ? "#64748b" : "#bbb",fontWeight:500}}>
              {h===0?"12 AM":h<12?`${h} AM`:h===12?"12 PM":`${h-12} PM`}
            </div>
            <div onDoubleClick={()=>onNew(dk)} style={{borderBottom: isDark ? "1px solid #1e293b" : "1px solid #f0f0ea", height:60,padding:"3px 8px",cursor:"pointer", background: isDark ? "#1e293b" : "#fff"}}>
              {slotEvs.map(ev=>{
                const c=COLORS[ev.color]||COLORS.orange;
                return (
                  <div key={ev.id} onClick={e=>{e.stopPropagation();onEdit(ev);}}
                    style={{background:c.bg,color:c.text,borderLeft:`3px solid ${c.dot}`,borderRadius:"0 8px 8px 0",padding:"4px 10px",fontSize:12,fontWeight:600,marginBottom:2,cursor:"pointer"}}
                  >
                    {fmt12(ev.startTime)} – {fmt12(ev.endTime)} &nbsp; {ev.title}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Event Modal ──────────────────────────────────────────────────────────────
function EventModal({ ev, defDate, onSave, onDelete, onClose, isDark }) {
  const S = {
    navBtn: {
      width:32,height:32,borderRadius:8,border:isDark ? "1px solid #475569" : "1px solid #e0e0d8",
      background:isDark ? "#334155" : "#fff",cursor:"pointer",color:isDark ? "#f1f5f9" : "#444",fontSize:20,
      display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,
    },
    todayBtn: {
      padding:"7px 16px",fontSize:13,borderRadius:10,
      border:isDark ? "1px solid #475569" : "1px solid #e0e0d8",background:isDark ? "#334155" : "#fff",
      cursor:"pointer",color:isDark ? "#f1f5f9" : "#1a1a1a",fontWeight:500,
    },
    newBtn: {
      padding:"7px 16px",fontSize:13,borderRadius:10,
      border:"none",background:"#1D9E75",color:"#fff",
      cursor:"pointer",fontWeight:600,
    },
    input: {
      width:"100%",padding:"9px 12px",borderRadius:10,
      border:isDark ? "1px solid #475569" : "1px solid #e0e0d8",fontSize:13,color:isDark ? "#f1f5f9" : "#1a1a1a",
      outline:"none",fontFamily:"inherit",background:isDark ? "#0f172a" : "#fff",
      boxSizing:"border-box",
    },
    label: {
      fontSize:12,fontWeight:600,color:isDark ? "#94a3b8" : "#aaa",
      letterSpacing:0.3,display:"block",marginBottom:4,
    },
    cancelBtn: {
      padding:"8px 16px",borderRadius:10,border:isDark ? "1px solid #475569" : "1px solid #e0e0d8",
      background:isDark ? "#334155" : "#fff",color:isDark ? "#cbd5e1" : "#555",fontSize:13,fontWeight:500,cursor:"pointer"
    }
  };

  const pid=useId();
  const isEdit=!!(ev?.id ?? ev?._id);
  const [form,setForm]=useState({
    title:     ev?.title     || "",
    date:      ev?.date      || defDate || TODAY,
    startTime: ev?.startTime || "09:00",
    endTime:   ev?.endTime   || "10:00",
    color:     ev?.color     || "orange",
    allDay:    ev?.allDay    ?? false,
  });
  const [err,setErr]=useState("");
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));

  function handleSave() {
    if(!form.title.trim()){setErr("Title is required");return;}
    if(!form.date){setErr("Date is required");return;}
    onSave({...ev,...form,title:form.title.trim()});
  }

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background: isDark ? "#1e293b" : "#fff",borderRadius:16,width:"100%",maxWidth:440,boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.4)" : "0 20px 60px rgba(0,0,0,0.18)",overflow:"hidden",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>

        <div style={{background:isEdit?"#1D9E75":"#1a1a1a",padding:"18px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{color:"#fff",fontSize:16,fontWeight:600}}>{isEdit?"Edit Schedule":"+ New Schedule"}</span>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.18)",border:"none",color:"#fff",width:28,height:28,borderRadius:8,cursor:"pointer",fontSize:18,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>

        <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:14}}>
          {err&&<div style={{background:"#FDEAEA",color:"#b02020",borderRadius:8,padding:"8px 12px",fontSize:13}}>{err}</div>}

          <div>
            <label htmlFor={pid+"t"} style={S.label}>Title</label>
            <input id={pid+"t"} value={form.title} onChange={e=>{set("title",e.target.value);setErr("");}} placeholder="Event name..." style={S.input} autoFocus/>
          </div>

          <div>
            <label htmlFor={pid+"d"} style={S.label}>Date</label>
            <input id={pid+"d"} type="date" value={form.date} onChange={e=>set("date",e.target.value)} style={S.input}/>
          </div>

          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <input id={pid+"ad"} type="checkbox" checked={form.allDay} onChange={e=>set("allDay",e.target.checked)} style={{width:16,height:16,cursor:"pointer",accentColor:"#1D9E75", background: isDark ? "#0f172a" : "#fff"}}/>
            <label htmlFor={pid+"ad"} style={{fontSize:13,color: isDark ? "#cbd5e1" : "#555",cursor:"pointer"}}>All day event</label>
          </div>

          {!form.allDay&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <label htmlFor={pid+"st"} style={S.label}>Start</label>
                <input id={pid+"st"} type="time" value={form.startTime} onChange={e=>set("startTime",e.target.value)} style={S.input}/>
              </div>
              <div>
                <label htmlFor={pid+"et"} style={S.label}>End</label>
                <input id={pid+"et"} type="time" value={form.endTime} onChange={e=>set("endTime",e.target.value)} style={S.input}/>
              </div>
            </div>
          )}

          <div>
            <label style={S.label}>Color</label>
            <div style={{display:"flex",gap:8,marginTop:6}}>
              {COLOR_KEYS.map(c=>(
                <button key={c} title={c} onClick={()=>set("color",c)} style={{width:28,height:28,borderRadius:"50%",background:COLORS[c].dot,border:form.color===c ? (isDark ? "2.5px solid #f1f5f9" : "2.5px solid #1a1a1a") :"2.5px solid transparent",cursor:"pointer",transform:form.color===c?"scale(1.2)":"scale(1)",transition:"transform 0.1s"}}/>
              ))}
            </div>
          </div>
        </div>

        <div style={{padding:"14px 24px 20px",display:"flex",justifyContent:isEdit?"space-between":"flex-end",gap:10}}>
          {isEdit&&(
            <button onClick={()=>onDelete(ev.id ?? ev._id)} style={{padding:"8px 16px",borderRadius:10,border:"1px solid #FDEAEA",background:"#FDEAEA",color:"#b02020",fontSize:13,fontWeight:600,cursor:"pointer"}}>Delete</button>
          )}
          <div style={{display:"flex",gap:8}}>
            <button onClick={onClose} style={S.cancelBtn}>Cancel</button>
            <button onClick={handleSave} style={{padding:"8px 20px",borderRadius:10,border:"none",background:"#1D9E75",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>{isEdit?"Save changes":"Create"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CalendarPage ─────────────────────────────────────────────────────────────
export default function CalendarPage() {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const { events: evs, loading, error } = useSelector((state) => state.calendar);
  const isDark = mode === "dark";

  const S = {
    navBtn: {
      width:32,height:32,borderRadius:8,border:isDark ? "1px solid #475569" : "1px solid #e0e0d8",
      background:isDark ? "#334155" : "#fff",cursor:"pointer",color:isDark ? "#f1f5f9" : "#444",fontSize:20,
      display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,
    },
    todayBtn: {
      padding:"7px 16px",fontSize:13,borderRadius:10,
      border:isDark ? "1px solid #475569" : "1px solid #e0e0d8",background:isDark ? "#334155" : "#fff",
      cursor:"pointer",color:isDark ? "#f1f5f9" : "#1a1a1a",fontWeight:500,
    },
    newBtn: {
      padding:"7px 16px",fontSize:13,borderRadius:10,
      border:"none",background:"#1D9E75",color:"#fff",
      cursor:"pointer",fontWeight:600,
    },
  };

  const [year,   setYear]   = useState(2026);
  const [month,  setMonth]  = useState(3);
  const [weekDk, setWeekDk] = useState(TODAY);
  const [dayDk,  setDayDk]  = useState(TODAY);
  const [view,   setView]   = useState("Month");
  const [selDk,  setSelDk]  = useState(null);
  const [modal,  setModal]  = useState(null);

  // ── Auto-fetch on mount + on month/year change ──────────────────────────
  useEffect(() => {
    dispatch(fetchEvents({ year, month: month + 1 }));
  }, [dispatch, year, month]);

  // ── Navigation ──────────────────────────────────────────────────────────
  function prev() {
    if(view==="Month"){
      let m=month-1,y=year;
      if(m<0){m=11;y--;} setMonth(m);setYear(y);setSelDk(null);
    } else if(view==="Week"){
      setWeekDk(addDays(weekDk,-7));
    } else {
      setDayDk(addDays(dayDk,-1));
    }
  }
  function next() {
    if(view==="Month"){
      let m=month+1,y=year;
      if(m>11){m=0;y++;} setMonth(m);setYear(y);setSelDk(null);
    } else if(view==="Week"){
      setWeekDk(addDays(weekDk,7));
    } else {
      setDayDk(addDays(dayDk,1));
    }
  }
  function goToday() {
    const {year:y,month:m}=parseDKey(TODAY);
    setYear(y);setMonth(m);setWeekDk(TODAY);setDayDk(TODAY);setSelDk(TODAY);
  }

  function periodLabel() {
    if(view==="Month") return `${MONTHS[month]} ${year}`;
    if(view==="Week") {
      const w=buildWeek(weekDk);
      const a=parseDKey(w[0]),b=parseDKey(w[6]);
      if(a.month===b.month) return `${MONTHS[a.month]} ${a.day}–${b.day}, ${a.year}`;
      return `${MONTHS[a.month]} ${a.day} – ${MONTHS[b.month]} ${b.day}, ${a.year}`;
    }
    const {day:d,month:m,year:y}=parseDKey(dayDk);
    return `${MONTHS[m]} ${d}, ${y}`;
  }
  function todayLbl() {
    const {year:y,month:m,day:d}=parseDKey(TODAY);
    if(view==="Month"&&year===y&&month===m) return `Today (${d})`;
    return "Today";
  }

  // ── CRUD via Redux ──────────────────────────────────────────────────────
  const saveEv = useCallback((ev) => {
    const id = ev.id ?? ev._id;
    if (id) {
      dispatch(updateEvent({ ...ev, id }));
    } else {
      dispatch(createEvent(ev));
    }
    setModal(null);
  }, [dispatch]);

  const delEv = useCallback((id) => {
    dispatch(deleteEvent(id));
    setModal(null);
  }, [dispatch]);

  function openNew(defDate) { setModal({mode:"new",defDate:defDate||selDk||TODAY}); }
  function openEdit(ev)     { setModal({mode:"edit",ev}); }

  function changeView(v) {
    setView(v);
    if(v==="Week") setWeekDk(selDk||TODAY);
    if(v==="Day")  setDayDk(selDk||TODAY);
  }

  const VIEWS=["Month","Week","Day"];

  return (
    <div style={{background: "transparent",minHeight:"100vh",padding:24,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <div style={{background: isDark ? "#1e293b" : "#fff", border: isDark ? "1px solid #334155" : "1px solid #e8e8e0", borderRadius:16,overflow:"hidden",maxWidth:1200,margin:"0 auto",display:"flex",flexDirection:"column",minHeight:"calc(100vh - 48px)"}}>

        {/* Toolbar */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 28px 14px",flexWrap:"wrap",gap:12,borderBottom: isDark ? "1px solid #334155" : "1px solid #ebebeb"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={prev} style={S.navBtn}>‹</button>
            <span style={{fontSize:20,fontWeight:700,color: isDark ? "#f1f5f9" : "#1a1a1a",minWidth:200,textAlign:"center",letterSpacing:-0.3}}>{periodLabel()}</span>
            <button onClick={next} style={S.navBtn}>›</button>
          </div>
          <div style={{display:"flex",background: isDark ? "#0f172a" : "#f0f0ea", borderRadius:10,padding:4}}>
            {VIEWS.map(v=>(
              <button key={v} onClick={()=>changeView(v)} style={{padding:"6px 18px",fontSize:13,borderRadius:7,border:"none",cursor:"pointer",fontWeight:500,background:view===v ? (isDark ? "#334155" : "#fff") : "transparent",color:view===v ? (isDark ? "#1D9E75" : "#1a9e75") : (isDark ? "#94a3b8" : "#888"),boxShadow:view===v?"0 1px 3px rgba(0,0,0,0.08)":"none",transition:"all 0.15s"}}>{v}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            {/* Loading indicator */}
            {loading && (
              <span style={{fontSize:12,color:"#1D9E75",fontWeight:500,opacity:0.8}}>Syncing…</span>
            )}
            {/* Error indicator */}
            {error && !loading && (
              <span style={{fontSize:12,color:"#e05252",fontWeight:500}} title={error}>⚠ Offline</span>
            )}
            <button onClick={goToday} style={S.todayBtn}>{todayLbl()}</button>
            <button onClick={()=>openNew(null)} style={S.newBtn}>+ New Schedule</button>
          </div>
        </div>

        {/* Views */}
        {view==="Month"&&<MonthView year={year} month={month} evs={evs} selDate={selDk} onSel={dk=>setSelDk(p=>p===dk?null:dk)} onEdit={openEdit} onNew={openNew} isDark={isDark}/>}
        {view==="Week" &&<WeekView  refDk={weekDk} evs={evs} onEdit={openEdit} onNew={dk=>{setDayDk(dk);openNew(dk);}} isDark={isDark}/>}
        {view==="Day"  &&<DayView   dk={dayDk}     evs={evs} onEdit={openEdit} onNew={openNew} isDark={isDark}/>}

        {/* Selected panel */}
        {view==="Month"&&selDk&&<SelPanel dk={selDk} evs={evs} onEdit={openEdit} onNew={openNew} isDark={isDark}/>}
      </div>

      {/* Modal overlay */}
      {modal&&(
        <EventModal
          ev={modal.mode==="edit"?modal.ev:null}
          defDate={modal.defDate}
          onSave={saveEv}
          onDelete={delEv}
          onClose={()=>setModal(null)}
          isDark={isDark}
        />
      )}
    </div>
  );
}