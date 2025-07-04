import Payment from '../Payment/payment.model.js';
import Report from '../Reports/report.model.js';
import Campaign from '../Campaign/campaign.model.js';
import User from '../User/user.model.js';
import mongoose from 'mongoose';

export const getResumeData = async (id) => {
    console.log(`Generating resume for community ID: ${id}`);

    let communityId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('ID inválido');
    }

    communityId = new mongoose.Types.ObjectId(id);
    console.log('ObjectId generado:', communityId);

    try {
        // Verificación previa de usuarios
        const totalUsers = await User.countDocuments();
        console.log('Total de usuarios en la base de datos:', totalUsers);

        const [paymentsResult, reportsCount, campaignsCount, usersCount, newUsersCount, members] = await Promise.all([
            Payment.aggregate([{ $group: { _id: null, totalAmount: { $sum: '$amount' } } }]),
            Report.countDocuments({ community: communityId }),
            Campaign.countDocuments(),
            User.countDocuments({ community: id}),
            User.countDocuments({
                community: communityId,
                createdAt: {
                    $gte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                }
            }),
            User.find({ community: communityId })
                .select('name surname profilePicture')
                
        ]);

        // ✅ Evita errores si no hay pagos
        const totalAmount = paymentsResult.length > 0 ? paymentsResult[0].totalAmount : 0;

        // ✅ Evita divisiones por cero
        const newUserRate = usersCount > 0
            ? ((newUsersCount / usersCount) * 100).toFixed(2)
            : 0;

        console.log('members: ', usersCount);
        

        return {
            dineroRecaudado: totalAmount,
            reportes: reportsCount,
            actividades: campaignsCount,
            usuarios: usersCount,
            tasaNuevosUsuarios: `${newUserRate}%`,
            miembros: members.map(member => ({
                name: member.name,
                surname: member.surname,
                profilePicture: member.profilePicture
            }))
        };
    } catch (error) {
        console.error('Error generando resumen:', error);
        throw error;
    }
};