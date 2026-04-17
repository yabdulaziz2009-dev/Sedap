import React from 'react'
import { useNavigate } from 'react-router-dom'
import { HiMiniArrowTrendingUp, HiMiniClock, HiMiniUserGroup } from 'react-icons/hi2'

const stats = [
  {
    title: 'Faol sessiya',
    value: 'Online',
    note: 'Tizimga kirish muvaffaqiyatli bajarildi',
    icon: HiMiniClock,
    accent: 'text-[#16a34a]',
  },
  {
    title: 'Jamoa holati',
    value: 'Barqaror',
    note: 'Asosiy servislar tayyor holatda',
    icon: HiMiniUserGroup,
    accent: 'text-[#0d6fbd]',
  },
  {
    title: 'Faollik',
    value: '+18%',
    note: "Oxirgi haftaga nisbatan o'sish",
    icon: HiMiniArrowTrendingUp,
    accent: 'text-[#ea580c]',
  },
]

const Dashboard = ({ session, onLogout }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/login', {
      replace: true,
      state: { message: 'Siz tizimdan muvaffaqiyatli chiqdingiz.' },
    })
  }

  return (
    <main className="sedap-shell px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1200px] items-center justify-center">
        <div className="w-full overflow-hidden rounded-[32px] bg-white shadow-[0_28px_80px_rgba(18,24,39,0.14)]">
          <div className="relative overflow-hidden bg-[linear-gradient(135deg,#082743_0%,#0c3b66_55%,#0f588f_100%)] px-8 py-10 text-white sm:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(91,181,255,0.36),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_28%)]" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8dc3f4]">
                  Sedap Dashboard
                </p>
                <h1 className="sedap-display mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                  Xush kelibsiz, {session?.fullName || 'Foydalanuvchi'}
                </h1>
                <p className="mt-3 max-w-[580px] text-[16px] leading-7 text-[#c4d8eb]">
                  Siz tizimga muvaffaqiyatli kirdingiz. Bu sahifa endi ancha toza, zamonaviy va asosiy
                  ma&apos;lumotlarni tez ko&apos;rishga qulay ko&apos;rinishda tayyorlandi.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/16"
              >
                Chiqish
              </button>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <div className="grid gap-5 md:grid-cols-3">
              <div className="rounded-[24px] border border-[#e9e2dc] bg-[linear-gradient(180deg,#fffaf6_0%,#f8f1ea_100%)] p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
                  Ism-sharif
                </p>
                <p className="mt-3 text-lg font-semibold text-[#1f2937]">{session?.fullName}</p>
              </div>
              <div className="rounded-[24px] border border-[#e9e2dc] bg-[linear-gradient(180deg,#fffaf6_0%,#f8f1ea_100%)] p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
                  Login
                </p>
                <p className="mt-3 text-lg font-semibold text-[#1f2937]">{session?.login}</p>
              </div>
              <div className="rounded-[24px] border border-[#e9e2dc] bg-[linear-gradient(180deg,#fffaf6_0%,#f8f1ea_100%)] p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
                  Rol
                </p>
                <p className="mt-3 text-lg font-semibold text-[#1f2937]">{session?.role || 'User'}</p>
              </div>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {stats.map(({ title, value, note, icon: Icon, accent }) => (
                <div
                  key={title}
                  className="rounded-[26px] border border-[#edf0f4] bg-white p-6 shadow-[0_14px_38px_rgba(15,23,42,0.05)]"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7b8491]">
                      {title}
                    </p>
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eff6ff] text-[#0d6fbd]">
                      <Icon className="text-xl" />
                    </span>
                  </div>
                  <p className={`sedap-display mt-5 text-3xl font-semibold ${accent}`}>{value}</p>
                  <p className="mt-2 text-sm leading-6 text-[#6b7280]">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Dashboard
