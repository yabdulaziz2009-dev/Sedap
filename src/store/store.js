import { configureStore } from "@reduxjs/toolkit";
import start from './slices/start'

const store = configureStore({
    reducer:{
        starter:start
    }
})

export default store;