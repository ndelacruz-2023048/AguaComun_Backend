// src/resume/resume.controller.js
import { getResumeData } from './resume.service.js';
import { getIO } from '../Sockets/io.js';

export const getResume = async (req, res) => {
    try {
        const resumeData = await getResumeData();

        const io = getIO();
        if (io) {
            io.emit('resumeUpdate', resumeData); // Notifica a todos los clientes
        }

        return res.status(200).json({
            success: true,
            data: resumeData
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};