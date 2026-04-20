import { configureStore } from "@reduxjs/toolkit";
import food from "./slices/Food";
import theme from "./slices/theme";
import start from "./slices/start";

const store = configureStore({
    reducer: {
        food,
        theme,
        starter: start,
    },
})

export default store;
