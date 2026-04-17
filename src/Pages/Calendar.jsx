// import React from 'react'
// import "cally"

// const Calendar = () => {
//   return (
//     <div>
// {/* <calendar-date class="cally bg-base-100 border border-base-300 shadow-lg rounded-box">
//   <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
//   <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
//   <calendar-month></calendar-month>
// </calendar-date> */}
//     </div>
//   )
// }

// export default Calendar










// import React, { useState } from "react";
// import dayjs from "dayjs";

// const eventsData = {
//   "2021-04-02": [{ title: "Spicy Nugget", color: "red" }],
//   "2021-04-09": [{ title: "New Event", color: "red" }],
//   "2021-04-18": [
//     { title: "Spicy Nugget", color: "green" },
//     { title: "Pizza BBQ", color: "green" },
//   ],
// };

// const Calendar = () => {
//   const [currentDate, setCurrentDate] = useState(dayjs());

//   const startOfMonth = currentDate.startOf("month");
//   const endOfMonth = currentDate.endOf("month");

//   const startDay = startOfMonth.day(); // week start
//   const daysInMonth = currentDate.daysInMonth();

//   const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
//   const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));

//   const generateDays = () => {
//     const days = [];

//     // empty cells before month starts
//     for (let i = 0; i < startDay; i++) {
//       days.push(null);
//     }

//     // real days
//     for (let i = 1; i <= daysInMonth; i++) {
//       days.push(i);
//     }

//     return days;
//   };

//   const days = generateDays();
//   const today = dayjs().format("YYYY-MM-DD");

//   return (
//     <div className="bg-[#f5f6fa] min-h-screen flex justify-center items-center p-6">
//       <div className="bg-white w-full max-w-5xl rounded-2xl shadow-lg p-6">

//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-4">
//           <div className="flex items-center gap-3">
//             <button onClick={prevMonth}>⬅️</button>
//             <h2 className="text-xl font-semibold">
//               {currentDate.format("MMMM YYYY")}
//             </h2>
//             <button onClick={nextMonth}>➡️</button>
//           </div>

//           <button
//             onClick={() => setCurrentDate(dayjs())}
//             className="bg-gray-100 px-3 py-1 rounded-lg text-sm"
//           >
//             Today
//           </button>
//         </div>

//         {/* DAYS */}
//         <div className="grid grid-cols-7 text-center text-gray-400 text-sm mb-2">
//           {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
//             <div key={d}>{d}</div>
//           ))}
//         </div>

//         {/* GRID */}
//         <div className="grid grid-cols-7 gap-2">
//           {days.map((day, i) => {
//             if (!day) {
//               return <div key={i}></div>;
//             }

//             const fullDate = currentDate.date(day).format("YYYY-MM-DD");
//             const events = eventsData[fullDate] || [];

//             return (
//               <div
//                 key={i}
//                 className={`h-28 border rounded-xl p-2 ${
//                   fullDate === today ? "bg-green-50" : ""
//                 }`}
//               >
//                 <span className="text-gray-400 text-sm">{day}</span>

//                 <div className="mt-2 space-y-1">
//                   {events.map((e, idx) => (
//                     <div
//                       key={idx}
//                       className={`text-white text-xs px-2 py-1 rounded-full ${
//                         e.color === "red"
//                           ? "bg-red-400"
//                           : "bg-green-500"
//                       }`}
//                     >
//                       {e.title}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Calendar;




// import React, { useState } from "react";
// import dayjs from "dayjs";

// const Calendar = () => {
//   const [currentDate, setCurrentDate] = useState(dayjs());
//   const [view, setView] = useState("month"); // date | week | month | year
//   const [events, setEvents] = useState({});
//   const [showModal, setShowModal] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [title, setTitle] = useState("");

//   const today = dayjs().format("YYYY-MM-DD");

//   // ➕ ADD EVENT
//   const addEvent = () => {
//     if (!title) return;

//     setEvents((prev) => ({
//       ...prev,
//       [selectedDate]: [...(prev[selectedDate] || []), { title }],
//     }));

//     setShowModal(false);
//     setTitle("");
//   };

//   // 📅 MONTH GRID
//   const generateMonth = () => {
//     const startOfMonth = currentDate.startOf("month");
//     const daysInMonth = currentDate.daysInMonth();
//     const startDay = startOfMonth.day();

//     const days = [];

//     for (let i = 0; i < startDay; i++) days.push(null);
//     for (let i = 1; i <= daysInMonth; i++) days.push(i);

//     return days;
//   };

//   // 📅 WEEK VIEW
//   const generateWeek = () => {
//     const start = currentDate.startOf("week");
//     return Array.from({ length: 7 }).map((_, i) =>
//       start.add(i, "day")
//     );
//   };

//   // 📅 YEAR VIEW
//   const generateYear = () => {
//     return Array.from({ length: 12 }).map((_, i) =>
//       currentDate.month(i)
//     );
//   };

//   return (
//     <div className="bg-[#f5f6fa] min-h-screen flex justify-center items-center p-6">
//       <div className="bg-white w-full max-w-5xl rounded-2xl shadow-lg p-6">

//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">
//             {currentDate.format("MMMM YYYY")}
//           </h2>

//           <div className="flex gap-2">
//             <button
//               onClick={() => setCurrentDate(dayjs())}
//               className="bg-gray-100 px-3 py-1 rounded-lg text-sm"
//             >
//               Today
//             </button>

//             <button
//               onClick={() => {
//                 setSelectedDate(today);
//                 setShowModal(true);
//               }}
//               className="bg-green-500 text-white px-4 py-1 rounded-lg text-sm"
//             >
//               + New Schedule
//             </button>
//           </div>
//         </div>

//         {/* SWITCH */}
//         <div className="flex justify-center gap-6 text-sm mb-4">
//           {["date", "week", "month", "year"].map((v) => (
//             <button
//               key={v}
//               onClick={() => setView(v)}
//               className={`capitalize pb-1 ${
//                 view === v
//                   ? "text-green-500 border-b-2 border-green-500"
//                   : "text-gray-400"
//               }`}
//             >
//               {v}
//             </button>
//           ))}
//         </div>

//         {/* VIEW RENDER */}
//         {view === "month" && (
//           <>
//             <div className="grid grid-cols-7 text-center text-gray-400 text-sm mb-2">
//               {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
//                 <div key={d}>{d}</div>
//               ))}
//             </div>

//             <div className="grid grid-cols-7 gap-2">
//               {generateMonth().map((day, i) => {
//                 if (!day) return <div key={i}></div>;

//                 const fullDate = currentDate
//                   .date(day)
//                   .format("YYYY-MM-DD");

//                 const dayEvents = events[fullDate] || [];

//                 return (
//                   <div
//                     key={i}
//                     onClick={() => {
//                       setSelectedDate(fullDate);
//                       setShowModal(true);
//                     }}
//                     className={`h-28 border rounded-xl p-2 cursor-pointer ${
//                       fullDate === today ? "bg-green-50" : ""
//                     }`}
//                   >
//                     <span className="text-gray-400 text-sm">{day}</span>

//                     <div className="mt-2 space-y-1">
//                       {dayEvents.map((e, idx) => (
//                         <div
//                           key={idx}
//                           className="bg-green-500 text-white text-xs px-2 py-1 rounded-full"
//                         >
//                           {e.title}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </>
//         )}

//         {view === "week" && (
//           <div className="grid grid-cols-7 gap-2">
//             {generateWeek().map((d, i) => {
//               const fullDate = d.format("YYYY-MM-DD");
//               const dayEvents = events[fullDate] || [];

//               return (
//                 <div
//                   key={i}
//                   className="h-32 border rounded-xl p-2"
//                 >
//                   <div className="text-sm text-gray-400">
//                     {d.format("DD MMM")}
//                   </div>

//                   {dayEvents.map((e, idx) => (
//                     <div
//                       key={idx}
//                       className="bg-blue-500 text-white text-xs px-2 py-1 rounded mt-1"
//                     >
//                       {e.title}
//                     </div>
//                   ))}
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {view === "year" && (
//           <div className="grid grid-cols-4 gap-4">
//             {generateYear().map((m, i) => (
//               <div
//                 key={i}
//                 className="border rounded-xl p-4 text-center cursor-pointer hover:bg-gray-100"
//                 onClick={() => {
//                   setCurrentDate(m);
//                   setView("month");
//                 }}
//               >
//                 {m.format("MMMM")}
//               </div>
//             ))}
//           </div>
//         )}

//         {view === "date" && (
//           <div className="text-center p-10 text-gray-500">
//             Select a date to see details
//           </div>
//         )}
//       </div>

//       {/* MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-xl w-80">
//             <h3 className="mb-3 font-semibold">
//               Add Event ({selectedDate})
//             </h3>

//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Event title"
//               className="border w-full p-2 rounded mb-3"
//             />

//             <div className="flex justify-end gap-2">
//               <button onClick={() => setShowModal(false)}>
//                 Cancel
//               </button>
//               <button
//                 onClick={addEvent}
//                 className="bg-green-500 text-white px-3 py-1 rounded"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Calendar;





import React, { useState } from "react";
import dayjs from "dayjs";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [view, setView] = useState("month");
  const [events, setEvents] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [title, setTitle] = useState("");

  const today = dayjs().format("YYYY-MM-DD");

  // ➕ ADD EVENT
  const addEvent = () => {
    if (!title) return;

    setEvents((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), { title }],
    }));

    setShowModal(false);
    setTitle("");
  };

  // ❌ DELETE EVENT
  const deleteEvent = (date, index) => {
    setEvents((prev) => {
      const updated = { ...prev };
      updated[date].splice(index, 1);

      if (updated[date].length === 0) {
        delete updated[date];
      }

      return updated;
    });
  };

  // 📅 MONTH
  const generateMonth = () => {
    const start = currentDate.startOf("month");
    const daysInMonth = currentDate.daysInMonth();
    const startDay = start.day();

    const arr = [];

    for (let i = 0; i < startDay; i++) arr.push(null);
    for (let i = 1; i <= daysInMonth; i++) arr.push(i);

    return arr;
  };

  // 📅 WEEK
  const generateWeek = () => {
    const start = currentDate.startOf("week");
    return Array.from({ length: 7 }).map((_, i) =>
      start.add(i, "day")
    );
  };

  // 📅 YEAR
  const generateYear = () => {
    return Array.from({ length: 12 }).map((_, i) =>
      currentDate.month(i)
    );
  };

  return (
    <div className="bg-[#f5f6fa] min-h-screen flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-lg p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}>⬅️</button>
            <h2 className="text-xl font-semibold">
              {currentDate.format("MMMM YYYY")}
            </h2>
            <button onClick={() => setCurrentDate(currentDate.add(1, "month"))}>➡️</button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDate(dayjs())}
              className="bg-gray-100 px-3 py-1 rounded-lg text-sm"
            >
              Today
            </button>

            <button
              onClick={() => {
                setSelectedDate(today);
                setShowModal(true);
              }}
              className="bg-green-500 text-white px-4 py-1 rounded-lg text-sm"
            >
              + New Schedule
            </button>
          </div>
        </div>

        {/* SWITCH */}
        <div className="flex justify-center gap-6 text-sm mb-4">
          {["date", "week", "month", "year"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`capitalize pb-1 ${
                view === v
                  ? "text-green-500 border-b-2 border-green-500"
                  : "text-gray-400"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* MONTH VIEW */}
        {view === "month" && (
          <>
            <div className="grid grid-cols-7 text-center text-gray-400 text-sm mb-2">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {generateMonth().map((day, i) => {
                if (!day) return <div key={i}></div>;

                const fullDate = currentDate.date(day).format("YYYY-MM-DD");
                const dayEvents = events[fullDate] || [];

                return (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedDate(fullDate);
                      setShowModal(true);
                    }}
                    className={`h-28 border rounded-xl p-2 cursor-pointer ${
                      fullDate === today ? "bg-green-50" : ""
                    }`}
                  >
                    <span className="text-gray-400 text-sm">{day}</span>

                    <div className="mt-2 space-y-1">
                      {dayEvents.map((e, idx) => (
                        <div
                          key={idx}
                          className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex justify-between items-center"
                        >
                          <span>{e.title}</span>

                          <button
                            onClick={(ev) => {
                              ev.stopPropagation();
                              deleteEvent(fullDate, idx);
                            }}
                            className="ml-2 text-xs bg-white/20 px-1 rounded"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* WEEK VIEW */}
        {view === "week" && (
          <div className="grid grid-cols-7 gap-2">
            {generateWeek().map((d, i) => {
              const fullDate = d.format("YYYY-MM-DD");
              const dayEvents = events[fullDate] || [];

              return (
                <div key={i} className="h-32 border rounded-xl p-2">
                  <div className="text-sm text-gray-400">
                    {d.format("DD MMM")}
                  </div>

                  {dayEvents.map((e, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-500 text-white text-xs px-2 py-1 rounded mt-1 flex justify-between items-center"
                    >
                      <span>{e.title}</span>

                      <button
                        onClick={() => deleteEvent(fullDate, idx)}
                        className="ml-2 text-xs bg-white/20 px-1 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* YEAR VIEW */}
        {view === "year" && (
          <div className="grid grid-cols-4 gap-4">
            {generateYear().map((m, i) => (
              <div
                key={i}
                onClick={() => {
                  setCurrentDate(m);
                  setView("month");
                }}
                className="border rounded-xl p-4 text-center cursor-pointer hover:bg-gray-100"
              >
                {m.format("MMMM")}
              </div>
            ))}
          </div>
        )}

        {/* DATE VIEW */}
        {view === "date" && (
          <div className="text-center p-10 text-gray-500">
            Click any date to add/view events
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-80">
            <h3 className="mb-3 font-semibold">
              Add Event ({selectedDate})
            </h3>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="border w-full p-2 rounded mb-3"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                onClick={addEvent}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;