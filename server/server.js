import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import router from './router/authRoutes.js'
import userRouter from './router/userRoute.js'

const app = express()

const allowedOrigins = ['http://localhost:5173' ,  "https://farmer-consumer-digital-supply.vercel.app"]

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))

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