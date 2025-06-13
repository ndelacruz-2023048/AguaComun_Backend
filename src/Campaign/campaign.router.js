import {Router} from 'express'

import { 
    createCampaign,
    getAllCampaigns,
    getCampaignById,
    deleteCampaign,
    updateCampaign,
    updateCampaignStatus
    } from './campaign.controller.js'

    const app = Router()

    app.post('/', createCampaign)
    app.get('/', getAllCampaigns)
    app.get('/:id', getCampaignById)
    app.put('/:id', updateCampaign)
    app.delete('/:id', deleteCampaign)
    app.put('/:id/status', updateCampaignStatus)

    export default app