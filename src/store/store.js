import { configureStore } from "@reduxjs/toolkit";
import food from "./slices/Food";

const store = configureStore({
    reducer: {
        food,
    },
})

export default store;
