import { configureStore } from "@reduxjs/toolkit";
import food from "./slices/Food";
import theme from "./slices/theme";

const store = configureStore({
    reducer: {
        food,
        theme,
    },
})

export default store;
