import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "https://sedab-backend.onrender.com/api/foods";

export const fetchFoods = createAsyncThunk("food/fetchFoods", async () => {
  const res = await axios.get(API);
  const foods = res.data.data;

  return foods.map((item) => {
    return {
      ...item,
      id: item._id,
      category: item.category?.name || "Food",
      subcategory: item.subcategory || "No subcategory",
      description: item.description || "No description",
      ingredients: item.ingredients || "No ingredients",
      nutritionInfo: item.nutritionInfo || "No nutrition info",
      stockAvailable: item.stockAvailable ?? true,
    };
  });
});

const foodSlice = createSlice({
  name: "food",

  initialState: {
    foods: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchFoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchFoods.fulfilled, (state, action) => {
        state.loading = false;
        state.foods = action.payload;
      })

      .addCase(fetchFoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Xatolik yuz berdi";
      });
  },
});

export default foodSlice.reducer;
