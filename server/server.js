import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import router from './router/authRoutes.js'
import userRouter from './router/userRoute.js'

const app = express()

const allowedOrigins = [
    'http://localhost:5173',
    'https://farmer-consumer-digital-supply.vercel.app'
]

// ── CORS middleware ──
app.use((req, res, next) => {
    const origin = req.headers.origin
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin)
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Cookie')

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204)
    }
    next()
})

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', router)
app.use('/api/user', userRouter)

app.get('/', (req, res) => {
    res.send('MaMholi Backend Running 🌾')
})

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected ✅'))
    .catch((err) => console.log('MongoDB Error ❌', err))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`)
})