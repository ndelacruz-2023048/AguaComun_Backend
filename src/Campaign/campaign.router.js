import {Router} from 'express'
import { FormCampaign } from '../../middlewares/validators.js'
import { 
    createCampaign,
    getAllCampaigns,
    getCampaignById,
    deleteCampaign,
    updateCampaign,
    updateCampaignStatus
    } from './campaign.controller.js'

    const app = Router()

    app.post('/', [FormCampaign], createCampaign)
    app.get('/', getAllCampaigns)
    app.get('/:id', getCampaignById)
    app.put('/:id', [FormCampaign], updateCampaign)
    app.delete('/:id', deleteCampaign)
    app.put('/:id/status', updateCampaignStatus)

    export default app