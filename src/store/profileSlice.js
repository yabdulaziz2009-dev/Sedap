import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getSession } from "../auth";

const BASE_URL = import.meta.env.VITE_API_URL;

const authHeaders = () => {
  const token = localStorage.getItem("sedap-token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ─── PROFILE ───────────────────────────────────────────────────────────────────
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    const session         = getSession();
    const nameFromSession = session?.fullName || session?.name || session?.login || "User";

    try {
      const res = await axios.get(`${BASE_URL}/auth/me`, authHeaders());
      const d   = res.data?.data || res.data?.user || res.data || {};
      return {
        name:     d.fullName || d.name || nameFromSession,
        email:    d.email    || session?.email || "",
        role:     d.role     || d.position     || "",
        phone:    d.phone    || d.phoneNumber  || "",
        location: d.location || d.address      || "",
        avatar:   d.avatar   || d.image        || null,
      };
    } catch {
      return {
        name:     nameFromSession,
        email:    session?.email || "",
        role:     "",
        phone:    "",
        location: "",
        avatar:   null,
      };
    }
  }
);

// PUT /auth/me
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ phone, location, avatar }, { getState, rejectWithValue }) => {
    try {
      const payload = {};
      if (phone    !== undefined) { payload.phone   = phone;    payload.phoneNumber = phone; }
      if (location !== undefined) { payload.location = location; payload.address    = location; }
      if (avatar   !== undefined) payload.avatar   = avatar;

      const res     = await axios.put(`${BASE_URL}/auth/me`, payload, authHeaders());
      const d       = res.data?.data || res.data?.user || res.data || {};
      const session = getSession();
      const current = getState().profile.profile;

      return {
        ...current,
        name:     d.fullName || d.name || session?.fullName || session?.name || current.name,
        phone:    d.phone    || d.phoneNumber || payload.phone    || current.phone,
        location: d.location || d.address    || payload.location || current.location,
        avatar:   d.avatar   || d.image      || payload.avatar   || current.avatar,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// PUT /auth/me/password
export const updatePassword = createAsyncThunk(
  "profile/updatePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      await axios.put(
        `${BASE_URL}/auth/me/password`,
        { currentPassword, newPassword },
        authHeaders()
      );
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ─── DASHBOARD STATS ────────────────────────────────────────────────────────────
export const fetchDashboardStats = createAsyncThunk(
  "profile/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/dashboard`, authHeaders());
      const d   = res.data?.data || res.data || {};
      return {
        totalOrders: Number(d.totalOrders ?? d.total_orders ?? 0),
        completed:   Number(d.completed   ?? d.completedOrders ?? d.readyOrders ?? 0),
        pending:     Number(d.pending     ?? d.pendingOrders   ?? 0),
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ─── FOOD ──────────────────────────────────────────────────────────────────────
export const createFood = createAsyncThunk(
  "profile/createFood",
  async (foodData, { rejectWithValue }) => {
    try {
      const res  = await axios.post(`${BASE_URL}/food`, foodData, authHeaders());
      const item = res.data?.data || res.data || {};
      return {
        id:       item._id || item.id || Date.now(),
        name:     item.name     || foodData.name,
        category: item.category?.name || item.category || foodData.category,
        price:    item.price    ?? foodData.price,
        stock:    item.stock    ?? foodData.stock,
        image:    item.image    || null,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const editFood = createAsyncThunk(
  "profile/editFood",
  async ({ id, ...foodData }, { rejectWithValue }) => {
    try {
      const res  = await axios.put(`${BASE_URL}/food/${id}`, foodData, authHeaders());
      const item = res.data?.data || res.data || {};
      return {
        id,
        name:     item.name     || foodData.name,
        category: item.category?.name || item.category || foodData.category,
        price:    item.price    ?? foodData.price,
        stock:    item.stock    ?? foodData.stock,
        image:    item.image    || null,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const removeFood = createAsyncThunk(
  "profile/removeFood",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/food/${id}`, authHeaders());
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ─── WALLET ────────────────────────────────────────────────────────────────────
const normalizePayment = (item) => ({
  id:       item._id      || item.id,
  method:   item.method   || item.paymentMethod || "Unknown",
  amount:   item.amount   || 0,
  status:   item.status   || "Pending",
  date:     item.date     || item.createdAt?.slice(0, 10) || "",
  customer: item.customer || item.customerName  || "",
  orderRef: item.orderRef || item.orderId       || "",
  notes:    item.notes    || item.description   || "",
});

export const fetchWallet = createAsyncThunk(
  "profile/fetchWallet",
  async (_, { rejectWithValue }) => {
    try {
      const res  = await axios.get(`${BASE_URL}/wallet`, authHeaders());
      const list = res.data?.data || res.data || [];
      return Array.isArray(list) ? list.map(normalizePayment) : [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createWallet = createAsyncThunk(
  "profile/createWallet",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/wallet`, data, authHeaders());
      return normalizePayment(res.data?.data || res.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateWallet = createAsyncThunk(
  "profile/updateWallet",
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const res  = await axios.put(`${BASE_URL}/wallet/${id}`, data, authHeaders());
      const item = res.data?.data || res.data || {};
      return normalizePayment({ ...item, _id: id });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteWallet = createAsyncThunk(
  "profile/deleteWallet",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/wallet/${id}`, authHeaders());
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ─── SLICE ─────────────────────────────────────────────────────────────────────
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: { name: "", role: "", email: "", phone: "", location: "", avatar: null },
    profileLoading: false,
    profileError:   null,
    profileSaving:  false,
    passwordSaving: false,
    passwordError:  null,
    dashboardStats:        { totalOrders: 0, completed: 0, pending: 0 },
    dashboardStatsLoading: false,
    foods:           [],
    foodsLoading:   false,
    foodsError:     null,
    foodSaving:     false,
    payments:        [],
    paymentsLoading: false,
    paymentsError:  null,
    paymentSaving:  false,
  },

  reducers: {
    setFoods(state, action)       { state.foods = action.payload; },
    clearPasswordError(state)     { state.passwordError = null; },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending,   (s) => { s.profileLoading = true;  s.profileError = null; })
      .addCase(fetchProfile.fulfilled, (s, a) => { s.profileLoading = false; s.profile = a.payload; })
      .addCase(fetchProfile.rejected,  (s, a) => { s.profileLoading = false; s.profileError = a.payload; });

    builder
      .addCase(updateProfile.pending,   (s) => { s.profileSaving = true;  s.profileError = null; })
      .addCase(updateProfile.fulfilled, (s, a) => { s.profileSaving = false; s.profile = a.payload; })
      .addCase(updateProfile.rejected,  (s, a) => { s.profileSaving = false; s.profileError = a.payload; });

    builder
      .addCase(updatePassword.pending,   (s) => { s.passwordSaving = true;  s.passwordError = null; })
      .addCase(updatePassword.fulfilled, (s) => { s.passwordSaving = false; })
      .addCase(updatePassword.rejected,  (s, a) => { s.passwordSaving = false; s.passwordError = a.payload; });

    builder
      .addCase(fetchDashboardStats.pending,   (s) => { s.dashboardStatsLoading = true; })
      .addCase(fetchDashboardStats.fulfilled, (s, a) => { s.dashboardStatsLoading = false; s.dashboardStats = a.payload; })
      .addCase(fetchDashboardStats.rejected,  (s) => { s.dashboardStatsLoading = false; });

    builder
      .addCase(createFood.pending,   (s) => { s.foodSaving = true; })
      .addCase(createFood.fulfilled, (s, a) => { s.foodSaving = false; s.foods.push(a.payload); })
      .addCase(createFood.rejected,  (s, a) => { s.foodSaving = false; s.foodsError = a.payload; });

    builder
      .addCase(editFood.pending,   (s) => { s.foodSaving = true; })
      .addCase(editFood.fulfilled, (s, a) => {
        s.foodSaving = false;
        const i = s.foods.findIndex((f) => f.id === a.payload.id);
        if (i !== -1) s.foods[i] = a.payload;
      })
      .addCase(editFood.rejected,  (s, a) => { s.foodSaving = false; s.foodsError = a.payload; });

    builder
      .addCase(removeFood.fulfilled, (s, a) => { s.foods = s.foods.filter((f) => f.id !== a.payload); })
      .addCase(removeFood.rejected,  (s, a) => { s.foodsError = a.payload; });

    builder
      .addCase(fetchWallet.pending,   (s) => { s.paymentsLoading = true;  s.paymentsError = null; })
      .addCase(fetchWallet.fulfilled, (s, a) => { s.paymentsLoading = false; s.payments = a.payload; })
      .addCase(fetchWallet.rejected,  (s, a) => { s.paymentsLoading = false; s.paymentsError = a.payload; });

    builder
      .addCase(createWallet.fulfilled, (s, a) => { s.payments.unshift(a.payload); });

    builder
      .addCase(updateWallet.pending,   (s) => { s.paymentSaving = true; })
      .addCase(updateWallet.fulfilled, (s, a) => {
        s.paymentSaving = false;
        const i = s.payments.findIndex((p) => p.id === a.payload.id);
        if (i !== -1) s.payments[i] = a.payload;
      })
      .addCase(updateWallet.rejected,  (s, a) => { s.paymentSaving = false; s.paymentsError = a.payload; });

    builder
      .addCase(deleteWallet.fulfilled, (s, a) => { s.payments = s.payments.filter((p) => p.id !== a.payload); });
  },
});

export const { setFoods, clearPasswordError } = profileSlice.actions;

export const selectProfile              = (s) => s.profile.profile;
export const selectProfileLoading       = (s) => s.profile.profileLoading;
export const selectProfileSaving        = (s) => s.profile.profileSaving;
export const selectProfileError         = (s) => s.profile.profileError;
export const selectPasswordSaving       = (s) => s.profile.passwordSaving;
export const selectPasswordError        = (s) => s.profile.passwordError;
export const selectDashboardStats       = (s) => s.profile.dashboardStats;
export const selectDashboardStatsLoading = (s) => s.profile.dashboardStatsLoading;
export const selectFoods                = (s) => s.profile.foods;
export const selectFoodsLoading         = (s) => s.profile.foodsLoading;
export const selectFoodSaving           = (s) => s.profile.foodSaving;
export const selectPayments             = (s) => s.profile.payments;
export const selectPaymentsLoading      = (s) => s.profile.paymentsLoading;
export const selectPaymentSaving        = (s) => s.profile.paymentSaving;

export default profileSlice.reducer;
