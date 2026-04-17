import axios from 'axios'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

const API_URL = import.meta.env.VITE_API_URL

const TOKEN_KEY = 'sedap-token'
const ROLE_KEY = 'sedap-role'
const SESSION_KEY = 'sedap-session'
const DEFAULT_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTBmMjE0NTczNjA1ZjIxOGUzNzM2ZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NjQyNDMxMCwiZXhwIjoxNzc2NTEwNzEwfQ.soY4hpzji87D4EUVB4_X-l3s6bmi9Zd1lM8kZD2yD5c'

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

const dispatchAuthChange = () => {
  window.dispatchEvent(new Event('auth-change'))
}

const parseJwt = (token) => {
  try {
    const [, payload] = token.split('.')

    if (!payload) return null

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = window.atob(normalized)

    return JSON.parse(decoded)
  } catch {
    return null
  }
}

const normalizeUser = (user = {}) => ({
  id: user.id || user._id || '',
  fullName: user.fullName || user.name || user.username || 'Admin',
  email: user.email || user.login || '',
  login: user.login || user.email || '',
  role: user.role || 'user',
})

const createSession = (user) => {
  const session = {
    ...normalizeUser(user),
    loginAt: new Date().toISOString(),
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  localStorage.setItem(ROLE_KEY, session.role)
  dispatchAuthChange()

  return session
}

const createSessionFromToken = (token, fallbackUser = {}) => {
  const payload = parseJwt(token)

  if (!payload) return null

  return createSession({
    id: fallbackUser.id || fallbackUser._id || payload.id || payload.userId || '',
    fullName: fallbackUser.fullName || fallbackUser.name || (payload.role === 'admin' ? 'Admin' : 'Foydalanuvchi'),
    email: fallbackUser.email || fallbackUser.login || payload.email || '',
    login: fallbackUser.login || fallbackUser.email || payload.email || '',
    role: fallbackUser.role || payload.role || 'user',
  })
}

export const initializeAuth = () => {
  const savedToken = localStorage.getItem(TOKEN_KEY)
  const token = savedToken || DEFAULT_TOKEN

  if (!savedToken && DEFAULT_TOKEN) {
    localStorage.setItem(TOKEN_KEY, DEFAULT_TOKEN)
  }

  if (!token) return null

  const existingSession = localStorage.getItem(SESSION_KEY)

  if (existingSession) {
    try {
      return JSON.parse(existingSession)
    } catch {
      localStorage.removeItem(SESSION_KEY)
    }
  }

  return createSessionFromToken(token)
}

export const loginUser = async ({ login, password }) => {
  const identifier = login.trim().toLowerCase()

  try {
    const { data } = await api.post('/auth/login', {
      email: identifier,
      login: identifier,
      password,
    })

    const token = data?.token || data?.accessToken || data?.data?.token
    const user = data?.user || data?.data?.user || null

    if (!token) {
      throw new Error("Token topilmadi")
    }

    localStorage.setItem(TOKEN_KEY, token)
    const session = user ? createSession(user) : createSessionFromToken(token)

    if (!session) {
      throw new Error("Sessiya yaratib bo'lmadi")
    }

    return session
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Login xato')
  }
}

export const registerUser = async ({ fullName, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase()

  try {
    const { data } = await api.post('/auth/register', {
      fullName: fullName.trim(),
      email: normalizedEmail,
      login: normalizedEmail,
      password,
    })

    return data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Register xato')
  }
}

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const token = await result.user.getIdToken()

    localStorage.setItem(TOKEN_KEY, token)

    return createSession({
      id: result.user.uid,
      fullName: result.user.displayName || 'Google User',
      email: result.user.email || '',
      login: result.user.email || '',
      role: 'user',
    })
  } catch (error) {
    throw new Error(error.message || 'Google orqali kirishda xato yuz berdi')
  }
}

export const getSession = () => {
  const session = localStorage.getItem(SESSION_KEY)

  if (!session) return initializeAuth()

  try {
    return JSON.parse(session)
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return initializeAuth()
  }
}

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ROLE_KEY)
  localStorage.removeItem(SESSION_KEY)

  dispatchAuthChange()
}

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const getUserRole = () => localStorage.getItem(ROLE_KEY)

export { TOKEN_KEY, SESSION_KEY, ROLE_KEY }

export default api
