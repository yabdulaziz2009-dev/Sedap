import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE = import.meta.env.VITE_API_URL;

const SEED = [
  { id:1,  title:"Spicy Nugget",                  date:"2026-04-02", startTime:"09:00", endTime:"10:00", color:"orange", allDay:true  },
  { id:2,  title:"Pizza la Piazza With Barbeque",  date:"2026-04-02", startTime:"12:00", endTime:"13:30", color:"teal",   allDay:false },
  { id:3,  title:"Event",                          date:"2026-04-03", startTime:"08:00", endTime:"09:00", color:"blue",   allDay:false },
  { id:4,  title:"Fast",                           date:"2026-04-03", startTime:"10:00", endTime:"11:00", color:"purple", allDay:false },
  { id:5,  title:"Staff Meeting",                  date:"2026-04-03", startTime:"14:00", endTime:"15:00", color:"orange", allDay:false },
  { id:6,  title:"Event",                          date:"2026-04-07", startTime:"09:00", endTime:"10:00", color:"blue",   allDay:true  },
  { id:7,  title:"New Event",                      date:"2026-04-09", startTime:"08:04", endTime:"10:23", color:"red",    allDay:false },
  { id:8,  title:"Event Pass",                     date:"2026-04-14", startTime:"11:00", endTime:"12:00", color:"purple", allDay:false },
  { id:9,  title:"Spicy Nugget",                   date:"2026-04-18", startTime:"09:00", endTime:"10:00", color:"orange", allDay:true  },
  { id:10, title:"Pizza la Piazza With Barbeque",  date:"2026-04-18", startTime:"12:00", endTime:"13:30", color:"teal",   allDay:false },
  { id:11, title:"Design Review",                  date:"2026-04-18", startTime:"15:00", endTime:"16:00", color:"blue",   allDay:false },
  { id:12, title:"Spicy Nugget",                   date:"2026-04-22", startTime:"09:00", endTime:"10:00", color:"orange", allDay:true  },
  { id:13, title:"Pizza la Piazza With Barbeque",  date:"2026-04-22", startTime:"12:00", endTime:"13:30", color:"teal",   allDay:false },
  { id:14, title:"Sprint Planning",                date:"2026-04-22", startTime:"10:00", endTime:"11:30", color:"purple", allDay:false },
  { id:15, title:"New Event",                      date:"2026-04-25", startTime:"08:04", endTime:"10:23", color:"red",    allDay:false },
  { id:16, title:"Lunch with Sam",                 date:"2026-04-25", startTime:"12:00", endTime:"13:00", color:"teal",   allDay:false },
  { id:17, title:"Weekly Standup",                 date:"2026-04-26", startTime:"09:00", endTime:"09:30", color:"blue",   allDay:false },
  { id:18, title:"Client Call",                    date:"2026-04-27", startTime:"14:00", endTime:"15:00", color:"orange", allDay:false },
  { id:19, title:"Release Day",                    date:"2026-04-30", startTime:"10:00", endTime:"18:00", color:"red",    allDay:true  },
];

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchEvents = createAsyncThunk(
  "calendar/fetchEvents",
  async ({ year, month } = {}, { rejectWithValue }) => {
    try {
      let url = `${BASE}/events`;
      const params = new URLSearchParams();
      if (year  !== undefined) params.append("year",  year);
      if (month !== undefined) params.append("month", month);
      const qs = params.toString();
      if (qs) url += `?${qs}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data : data.events ?? data.data ?? [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createEvent = createAsyncThunk(
  "calendar/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.event ?? data.data ?? data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateEvent = createAsyncThunk(
  "calendar/updateEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const { id, ...body } = eventData;
      const res = await fetch(`${BASE}/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.event ?? data.data ?? data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "calendar/deleteEvent",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _localId = 1000;
function localUid() { return ++_localId; }

// Normalize backend response: MongoDB uses _id, we always want id
function normalize(ev) {
  if (!ev) return ev;
  if (ev._id !== undefined && ev.id === undefined) {
    const { _id, ...rest } = ev;
    return { ...rest, id: _id };
  }
  return ev;
}
function normalizeList(list) {
  return Array.isArray(list) ? list.map(normalize) : list;
}

const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    events:  [],
    loading: false,
    error:   null,
  },
  reducers: {},
  extraReducers: (builder) => {

    // fetchEvents
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchEvents.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.events  = normalizeList(payload);
      })
      .addCase(fetchEvents.rejected, (state, { payload }) => {
        state.loading = false;
        state.error   = payload;
        // fallback to SEED only if store is empty
        if (state.events.length === 0) state.events = SEED;
      });

    // createEvent
    builder
      .addCase(createEvent.pending, (state) => {
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, { payload }) => {
        state.events.push(normalize(payload));
      })
      .addCase(createEvent.rejected, (state, { payload, meta }) => {
        state.error = payload;
        // optimistic fallback: add with local id
        state.events.push({ ...meta.arg, id: localUid() });
      });

    // updateEvent
    builder
      .addCase(updateEvent.pending, (state) => {
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, { payload }) => {
        const normed = normalize(payload);
        const idx = state.events.findIndex((e) => e.id === normed.id);
        if (idx !== -1) state.events[idx] = normed;
      })
      .addCase(updateEvent.rejected, (state, { payload, meta }) => {
        state.error = payload;
        // optimistic fallback: update in place
        const idx = state.events.findIndex((e) => e.id === meta.arg.id);
        if (idx !== -1) state.events[idx] = meta.arg;
      });

    // deleteEvent
    builder
      .addCase(deleteEvent.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, { payload: id }) => {
        state.events = state.events.filter((e) => e.id !== id);
      })
      .addCase(deleteEvent.rejected, (state, { payload, meta }) => {
        state.error = payload;
        // optimistic fallback: remove anyway
        state.events = state.events.filter((e) => e.id !== meta.arg);
      });
  },
});

export default calendarSlice.reducer;