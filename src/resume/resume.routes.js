import { Router } from 'express'
import { getResume } from './resume.controller.js'

const resume = Router()

resume.get('/list/:id', getResume)

export default resume