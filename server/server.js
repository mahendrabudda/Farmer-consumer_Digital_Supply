import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import router from './router/authRoutes.js'
import userRouter from './router/userRoute.js'
import farmerRouter from './router/farmerRoutes.js'

const app = express()

app.use(cors({
    origin: true,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', router)
app.use('/api/user', userRouter)
app.use('/api/farmer', farmerRouter)

app.get('/', (req, res) => {
    res.send('MaMholi Backend Running 🌾')
})

mongoose
.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB Connected ✅'))
.catch(err => console.log('MongoDB Error ❌', err))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`)
})