// SocketResume.js
import { getIO } from './io.js'; // ✅ Usamos import en lugar de require
import { getResumeData } from '../../src/resume/resume.service.js';

export const broadcastResumeUpdate = async () => {
    try {
        const io = getIO();
        if (!io) {
            console.log('Socket.IO no está inicializado');
            return;
        }

        const resumeData = await getResumeData();
        io.emit('resumeUpdate', resumeData);
        console.log('✅ Resumen emitido a todos los clientes conectados');
    } catch (error) {
        console.error('❌ Error al emitir resumen:', error);
    }
};