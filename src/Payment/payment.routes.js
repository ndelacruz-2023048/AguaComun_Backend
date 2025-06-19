import { Router } from "express"
import {
    savePayment,
    getPayments,
    confirmPayment,
    getRecentPaymentsByCampaign
} from "./payment.controller.js"
import { createPayment } from "../../middlewares/validators.js"
import { validateTokenJWT } from "../../middlewares/validate.jwt.js"

const api = Router()

api.post('/payment', validateTokenJWT, createPayment, savePayment)
api.get('/payment', getPayments)
api.put('/confirm/:id', confirmPayment)
api.get('/recent/:campaignId', getRecentPaymentsByCampaign)

export default api