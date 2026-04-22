import { configureStore } from "@reduxjs/toolkit";
import food     from "./slices/Food";
import theme    from "./slices/theme";
import start    from "./slices/start";
import calendar from "./slices/calendarSlice";
import reviews  from "./slices/Reviews";

const store = configureStore({
  reducer: {
    food,
    theme,
    starter:  start,
    calendar,
    reviews,
  },
});

export default store;
