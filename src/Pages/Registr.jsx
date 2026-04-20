import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowRight, FaEnvelope, FaEye, FaFacebookF, FaLock, FaUser } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { registerUser, signInWithGoogle } from '../auth'

const members = ['A', 'M', 'S']
const highlights = [
  { value: '24/7', label: "Doimiy qo'llab-quvvatlash" },
  { value: '98%', label: 'Mamnun foydalanuvchilar' },
  { value: '+2400', label: 'Faol hamjamiyat' },
]

const fieldClassName =
  'flex h-[60px] items-center gap-3 rounded-[20px] border border-[#d8dee8] bg-white px-4 text-[#7b8491] shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition focus-within:border-[#2096f3] focus-within:shadow-[0_0_0_4px_rgba(32,150,243,0.14)] sm:h-16 sm:px-5'
const inputClassName =
  'h-full w-full bg-transparent text-[16px] text-[#1f2937] outline-none placeholder:text-[#9aa3af] sm:text-[17px]'
const iconButtonClassName = 'text-[#7b8491] transition hover:text-[#4d5561]'

const Registr = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError("Barcha maydonlarni to'ldiring.")
      return
    }

    if (formData.password.length < 4) {
      setError("Parol kamida 4 ta belgidan iborat bo'lishi kerak.")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Parollar bir xil emas.')
      return
    }
                          
    try {
      setIsSubmitting(true)
      await registerUser(formData)
      navigate('/login', {
        replace: true,
        state: {
          email: formData.email.trim().toLowerCase(),
          message: 'Hisob muvaffaqiyatli yaratildi. Endi tizimga kiring.',
        },
      })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')

    try {
      setIsGoogleSubmitting(true)
      await signInWithGoogle()
      navigate('/', { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsGoogleSubmitting(false)
    }
  }

  return (
    <main className="sedap-shell px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1560px] items-center justify-center">
        <div className="relative flex w-full max-w-[1460px] flex-col overflow-hidden rounded-[30px] bg-white shadow-[0_28px_80px_rgba(18,24,39,0.14)] lg:min-h-[690px] lg:flex-row">
          <article className="relative flex min-h-[360px] flex-1 flex-col justify-between overflow-hidden bg-[linear-gradient(160deg,#0a3258_0%,#0c4a7f_52%,#082743_100%)] px-7 py-8 text-white sm:px-10 sm:py-10 lg:min-h-[690px] lg:max-w-[48%] lg:px-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(91,181,255,0.34),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_30%)]" />

            <div className="relative z-10 max-w-[430px]">
              <p className="sedap-display text-[22px] font-semibold tracking-[-0.04em] text-[#8dbcf0] sm:text-[24px]">
                Kinetic Atelier
              </p>
              <h1 className="sedap-display mt-8 max-w-[390px] text-[42px] leading-[0.95] font-semibold tracking-[-0.06em] sm:text-[56px]">
                Raqamli innovatsiyalar olamiga kiring
              </h1>
              <p className="mt-6 max-w-[330px] text-[16px] leading-7 text-[#82a7cb] sm:text-[18px]">
                Biz bilan birga o&apos;z g&apos;oyalaringizni yuqori texnologiyali yechimlarga aylantiring.
              </p>
            </div>

            <div className="relative z-10 mt-8 grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4 backdrop-blur-sm"
                >
                  <p className="sedap-display text-[24px] font-semibold text-white">{item.value}</p>
                  <p className="mt-1 text-sm leading-6 text-[#afc8df]">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="relative z-10 mt-10 flex items-center gap-3">
              <div className="flex -space-x-2">
                {members.map((member, index) => (
                  <span
                    key={member}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0c3b66] text-xs font-semibold text-white shadow-md ${
                      index === 0 ? 'bg-[#161f2e]' : index === 1 ? 'bg-[#3e5874]' : 'bg-[#23354d]'
                    }`}
                  >
                    {member}
                  </span>
                ))}
              </div>
              <p className="text-sm text-[#9ab8d6] sm:text-[15px]">
                +2,400 kishi allaqachon bizga qo&apos;shilgan
              </p>
            </div>

            <div className="pointer-events-none absolute inset-y-0 right-[-86px] hidden w-[58%] lg:block">
              <div className="absolute top-[86px] h-[116px] w-[360px] rotate-[7deg] rounded-[26px] bg-[#1f67a6]" />
              <div className="absolute top-[222px] right-[6px] h-[192px] w-[368px] rotate-[7deg] rounded-[28px] bg-[#3e738f]" />
              <div className="absolute top-[450px] right-[-16px] h-[126px] w-[378px] rotate-[7deg] rounded-[28px] bg-[#116993]" />
            </div>
          </article>

          <section
            aria-labelledby="register-heading"
            className="flex flex-1 bg-[#fcfbfa] px-6 py-8 sm:px-10 sm:py-10 lg:max-w-[52%] lg:px-14 lg:py-12"
          >
            <div className="mx-auto flex h-full w-full max-w-[540px] flex-col justify-center">
              <header>
                <h2
                  id="register-heading"
                  className="sedap-display text-[30px] font-semibold tracking-[-0.03em] text-[#1f2937] sm:text-[34px]"
                >
                  Yangi hisob yaratish
                </h2>
                <p className="mt-2 text-[16px] text-[#737b87] sm:text-[17px]">
                  Bizga qo&apos;shiling va imkoniyatlardan foydalaning.
                </p>
              </header>

              <form
                className="mt-9 space-y-5 rounded-[28px] border border-[#ece5df] bg-[linear-gradient(180deg,#ffffff_0%,#fffaf6_100%)] p-5 shadow-[0_18px_48px_rgba(15,23,42,0.06)] sm:mt-10 sm:space-y-6 sm:p-7"
                aria-label="Registratsiya formasi"
                onSubmit={handleSubmit}
              >
                {error ? (
                  <div className="rounded-[20px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
                    {error}
                  </div>
                ) : null}

                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2.5 block text-[14px] font-bold tracking-[0.08em] text-[#4b5563] uppercase"
                  >
                    Ism-sharif
                  </label>
                  <div className={fieldClassName}>
                    <FaUser className="text-sm" />
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Aziz Rahimov"
                      autoComplete="name"
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2.5 block text-[14px] font-bold tracking-[0.08em] text-[#4b5563] uppercase"
                  >
                    Elektron pochta
                  </label>
                  <div className={fieldClassName}>
                    <FaEnvelope className="text-sm" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="misol@gmail.com"
                      autoComplete="email"
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
                  <div className="flex-1">
                    <label 
                      htmlFor="password"
                      className="mb-2.5 block text-[14px] font-bold tracking-[0.08em] text-[#4b5563] uppercase"
                    >
                      Parol
                    </label>
                    <div className={fieldClassName}>
                      <FaLock className="text-sm" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="********"
                        autoComplete="new-password"
                        className={inputClassName}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label="Parolni ko'rsatish"
                        className={iconButtonClassName}
                      >
                        <FaEye className="text-sm" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2.5 block text-[14px] font-bold tracking-[0.08em] text-[#4b5563] uppercase"
                    >
                      Tasdiqlash
                    </label>
                    <div className={fieldClassName}>
                      <FaLock className="text-sm" />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="********"
                        autoComplete="new-password"
                        className={inputClassName}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label="Tasdiqlash parolini ko'rsatish"
                        className={iconButtonClassName}
                      >
                        <FaEye className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-[60px] w-full items-center justify-center gap-3 rounded-[20px] bg-[linear-gradient(90deg,#0e7fda_0%,#33a3ff_100%)] text-[17px] font-semibold text-white shadow-[0_16px_32px_rgba(32,150,243,0.28)] transition hover:translate-y-[-1px] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 sm:h-16 sm:text-[18px]"
                >
                  {isSubmitting ? 'Yaratilmoqda...' : "Ro'yxatdan o'tish"}
                  <FaArrowRight className="text-sm" />
                </button>
              </form>

              <footer className="mt-10 border-t border-[#ece5df] pt-9">
                <p className="text-center text-[16px] text-[#6f7681] sm:text-[17px]">
                  Hisobingiz bormi?{' '}
                  <Link to="/login" className="font-semibold text-[#0d6fbd] transition hover:text-[#0a5797]">
                    Tizimga kirish
                  </Link>
                </p>

                <div className="mt-7 flex items-center gap-4 text-[#b8afa9]">
                  <span className="h-px flex-1 bg-[#e8dfd8]" />
                  <span className="text-[12px] font-semibold tracking-[0.16em] uppercase sm:text-[13px]">
                    Yoki davom eting
                  </span>
                  <span className="h-px flex-1 bg-[#e8dfd8]" />
                </div>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleSubmitting}
                    className="flex h-14 flex-1 items-center justify-center gap-3 rounded-[18px] bg-[#f7f2ee] text-[16px] font-medium text-[#374151] transition hover:bg-[#f1eae5] sm:h-[60px] sm:text-[17px]"
                    aria-label="Google orqali davom etish"
                  >
                    <FcGoogle className="text-[21px]" />
                    {isGoogleSubmitting ? 'Kutilmoqda...' : 'Google'}
                  </button>
                  <button
                    type="button"
                    className="flex h-14 flex-1 items-center justify-center gap-3 rounded-[18px] bg-[#f7f2ee] text-[16px] font-medium text-[#374151] transition hover:bg-[#f1eae5] sm:h-[60px] sm:text-[17px]"
                    aria-label="Facebook orqali davom etish"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#1877f2] text-[#1877f2]">
                      <FaFacebookF className="text-[11px]" />
                    </span>
                    Facebook
                  </button>
                </div>
              </footer>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

export default Registr
