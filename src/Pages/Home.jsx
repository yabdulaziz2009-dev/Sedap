import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFoods } from '../store/slices/Food'
import pizzaImage from '../assets/pizza.svg'
import lagmonImage from '../assets/lagmon.svg'

const mockAnalytics = {
  revenue: 84320,
  bestSelling: 'Lagmon',
  dailyAverage: '1,245',
}

const Home = () => {
  const dispatch = useDispatch()
  const { foods, loading, error } = useSelector((state) => state.food)

  useEffect(() => {
    if (foods.length === 0) {
      dispatch(fetchFoods())
    }
  }, [dispatch, foods.length])

  const analytics = mockAnalytics

  if (loading) {
    return <div className="text-slate-700 dark:text-slate-300">Yuklanmoqda...</div>
  }

  if (error) {
    return <div className="text-red-600">{error}</div>
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">

        {/* Analytics card */}
        <div className="rounded-[2rem] bg-white p-6 shadow-sm shadow-slate-200 dark:bg-slate-800 dark:shadow-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Analytics</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Here is your restaurant summary with graph view</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
              Monthly
            </div>
          </div>

          <div className="mt-6 rounded-[2rem] bg-slate-950 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Chart Orders</p>
                <p className="mt-2 text-3xl font-semibold">257k</p>
                <p className="mt-1 text-sm text-slate-400">Average 1,245 orders per day</p>
              </div>
              <div className="rounded-3xl bg-slate-800 px-4 py-2 text-sm">Daily</div>
            </div>
            <div className="mt-6 rounded-[2rem] bg-slate-900 p-4">
              <svg viewBox="0 0 360 180" className="w-full">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
                <path d="M34 150 L34 30 L338 30" stroke="#334155" strokeWidth="2" />
                <path d="M34 150 L338 150" stroke="#334155" strokeWidth="2" />
                <path d="M34 118 C80 110 120 100 160 88 C200 76 260 84 298 60" fill="none" stroke="url(#chartGradient)" strokeWidth="5" strokeLinecap="round" />
                <circle cx="34" cy="150" r="4" fill="#0ea5e9" />
                <circle cx="80" cy="110" r="6" fill="#0ea5e9" />
                <circle cx="120" cy="100" r="6" fill="#0ea5e9" />
                <circle cx="160" cy="88" r="6" fill="#0ea5e9" />
                <circle cx="200" cy="76" r="6" fill="#0ea5e9" />
                <circle cx="260" cy="84" r="6" fill="#0ea5e9" />
                <circle cx="298" cy="60" r="6" fill="#0ea5e9" />
                <text x="32" y="170" className="fill-slate-400 text-xs">Jan</text>
                <text x="76" y="170" className="fill-slate-400 text-xs">Feb</text>
                <text x="116" y="170" className="fill-slate-400 text-xs">Mar</text>
                <text x="156" y="170" className="fill-slate-400 text-xs">Apr</text>
                <text x="196" y="170" className="fill-slate-400 text-xs">May</text>
                <text x="252" y="170" className="fill-slate-400 text-xs">Jun</text>
                <text x="294" y="170" className="fill-slate-400 text-xs">Jul</text>
                <text x="10" y="40" className="fill-slate-500 text-xs">800</text>
                <text x="10" y="80" className="fill-slate-500 text-xs">600</text>
                <text x="10" y="120" className="fill-slate-500 text-xs">400</text>
                <text x="10" y="160" className="fill-slate-500 text-xs">200</text>
              </svg>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Orders', value: '257k' },
              { label: 'Revenue', value: `$${analytics.revenue.toLocaleString()}` },
              { label: 'Best Selling', value: analytics.bestSelling },
              { label: 'Daily Average', value: analytics.dailyAverage },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Most Selling Items */}
          <div className="rounded-[2rem] bg-white p-6 shadow-sm shadow-slate-200 dark:bg-slate-800 dark:shadow-slate-900">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Most Selling Items</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Learn top food items and conversions</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                Daily
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {foods.slice(0, 4).map((food) => (
                <div key={food.id} className="flex items-center justify-between rounded-3xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-3xl bg-slate-100 overflow-hidden dark:bg-slate-700">
                      {food.image && (
                        <img src={food.image} alt={food.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{food.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{food.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">${food.price?.toFixed(2)}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Top selling</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue */}
          <div className="rounded-[2rem] bg-white p-6 shadow-sm shadow-slate-200 dark:bg-slate-800 dark:shadow-slate-900">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Revenue</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Overview of revenue growth</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                Monthly
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="h-44 rounded-[2rem] bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400" />
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-700">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Revenue</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">${analytics.revenue.toLocaleString()}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-700">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Order Growth</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">+18%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Most Favourite Items */}
      <section className="rounded-[2rem] bg-white p-6 shadow-sm shadow-slate-200 dark:bg-slate-800 dark:shadow-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Most Favourite Items</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Based on customer picks and ratings</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
            Weekly
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 p-4 shadow-sm dark:border-slate-700">
              <img src={pizzaImage} alt="Pizza" className="h-40 w-full rounded-3xl object-cover" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Pizza Meal for Kids</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Tomato, cheese, and spicy toppings</p>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>4.8 ★</span>
                <span>$5.67</span>
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200 p-4 shadow-sm dark:border-slate-700">
              <img src={lagmonImage} alt="Lagmon" className="h-40 w-full rounded-3xl object-cover" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Lagmon Special</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Noodle bowl with rich sauce and veggies</p>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>4.9 ★</span>
                <span>$8.75</span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-700">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Food Trend Diagram</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Pizza and lagmon interest over the week</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-600 dark:text-slate-300">
                7 Days
              </div>
            </div>
            <div className="mt-6">
              <svg viewBox="0 0 320 180" className="w-full">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
                <path d="M24 140 Q 80 110 120 120 T 200 90 T 296 56" fill="none" stroke="url(#lineGradient)" strokeWidth="5" strokeLinecap="round" />
                <circle cx="24" cy="140" r="5" fill="#38bdf8" />
                <circle cx="80" cy="110" r="6" fill="#38bdf8" />
                <circle cx="120" cy="120" r="6" fill="#38bdf8" />
                <circle cx="200" cy="90" r="6" fill="#38bdf8" />
                <circle cx="296" cy="56" r="6" fill="#38bdf8" />
                <text x="24" y="160" className="fill-slate-400 text-xs">Mon</text>
                <text x="78" y="160" className="fill-slate-400 text-xs">Tue</text>
                <text x="118" y="160" className="fill-slate-400 text-xs">Wed</text>
                <text x="198" y="160" className="fill-slate-400 text-xs">Thu</text>
                <text x="286" y="160" className="fill-slate-400 text-xs">Fri</text>
              </svg>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-4 text-sm text-slate-600 dark:bg-slate-600 dark:text-slate-300">
                <div className="font-semibold text-slate-900 dark:text-slate-100">Best Pizza</div>
                <div className="mt-2">Pizza interest up 18%</div>
              </div>
              <div className="rounded-3xl bg-white p-4 text-sm text-slate-600 dark:bg-slate-600 dark:text-slate-300">
                <div className="font-semibold text-slate-900 dark:text-slate-100">Best Lagmon</div>
                <div className="mt-2">Lagmon orders grew 22%</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
