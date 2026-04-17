<<<<<<< HEAD
import React from 'react'
import Foods from './Foods'
=======
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import pizzaImage from '../assets/pizza.svg'
import lagmonImage from '../assets/lagmon.svg'
>>>>>>> b2dcf402013734536cca94a60467f63a5070e3b5

const Home = () => {
  const [analytics, setAnalytics] = useState(null)
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [analyticsRes, foodsRes] = await Promise.all([
          axios.get('http://localhost:4000/api/analytics'),
          axios.get('http://localhost:4000/api/foods'),
        ])
        setAnalytics(analyticsRes.data)
        setFoods(foodsRes.data)
      } catch (err) {
        setError('Serverga ulanishda xatolik bo‘ldi. Backendni ishga tushiring va qayta urinib ko‘ring.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) {
    return <div className="text-slate-700">Yuklanmoqda...</div>
  }

  if (error) {
    return <div className="text-red-600">{error}</div>
  }

  return (
<<<<<<< HEAD
    <div>
      <Foods />
=======
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm shadow-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Analytics</h1>
              <p className="mt-1 text-sm text-slate-500">Here is your restaurant summary with graph view</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
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
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Orders</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">257k</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Revenue</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">${analytics.revenue.toLocaleString()}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Best Selling</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{analytics.bestSelling}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Daily Average</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{analytics.dailyAverage}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm shadow-slate-200">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Most Selling Items</h2>
                <p className="mt-1 text-sm text-slate-500">Learn top food items and conversions</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                Daily
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {foods.slice(0, 4).map((food, index) => (
                <div key={food.id} className="flex items-center justify-between rounded-3xl border border-slate-200 p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-3xl bg-slate-100" />
                    <div>
                      <p className="font-semibold text-slate-900">{food.name}</p>
                      <p className="text-sm text-slate-500">{food.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900">${food.price.toFixed(2)}</p>
                    <p className="text-sm text-slate-500">Top selling</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm shadow-slate-200">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Revenue</h2>
                <p className="mt-1 text-sm text-slate-500">Overview of revenue growth</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                Monthly
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="h-44 rounded-[2rem] bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400" />
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Total Revenue</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">${analytics.revenue.toLocaleString()}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Order Growth</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">+18%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-sm shadow-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Most Favourite Items</h2>
            <p className="mt-1 text-sm text-slate-500">Based on customer picks and ratings</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
            Weekly
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 p-4 shadow-sm">
              <img src={pizzaImage} alt="Pizza" className="h-40 w-full rounded-3xl object-cover" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Pizza Meal for Kids</h3>
              <p className="mt-1 text-sm text-slate-500">Tomato, cheese, and spicy toppings</p>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                <span>4.8 ★</span>
                <span>$5.67</span>
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200 p-4 shadow-sm">
              <img src={lagmonImage} alt="Lagmon" className="h-40 w-full rounded-3xl object-cover" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Lagmon Special</h3>
              <p className="mt-1 text-sm text-slate-500">Noodle bowl with rich sauce and veggies</p>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                <span>4.9 ★</span>
                <span>$8.75</span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Food Trend Diagram</h3>
                <p className="mt-1 text-sm text-slate-500">Pizza and lagmon interest over the week</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
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
                <text x="24" y="160" className="fill-slate-500 text-xs">Mon</text>
                <text x="78" y="160" className="fill-slate-500 text-xs">Tue</text>
                <text x="118" y="160" className="fill-slate-500 text-xs">Wed</text>
                <text x="198" y="160" className="fill-slate-500 text-xs">Thu</text>
                <text x="286" y="160" className="fill-slate-500 text-xs">Fri</text>
              </svg>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-4 text-sm text-slate-600">
                <div className="font-semibold text-slate-900">Best Pizza</div>
                <div className="mt-2">Pizza interest up 18%</div>
              </div>
              <div className="rounded-3xl bg-white p-4 text-sm text-slate-600">
                <div className="font-semibold text-slate-900">Best Lagmon</div>
                <div className="mt-2">Lagmon orders grew 22%</div>
              </div>
            </div>
          </div>
        </div>
      </section>
>>>>>>> b2dcf402013734536cca94a60467f63a5070e3b5
    </div>
  )
}

export default Home
