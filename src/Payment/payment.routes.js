import { Router } from "express"
import {
    savePayment,
    getPayments,
    confirmPayment
} from "./payment.controller.js"

const api = Router()

api.post('/payment', savePayment)
api.get('/payment', getPayments)
api.put('/confirm/:id', confirmPayment)

export default api