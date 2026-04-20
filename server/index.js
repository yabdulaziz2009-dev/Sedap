import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

const analytics = {
  totalOrders: 257000,
  activeUsers: 14850,
  revenue: 872560,
  bestSelling: 'Medium Spicy Spaghetti Italiano',
  dailyAverage: 1245,
}

const foods = [
  { id: 1, name: 'Medium Spicy Spaghetti Italiano', category: 'Pasta', price: 12.56 },
  { id: 2, name: 'Pizza Meal for Kids (Small size)', category: 'Pizza', price: 5.67 },
  { id: 3, name: 'Supreme Pizza with Beef Topping', category: 'Pizza', price: 11.21 },
  { id: 4, name: 'Margarita Pizza with Random Topping', category: 'Pizza', price: 8.15 },
  { id: 5, name: 'Tuna Soup Spinach with Himalayan Salt', category: 'Soup', price: 7.25 },
]

const orders = [
  { id: 101, customer: 'Samantha', total: 42.5, status: 'Delivered' },
  { id: 102, customer: 'Daniel', total: 28.0, status: 'Preparing' },
  { id: 103, customer: 'Amina', total: 55.75, status: 'Completed' },
]

const customers = [
  { id: 1, name: 'Samantha', visits: 12, favorite: 'Spaghetti' },
  { id: 2, name: 'Daniel', visits: 8, favorite: 'Pizza' },
  { id: 3, name: 'Amina', visits: 15, favorite: 'Burger' },
]

app.get('/api/analytics', (req, res) => {
  res.json(analytics)
})

app.get('/api/foods', (req, res) => {
  res.json(foods)
})

app.get('/api/orders', (req, res) => {
  res.json(orders)
})

app.get('/api/customers', (req, res) => {
  res.json(customers)
})

app.get('/api/dashboard', (req, res) => {
  res.json({ analytics, foods, orders, customers })
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
