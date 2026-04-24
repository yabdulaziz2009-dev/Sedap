import { configureStore } from "@reduxjs/toolkit";
import food from "./slices/Food";
import theme from "./slices/theme";
import start from "./slices/start";
import reviewsReducer from "./slices/Reviews";

const store = configureStore({
    reducer: {
        food,
        theme,
        starter: start,
        reviews: reviewsReducer,
    },
})

export default store;