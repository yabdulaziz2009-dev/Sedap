import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const REVIEWS_API = "https://sedab-backend.onrender.com/api/reviews";

export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(REVIEWS_API);
      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Xatolik"
      );
    }
  }
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Xatolik yuz berdi";
      });
  },
});

export default reviewsSlice.reducer;