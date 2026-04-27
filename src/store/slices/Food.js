import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const authHeaders = () => {
  const token = localStorage.getItem("sedap-token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchFoods = createAsyncThunk(
  "food/fetchFood",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/food`, authHeaders());

      const foods = res.data?.data || [];

      return foods.map((item) => ({
        ...item,
        id: item._id,
        category: item.category?.name || "Food",
        subcategory: item.subcategory || "No subcategory",
        description: item.description || "No description",
        ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
        nutritionInfo: item.nutritionInfo || "No nutrition info",
        stockAvailable: item.stockAvailable ?? true,
        image: item.image || null,
      }));
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Server xatolik"
      );
    }
  }
);

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
        state.foods = action.payload || [];
      })
      .addCase(fetchFoods.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || "Xatolik yuz berdi";
      });
  },
});

export default foodSlice.reducer;
