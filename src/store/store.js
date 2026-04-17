import { configureStore } from "@reduxjs/toolkit";
import start from './slices/start'
import food from "./slices/Food";
const store =configureStore({
    reducer:{
        starter:start,
        food
    }
})

export default store;
