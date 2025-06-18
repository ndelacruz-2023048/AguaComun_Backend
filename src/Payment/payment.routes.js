import { Router } from "express"
import {
    savePayment,
    getPayments,
    confirmPayment
} from "./payment.controller.js"
import { validateTokenJWT } from "../../middlewares/validate.jwt.js"

const api = Router()

api.post('/payment', validateTokenJWT, savePayment)
api.get('/payment', getPayments)
api.put('/confirm/:id', confirmPayment)

export default api