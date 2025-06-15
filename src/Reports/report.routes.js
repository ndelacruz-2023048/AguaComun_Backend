import { Router } from "express"
import { createReport, deleteReport, getAllReports, getReportById, updateReport } from './report.controller.js'
import { createdReport, updatedReport } from '../../middlewares/validators.js'
import { isAdmin, validateTokenJWT } from "../../middlewares/validate.jwt.js"

const api = Router()

api.post(
    '/new',
    [
        createdReport,
        validateTokenJWT
    ],
    createReport
)

api.get(
    '/list',
    getAllReports
)

api.get(
    '/list/:id',
    [
        validateTokenJWT,
    ],
    getReportById
)

api.put(
    '/updated/:id',
    [
        validateTokenJWT,
        updatedReport
    ],
    updateReport
)

api.delete(
    '/delete/:id',
    [
        validateTokenJWT,
        isAdmin
    ],
    deleteReport
)

export default api