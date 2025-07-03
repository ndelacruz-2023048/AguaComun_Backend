import Report from "./report.model.js"
import User from '../User/user.model.js'
import { broadcastResumeUpdate } from "../Sockets/SocketResume.js"

export const createReport = async (req, res) => {
    const data = req.body 
    try {
        const user = await User.findOne(
            {
                _id: req.user.uid
            }
        )
        console.log('user: ', req.user.uid) 
        
        if (!user) return res.status(404).send(
            {
                success: false,
                message: "User not found"
            }
        )
        data.reportedBy = req.user.uid
        const newReport = new Report(data)
        await newReport.save()




        
        await broadcastResumeUpdate()

        return res.status(201).send(
            {
                success: true,
                message: 'Report created successfully'
            }
        )
    } catch (error) {
        console.error(error) 
        return res.status(500).send(
            {
                success: false,
                message: 'General error when add report for system'
            }
        )
    }
}

export const getAllReports = async(req, res)=> {
    try {
        const reports = await Report.find()
            .populate(
                [
                    {
                        path: 'reportedBy',
                        select: 'name surname -_id'
                    },
                    {
                        path: 'community',
                        select: 'name -_id'
                    }
                ]
            ).sort({createdAt: -1})

        if(!reports) return res.status(404).send(
            {
                success: false,
                message: 'No reports found'
            }
        )
        
        return res.status(200).send(
            {
                success: true,
                message: 'Reports retrieved successfully',
                reports
            }
        )
    } catch (error) {
        console.error(error) 
        return res.status(500).send(
            {
                success: false,
                message: 'Error retrieving reports'
            }
        )
    }
}

export const getReportById = async(req, res)=> {
    const { id } = req.params 
    try {
        const report = await Report.findById(id)
            .populate(
                [
                    {
                        path: 'reportedBy',
                        select: 'name surname -_id'
                    },
                    {
                        path: 'community',
                        select: 'name -_id'
                    }
                ]
            )

        if(!report) return res.status(404).send(
            {
                success: false,
                message: 'Report not found'
            }
        )

        return res.status(200).send(
            {
                success: true,
                message: 'Report retrieved successfully',
                report
            }
        )
    } catch (error) {
        console.error(error) 
        return res.status(500).send(
            {
                success: false,
                message: 'Error retrieving report'
            }
        )
    }
}

export const updateReport = async(req, res)=> {
    const { id } = req.params 
    const data = req.body 
    try {
        const report = await Report.findByIdAndUpdate(id, data, { new: true })
        if(report.reportedBy.toString() !== req.user.uid) {
            return res.status(403).send(
                {
                    success: false,
                    message: 'You are not authorized to update this report'
                }
            )
        }
        if(!report) return res.status(404).send(
            {
                success: false,
                message: 'Report not found or could not be updated'
            }
        )
        return res.status(200).send(
            {
                success: true,
                message: 'Report updated successfully',
                report
            }
        )
    }
    catch (error) {
        console.error(error) 
        return res.status(500).send(
            {
                success: false,
                message: 'General error when updating report'
            }
        )
    }
}

export const deleteReport = async(req, res)=> {
    const { id } = req.params 
    try {
        const report = await Report.findByIdAndDelete(id) 
        if(!report) return res.status(404).send(
            {
                success: false,
                message: 'Report not found or could not be deleted'
            }
        )
        return res.status(200).send(
            {
                success: true,
                message: 'Report deleted successfully'
            }
        )
    } catch (error) {
        console.error(error) 
        return res.status(500).send(
            {
                success: false,
                message: 'Error deleting report'
            }
        )
    }
}