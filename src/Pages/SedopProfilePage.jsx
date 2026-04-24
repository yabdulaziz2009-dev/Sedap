import React, { useState, useRef, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Mail, Phone, MapPin, Edit2, Camera, ShieldCheck,
  Utensils, Trash2, Plus, Eye, X, Check, AlertCircle,
  ChevronRight, DollarSign, Tag, Package, Clock,
  Hash, User, FileText, CreditCard, CheckCircle2,
  XCircle, Loader2, Save, RotateCcw, ShoppingBag,
  Star, Activity,
} from "lucide-react";

import {
  fetchProfile, updateProfile, updatePassword,
  createFood, editFood, removeFood,
  fetchWallet, updateWallet,
  setFoods, clearPasswordError,
  selectProfile, selectProfileLoading, selectProfileSaving,
  selectPasswordSaving, selectPasswordError,
  selectFoods, selectFoodSaving,
  selectPayments, selectPaymentsLoading,
} from "../store/profileSlice";

import { fetchFoods } from "../store/slices/Food";

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white text-sm font-medium min-w-[280px] ${t.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
          style={{ animation: "slideInRight 0.3s ease" }}>
          {t.type === "success" ? <CheckCircle2 size={18} className="shrink-0" /> : <XCircle size={18} className="shrink-0" />}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="opacity-70 hover:opacity-100"><X size={16} /></button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add    = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);
  const remove = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), []);
  return { toasts, add, remove };
}

// ─── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, children, maxWidth = "max-w-lg" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`bg-white w-full ${maxWidth} rounded-3xl shadow-2xl`}
        style={{ animation: "scaleIn 0.2s ease" }}>
        {children}
      </div>
    </div>
  );
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg  = { Completed: "bg-emerald-50 text-emerald-700 border-emerald-200", Pending: "bg-amber-50 text-amber-700 border-amber-200", Failed: "bg-red-50 text-red-600 border-red-200" };
  const dots = { Completed: "bg-emerald-500", Pending: "bg-amber-500", Failed: "bg-red-500" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg[status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || "bg-gray-400"}`} />
      {status}
    </span>
  );
}

// ─── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Field ─────────────────────────────────────────────────────────────────────
function Field({ label, icon: Icon, error, className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>}
      <div className="relative">
        {Icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Icon size={16} /></div>}
        <input className={`w-full border rounded-2xl py-3 pr-4 text-sm text-gray-800 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all placeholder:text-gray-400 ${Icon ? "pl-11" : "pl-4"} ${error ? "border-red-300 bg-red-50" : "border-gray-200"}`} {...props} />
      </div>
      {error && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
    </div>
  );
}

// ─── Password Field ────────────────────────────────────────────────────────────
function PasswordField({ label, error, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>}
      <div className="relative">
        <input type={show ? "text" : "password"}
          className={`w-full border rounded-2xl py-3 pl-4 pr-12 text-sm text-gray-800 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all placeholder:text-gray-400 ${error ? "border-red-300 bg-red-50" : "border-gray-200"}`}
          {...props} />
        <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
          <Eye size={16} />
        </button>
      </div>
      {error && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
    </div>
  );
}

// ─── Password Strength ─────────────────────────────────────────────────────────
function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ chars",   pass: password.length >= 8 },
    { label: "Uppercase",  pass: /[A-Z]/.test(password) },
    { label: "Number",     pass: /\d/.test(password) },
    { label: "Special",    pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score    = checks.filter((c) => c.pass).length;
  const strength = score <= 1 ? "Weak" : score <= 2 ? "Fair" : score <= 3 ? "Good" : "Strong";
  const colors   = ["bg-red-400", "bg-amber-400", "bg-yellow-400", "bg-emerald-500"];
  if (!password) return null;
  return (
    <div className="mt-1">
      <div className="flex gap-1 mb-2">
        {[0,1,2,3].map((i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : "bg-gray-200"}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {checks.map((c) => (
            <span key={c.label} className={`text-xs flex items-center gap-1 ${c.pass ? "text-emerald-600" : "text-gray-400"}`}>
              {c.pass ? <Check size={11} /> : <X size={11} />} {c.label}
            </span>
          ))}
        </div>
        <span className={`text-xs font-semibold ${score >= 3 ? "text-emerald-600" : score >= 2 ? "text-amber-600" : "text-red-500"}`}>{strength}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function SedopProfilePage() {
  const dispatch = useDispatch();
  const { toasts, add: addToast, remove: removeToast } = useToast();
  const fileInputRef = useRef(null);

  // ── Redux ──────────────────────────────────────────────────────────────────
  const profile         = useSelector(selectProfile);
  const profileLoading  = useSelector(selectProfileLoading);
  const profileSaving   = useSelector(selectProfileSaving);
  const passwordSaving  = useSelector(selectPasswordSaving);
  const passwordError   = useSelector(selectPasswordError);
  const foods           = useSelector(selectFoods);
  const foodSaving      = useSelector(selectFoodSaving);
  const payments        = useSelector(selectPayments);
  const paymentsLoading = useSelector(selectPaymentsLoading);

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchFoods()).then((a) => {
      if (a.payload) dispatch(setFoods(a.payload));
    });
    dispatch(fetchWallet());
  }, [dispatch]);

  useEffect(() => {
    if (passwordError) setSecurityErrors((p) => ({ ...p, _server: passwordError }));
  }, [passwordError]);

  // ── Profile edit ───────────────────────────────────────────────────────────
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [avatarPreview,    setAvatarPreview]     = useState(null);
  // draft only holds phone + location (name is read-only from session)
  const [profileDraft,     setProfileDraft]      = useState({ phone: "", location: "" });
  const [profileErrors,    setProfileErrors]     = useState({});

  useEffect(() => {
    if (!isEditingProfile) {
      setProfileDraft({ phone: profile.phone || "", location: profile.location || "" });
    }
  }, [profile]);                                // eslint-disable-line

  const startEditProfile = () => {
    setProfileDraft({ phone: profile.phone || "", location: profile.location || "" });
    setProfileErrors({});
    setIsEditingProfile(true);
  };

  const cancelEditProfile = () => {
    setProfileDraft({ phone: profile.phone || "", location: profile.location || "" });
    setAvatarPreview(null);
    setProfileErrors({});
    setIsEditingProfile(false);
  };

  const saveProfile = async () => {
    const errs = {};
    if (!profileDraft.phone?.trim()) errs.phone = "Phone is required";
    if (Object.keys(errs).length) { setProfileErrors(errs); return; }

    const payload = { ...profileDraft };
    if (avatarPreview) payload.avatar = avatarPreview;

    const result = await dispatch(updateProfile(payload));
    if (updateProfile.fulfilled.match(result)) {
      setIsEditingProfile(false);
      setAvatarPreview(null);
      setProfileErrors({});
      addToast("Profile updated successfully");
    } else {
      addToast(result.payload || "Failed to update profile", "error");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // ── Security modal ─────────────────────────────────────────────────────────
  const [showSecurity,   setShowSecurity]   = useState(false);
  const [securityForm,   setSecurityForm]   = useState({ current: "", next: "", confirm: "" });
  const [securityErrors, setSecurityErrors] = useState({});

  const validateSecurity = () => {
    const errs = {};
    if (!securityForm.current) errs.current = "Current password is required";
    if (!securityForm.next)    errs.next    = "New password is required";
    else if (securityForm.next.length < 8)  errs.next = "At least 8 characters required";
    if (!securityForm.confirm) errs.confirm = "Please confirm your new password";
    else if (securityForm.next !== securityForm.confirm) errs.confirm = "Passwords do not match";
    if (securityForm.current && securityForm.next && securityForm.current === securityForm.next)
      errs.next = "New password must differ from current";
    return errs;
  };

  const savePassword = async () => {
    const errs = validateSecurity();
    if (Object.keys(errs).length) { setSecurityErrors(errs); return; }
    dispatch(clearPasswordError());
    const result = await dispatch(updatePassword({ currentPassword: securityForm.current, newPassword: securityForm.next }));
    if (updatePassword.fulfilled.match(result)) {
      setShowSecurity(false);
      setSecurityForm({ current: "", next: "", confirm: "" });
      setSecurityErrors({});
      addToast("Password updated successfully");
    } else {
      setSecurityErrors({ _server: result.payload || "Failed to update password" });
    }
  };

  const closeSecurity = () => {
    setShowSecurity(false);
    setSecurityForm({ current: "", next: "", confirm: "" });
    setSecurityErrors({});
    dispatch(clearPasswordError());
  };

  // ── Food modal ─────────────────────────────────────────────────────────────
  const [showFoodModal,  setShowFoodModal]  = useState(false);
  const [editingFood,    setEditingFood]    = useState(null);
  const [foodForm,       setFoodForm]       = useState({ name: "", category: "", price: "", stock: "" });
  const [foodErrors,     setFoodErrors]     = useState({});
  const [deletingFoodId, setDeletingFoodId] = useState(null);

  const CATEGORIES = ["Noodles", "Fast Food", "Salads", "Pizza", "Drinks", "Desserts", "Snacks", "Other"];

  const openAddFood = () => {
    setEditingFood(null);
    setFoodForm({ name: "", category: "", price: "", stock: "" });
    setFoodErrors({});
    setShowFoodModal(true);
  };

  const openEditFood = (item) => {
    setEditingFood(item);
    setFoodForm({ name: item.name, category: item.category, price: String(item.price), stock: String(item.stock) });
    setFoodErrors({});
    setShowFoodModal(true);
  };

  const validateFood = () => {
    const errs = {};
    if (!foodForm.name.trim())  errs.name     = "Food name is required";
    if (!foodForm.category)     errs.category = "Category is required";
    if (!foodForm.price || isNaN(foodForm.price) || Number(foodForm.price) <= 0) errs.price = "Valid price required";
    if (!foodForm.stock || isNaN(foodForm.stock) || Number(foodForm.stock) < 0)  errs.stock = "Valid stock required";
    return errs;
  };

  const saveFood = async () => {
    const errs = validateFood();
    if (Object.keys(errs).length) { setFoodErrors(errs); return; }

    if (editingFood) {
      const result = await dispatch(editFood({ id: editingFood.id, name: foodForm.name, category: foodForm.category, price: Number(foodForm.price), stock: Number(foodForm.stock) }));
      if (editFood.fulfilled.match(result)) { addToast(`"${foodForm.name}" updated`); setShowFoodModal(false); }
      else addToast(result.payload || "Failed to update item", "error");
    } else {
      const result = await dispatch(createFood({ name: foodForm.name, category: foodForm.category, price: Number(foodForm.price), stock: Number(foodForm.stock) }));
      if (createFood.fulfilled.match(result)) { addToast(`"${foodForm.name}" added to menu`); setShowFoodModal(false); }
      else addToast(result.payload || "Failed to add item", "error");
    }
  };

  const handleDeleteFood = async (id) => {
    const item   = foods.find((f) => f.id === id);
    const result = await dispatch(removeFood(id));
    setDeletingFoodId(null);
    if (removeFood.fulfilled.match(result)) addToast(`"${item?.name}" removed`, "error");
    else addToast(result.payload || "Failed to remove item", "error");
  };

  // ── Payments ───────────────────────────────────────────────────────────────
  const [selectedPayment, setSelectedPayment] = useState(null);

  const cycleStatus = async (payment) => {
    const next = payment.status === "Pending" ? "Completed" : payment.status === "Failed" ? "Pending" : "Completed";
    const result = await dispatch(updateWallet({ id: payment.id, status: next }));
    if (updateWallet.fulfilled.match(result)) {
      if (selectedPayment?.id === payment.id) setSelectedPayment((p) => ({ ...p, status: next }));
      addToast("Payment status updated");
    } else addToast(result.payload || "Failed to update status", "error");
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = [
    { title: "Total Orders", value: payments.length.toString(),                                          icon: ShoppingBag,  trend: "+12%" },
    { title: "Completed",    value: payments.filter((p) => p.status === "Completed").length.toString(),  icon: CheckCircle2, trend: "+8%"  },
    { title: "Pending",      value: payments.filter((p) => p.status === "Pending").length.toString(),    icon: Clock,        trend: "-3%"  },
    { title: "Menu Items",   value: foods.length.toString(),                                             icon: Star,         trend: "+21%" },
  ];

  const initials  = (profile.name || "U").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const avatarSrc = avatarPreview || profile.avatar || null;

  return (
    <>
      <style>{`
        @keyframes slideInRight { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes scaleIn      { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
        @keyframes fadeUp       { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <Toast toasts={toasts} removeToast={removeToast} />

      <main className="min-h-screen bg-[#F4F6FA] p-6 lg:p-8 font-sans">

        {/* ── Page Header ── */}
        <div className="mb-8" style={{ animation: "fadeUp .4s ease" }}>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Profile</h2>
          <p className="text-gray-500 mt-1 text-sm">Manage your account, menu items, and payments</p>
        </div>

        {/* ── Profile Card ── */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mb-6" style={{ animation: "fadeUp .45s ease" }}>
          {profileLoading ? (
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <Loader2 size={18} className="animate-spin" /> Loading profile…
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-28 h-28 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                    {avatarSrc
                      ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                      : <span>{initials}</span>
                    }
                  </div>
                  {isEditingProfile && (
                    <>
                      <button onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-colors">
                        <Camera size={17} />
                      </button>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </>
                  )}
                </div>

                {/* Info */}
                {isEditingProfile ? (
                  <div className="flex flex-col gap-4 w-full max-w-sm">
                    {/* Name — read-only display (not editable) */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl">
                        <User size={16} className="text-gray-300 shrink-0" />
                        <span className="text-sm text-gray-400 select-none">{profile.name}</span>
                        <span className="ml-auto text-xs text-gray-300 italic">from account</span>
                      </div>
                    </div>
                    {/* Phone — editable */}
                    <Field label="Phone Number" icon={Phone} placeholder="+998 90 000 00 00"
                      value={profileDraft.phone}
                      onChange={(e) => setProfileDraft({ ...profileDraft, phone: e.target.value })}
                      error={profileErrors.phone} />
                    {/* Address — editable */}
                    <Field label="Address / Location" icon={MapPin} placeholder="City, Country"
                      value={profileDraft.location}
                      onChange={(e) => setProfileDraft({ ...profileDraft, location: e.target.value })} />
                  </div>
                ) : (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{profile.name}</h3>
                    <p className="text-emerald-600 font-medium text-sm mt-1">{profile.role}</p>
                    <div className="mt-4 flex flex-col gap-2.5 text-sm text-gray-600">
                      <span className="flex items-center gap-2.5"><Mail    size={15} className="text-gray-400" />{profile.email    || "—"}</span>
                      <span className="flex items-center gap-2.5"><Phone   size={15} className="text-gray-400" />{profile.phone    || "—"}</span>
                      <span className="flex items-center gap-2.5"><MapPin  size={15} className="text-gray-400" />{profile.location || "—"}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                {isEditingProfile ? (
                  <>
                    <button onClick={cancelEditProfile} disabled={profileSaving}
                      className="px-5 py-2.5 rounded-2xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-60">
                      <RotateCcw size={15} /> Cancel
                    </button>
                    <button onClick={saveProfile} disabled={profileSaving}
                      className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm shadow-emerald-200">
                      {profileSaving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : <><Save size={15} /> Save Changes</>}
                    </button>
                  </>
                ) : (
                  <button onClick={startEditProfile}
                    className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm shadow-emerald-200">
                    <Edit2 size={15} /> Edit Profile
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6" style={{ animation: "fadeUp .5s ease" }}>
          {stats.map((s) => (
            <div key={s.title} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <s.icon size={18} />
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.trend.startsWith("+") ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"}`}>
                  {s.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.title}</p>
            </div>
          ))}
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="xl:col-span-2 flex flex-col gap-6">

            {/* Account Settings */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm" style={{ animation: "fadeUp .55s ease" }}>
              <SectionHeader title="Account Settings" subtitle="Manage your security preferences" />
              <div onClick={() => setShowSecurity(true)}
                className="group border border-gray-100 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:border-emerald-200 hover:bg-emerald-50/40 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center text-emerald-500 transition-colors">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Security</p>
                    <p className="text-sm text-gray-500">Password & account protection</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-emerald-500 font-semibold group-hover:text-emerald-600">Manage</span>
                  <ChevronRight size={16} className="text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* ── Menu Management — compact, no availability toggle ── */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm" style={{ animation: "fadeUp .6s ease" }}>
              <SectionHeader
                title="Menu Management"
                subtitle={`${foods.length} items`}
                action={
                  <button onClick={openAddFood}
                    className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm shadow-emerald-200">
                    <Plus size={16} /> Add Item
                  </button>
                }
              />

              {/* Compact table-style list */}
              <div className="divide-y divide-gray-50">
                {foods.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 gap-4 hover:bg-gray-50/50 rounded-xl px-2 -mx-2 transition-colors">
                    {/* Icon + name + meta */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                        <Utensils size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
                          {item.stock <= 8 && (
                            <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium shrink-0 leading-none">Low</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                          <Tag size={10} className="inline" />{item.category}
                          <span className="text-gray-200">·</span>
                          <DollarSign size={10} className="inline" />{item.price}
                          <span className="text-gray-200">·</span>
                          <Package size={10} className="inline" />{item.stock}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => openEditFood(item)}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold transition-colors border border-blue-100">
                        Edit
                      </button>
                      <button onClick={() => setDeletingFoodId(item.id)}
                        className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors border border-red-100">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {foods.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-8">No menu items yet. Add your first item.</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Payment History ── */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm" style={{ animation: "fadeUp .65s ease" }}>
            <SectionHeader title="Payment History" subtitle={`${payments.length} transactions`} />

            {paymentsLoading ? (
              <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
                <Loader2 size={16} className="animate-spin" /> Loading…
              </div>
            ) : (
              <div className="space-y-3">
                {payments.map((p) => (
                  <div key={p.id} className="border border-gray-100 rounded-2xl p-4 hover:border-gray-200 hover:bg-gray-50/50 transition-all">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">{p.method}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{p.date}</p>
                      </div>
                      <span className="text-base font-bold text-gray-900 shrink-0">${p.amount}</span>
                    </div>
                    <div className="mb-3"><StatusBadge status={p.status} /></div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => cycleStatus(p)}
                        className="flex-1 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold transition-colors border border-gray-100">
                        Update Status
                      </button>
                      <button onClick={() => setSelectedPayment(p)}
                        className="flex-1 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-semibold transition-colors border border-emerald-100 flex items-center justify-center gap-1.5">
                        <Eye size={13} /> Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ═══ Security Modal ═══ */}
      <Modal open={showSecurity} onClose={closeSecurity}>
        <div className="p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4"><ShieldCheck size={22} /></div>
              <h3 className="text-xl font-bold text-gray-900">Update Password</h3>
              <p className="text-sm text-gray-500 mt-1">Keep your account safe with a strong password</p>
            </div>
            <button onClick={closeSecurity} className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400"><X size={18} /></button>
          </div>
          <div className="space-y-4">
            {securityErrors._server && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                <AlertCircle size={15} className="shrink-0" />{securityErrors._server}
              </div>
            )}
            <PasswordField label="Current Password" placeholder="Enter current password"
              value={securityForm.current} onChange={(e) => { setSecurityForm({ ...securityForm, current: e.target.value }); setSecurityErrors({ ...securityErrors, current: "" }); }}
              error={securityErrors.current} />
            <PasswordField label="New Password" placeholder="Enter new password"
              value={securityForm.next} onChange={(e) => { setSecurityForm({ ...securityForm, next: e.target.value }); setSecurityErrors({ ...securityErrors, next: "" }); }}
              error={securityErrors.next} />
            <PasswordStrength password={securityForm.next} />
            <PasswordField label="Confirm New Password" placeholder="Re-enter new password"
              value={securityForm.confirm} onChange={(e) => { setSecurityForm({ ...securityForm, confirm: e.target.value }); setSecurityErrors({ ...securityErrors, confirm: "" }); }}
              error={securityErrors.confirm} />
          </div>
          <div className="flex items-center gap-3 mt-8">
            <button onClick={closeSecurity} className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={savePassword} disabled={passwordSaving}
              className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm shadow-emerald-200">
              {passwordSaving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><ShieldCheck size={16} /> Save Password</>}
            </button>
          </div>
        </div>
      </Modal>

      {/* ═══ Food Modal ═══ */}
      <Modal open={showFoodModal} onClose={() => setShowFoodModal(false)}>
        <div className="p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4"><Utensils size={22} /></div>
              <h3 className="text-xl font-bold text-gray-900">{editingFood ? "Edit Menu Item" : "Add Menu Item"}</h3>
              <p className="text-sm text-gray-500 mt-1">{editingFood ? `Editing "${editingFood.name}"` : "Add a new dish to your menu"}</p>
            </div>
            <button onClick={() => setShowFoodModal(false)} className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400"><X size={18} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Dish Name" placeholder="e.g. Spicy Ramen" value={foodForm.name}
              onChange={(e) => { setFoodForm({ ...foodForm, name: e.target.value }); setFoodErrors({ ...foodErrors, name: "" }); }}
              error={foodErrors.name} className="sm:col-span-2" />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</label>
              <select value={foodForm.category}
                onChange={(e) => { setFoodForm({ ...foodForm, category: e.target.value }); setFoodErrors({ ...foodErrors, category: "" }); }}
                className={`w-full border rounded-2xl py-3 px-4 text-sm text-gray-800 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all ${foodErrors.category ? "border-red-300" : "border-gray-200"}`}>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {foodErrors.category && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{foodErrors.category}</p>}
            </div>
            <Field label="Price (USD)" placeholder="0.00" type="number" min="0" step="0.01" value={foodForm.price}
              onChange={(e) => { setFoodForm({ ...foodForm, price: e.target.value }); setFoodErrors({ ...foodErrors, price: "" }); }}
              error={foodErrors.price} />
            <Field label="Stock Quantity" placeholder="Units in stock" type="number" min="0" value={foodForm.stock}
              onChange={(e) => { setFoodForm({ ...foodForm, stock: e.target.value }); setFoodErrors({ ...foodErrors, stock: "" }); }}
              error={foodErrors.stock} className="sm:col-span-2" />
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={() => setShowFoodModal(false)} className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={saveFood} disabled={foodSaving}
              className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm shadow-emerald-200">
              {foodSaving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><Check size={16} /> {editingFood ? "Save Changes" : "Add to Menu"}</>}
            </button>
          </div>
        </div>
      </Modal>

      {/* ═══ Delete Confirm ═══ */}
      <Modal open={!!deletingFoodId} onClose={() => setDeletingFoodId(null)} maxWidth="max-w-sm">
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center text-red-500 mx-auto mb-5"><Trash2 size={26} /></div>
          <h3 className="text-xl font-bold text-gray-900">Remove Item?</h3>
          <p className="text-sm text-gray-500 mt-2 mb-8">
            <strong className="text-gray-700">"{foods.find((f) => f.id === deletingFoodId)?.name}"</strong> will be permanently removed from your menu.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setDeletingFoodId(null)} className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">Keep Item</button>
            <button onClick={() => handleDeleteFood(deletingFoodId)} className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">Remove</button>
          </div>
        </div>
      </Modal>

      {/* ═══ Payment Details Modal ═══ */}
      <Modal open={!!selectedPayment} onClose={() => setSelectedPayment(null)} maxWidth="max-w-md">
        {selectedPayment && (
          <div className="p-8">
            <div className="flex items-start justify-between mb-7">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4"><CreditCard size={22} /></div>
                <h3 className="text-xl font-bold text-gray-900">Transaction Details</h3>
                <p className="text-xs text-gray-400 mt-0.5 font-mono">{selectedPayment.id}</p>
              </div>
              <button onClick={() => setSelectedPayment(null)} className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400"><X size={18} /></button>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 rounded-2xl p-5 mb-6 flex items-center justify-between border border-emerald-200/60">
              <div>
                <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mb-1">Total Amount</p>
                <p className="text-4xl font-bold text-gray-900">${selectedPayment.amount}</p>
              </div>
              <StatusBadge status={selectedPayment.status} />
            </div>
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              {[
                { icon: Hash,       label: "Transaction ID",  value: selectedPayment.id },
                { icon: User,       label: "Customer",        value: selectedPayment.customer },
                { icon: CreditCard, label: "Payment Method",  value: selectedPayment.method },
                { icon: FileText,   label: "Order Reference", value: selectedPayment.orderRef },
                { icon: Clock,      label: "Date",            value: selectedPayment.date },
                { icon: Activity,   label: "Notes",           value: selectedPayment.notes },
              ].map((row, i) => (
                <div key={row.label} className={`flex items-start gap-4 px-5 py-4 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}`}>
                  <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 mt-0.5"><row.icon size={14} /></div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{row.label}</p>
                    <p className="text-sm font-medium text-gray-800 mt-0.5 break-words">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setSelectedPayment(null)}
              className="w-full mt-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors">
              Close
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}