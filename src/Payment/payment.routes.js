import { Router } from "express"
import {
    savePayment,
    getPayments
} from "./payment.controller.js"

const api = Router()

api.post('/payment', savePayment)
api.get('/payment', getPayments)

export default api