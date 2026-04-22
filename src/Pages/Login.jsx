import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaArrowRight, FaEnvelope, FaEye, FaFacebookF, FaLock } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { HiMiniBolt, HiMiniShieldCheck, HiSparkles } from 'react-icons/hi2'
import { loginUser, signInWithGoogle } from '../auth'

const perks = [
  {
    icon: HiMiniShieldCheck,
    title: 'Himoyalangan kirish',
    text: 'Hisobingiz uchun xavfsiz va barqaror sessiya nazorati.',
  },
  {
    icon: HiMiniBolt,
    title: 'Tez ish jarayoni',
    text: 'Bir necha soniyada tizimga kirib, boshqaruvni davom ettiring.',
  },
]

const fieldClassName =
  'flex h-[60px] items-center gap-3 rounded-[20px] border border-[#d8dee8] bg-white px-4 text-[#7b8491] shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition focus-within:border-[#2096f3] focus-within:shadow-[0_0_0_4px_rgba(32,150,243,0.14)] sm:h-16 sm:px-5'
const inputClassName =
  'h-full w-full bg-transparent text-[16px] text-[#1f2937] outline-none placeholder:text-[#9aa3af] sm:text-[17px]'
const iconButtonClassName = 'text-[#7b8491] transition hover:text-[#4d5561]'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const routeState = location.state || {}

  const [formData, setFormData] = useState({
    login: routeState.email || '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
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

    if (!formData.login.trim() || !formData.password.trim()) {
      setError('Login va parolni kiriting.')
      return
    }

    try {
      setIsSubmitting(true)

      await loginUser({
        login: formData.login,
        password: formData.password,
      })

      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
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
    } catch (err) {
      setError(err.message)
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

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-lg backdrop-blur-sm">
                  <HiSparkles />
                </span>
                <p className="sedap-display text-xl font-semibold">Kinetic Atelier</p>
              </div>
              <h1 className="sedap-display mt-10 max-w-[400px] text-[40px] leading-[1] font-semibold tracking-[-0.06em] sm:text-[56px]">
                Boshqaruv paneliga silliq qayting
              </h1>
              <p className="mt-6 max-w-[360px] text-[16px] leading-7 text-[#9cb9d5] sm:text-[18px]">
                Loyihalaringiz, foydalanuvchilar oqimi va asosiy ko&apos;rsatkichlaringiz sizni kutmoqda.
              </p>
            </div>

            <div className="relative z-10 mt-10 grid gap-4">
              {perks.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 rounded-[24px] border border-white/10 bg-white/8 px-5 py-5 backdrop-blur-sm"
                >
                  <span className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12 text-lg text-[#d7e8f7]">
                    <Icon />
                  </span>
                  <div>
                    <p className="text-lg font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-[#afc8df]">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <section className="flex flex-1 bg-[#fcfbfa] px-6 py-8 sm:px-10 sm:py-10 lg:max-w-[52%] lg:px-14 lg:py-12">
            <div className="mx-auto flex h-full w-full max-w-[540px] flex-col justify-center">
              <header>
                <h2 className="sedap-display text-[30px] font-semibold tracking-[-0.03em] text-[#1f2937] sm:text-[34px]">
                  Tizimga kirish
                </h2>
                <p className="mt-2 text-[16px] text-[#737b87] sm:text-[17px]">
                  Login va parolingizni kiriting.
                </p>
              </header>

              <form
                onSubmit={handleSubmit}
                className="mt-9 space-y-5 rounded-[28px] border border-[#ece5df] bg-[linear-gradient(180deg,#ffffff_0%,#fffaf6_100%)] p-5 shadow-[0_18px_48px_rgba(15,23,42,0.06)] sm:mt-10 sm:space-y-6 sm:p-7"
              >
                {routeState.message ? (
                  <div className="rounded-[20px] border border-[#bfdbfe] bg-[#eff6ff] px-4 py-3 text-sm text-[#1d4ed8]">
                    {routeState.message}
                  </div>
                ) : null}

                {error ? (
                  <div className="rounded-[20px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
                    {error}
                  </div>
                ) : null}

                <div>
                  <label
                    htmlFor="login"
                    className="mb-2.5 block text-[14px] font-bold tracking-[0.08em] text-[#4b5563] uppercase"
                  >
                    Login yoki email
                  </label>
                  <div className={fieldClassName}>
                    <FaEnvelope className="text-sm" />
                    <input
                      id="login"
                      type="text"
                      name="login"
                      value={formData.login}
                      onChange={handleChange}
                      placeholder="misol@gmail.com"
                      autoComplete="username"
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div>
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
                      autoComplete="current-password"
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-[60px] w-full items-center justify-center gap-3 rounded-[20px] bg-[linear-gradient(90deg,#0e7fda_0%,#33a3ff_100%)] text-[17px] font-semibold text-white shadow-[0_16px_32px_rgba(32,150,243,0.28)] transition hover:translate-y-[-1px] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 sm:h-16 sm:text-[18px]"
                >
                  {isSubmitting ? 'Kirilmoqda...' : 'Kirish'}
                  <FaArrowRight className="text-sm" />
                </button>
              </form>

              <footer className="mt-10 border-t border-[#ece5df] pt-9">
                <p className="text-center text-[16px] text-[#6f7681] sm:text-[17px]">
                  Hisobingiz yo&apos;qmi?{' '}
                  <Link to="/register" className="font-semibold text-[#0d6fbd] transition hover:text-[#0a5797]">
                    Ro&apos;yxatdan o&apos;tish
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
                  >
                    <FcGoogle className="text-[21px]" />
                    {isGoogleSubmitting ? 'Kutilmoqda...' : 'Google'}
                  </button>
                  <button
                    type="button"
                    className="flex h-14 flex-1 items-center justify-center gap-3 rounded-[18px] bg-[#f7f2ee] text-[16px] font-medium text-[#374151] transition hover:bg-[#f1eae5] sm:h-[60px] sm:text-[17px]"
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

export default Login
