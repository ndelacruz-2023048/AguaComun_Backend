import Payment from '../Payment/payment.model.js';
import Report from '../Reports/report.model.js';
import Campaign from '../Campaign/campaign.model.js';
import User from '../User/user.model.js';

export const getResumeData = async () => {
    try {
        const [paymentsResult, reportsCount, campaignsCount, usersCount, newUsersCount] = await Promise.all([
            Payment.aggregate([{ $group: { _id: null, totalAmount: { $sum: '$amount' } } }]),
            Report.countDocuments(),
            Campaign.countDocuments(),
            User.countDocuments(),
            User.countDocuments({
                fechaRegistro: {
                    $gte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                }
            })
        ]);

        // ✅ Evita errores si no hay pagos
        const totalAmount = paymentsResult.length > 0 ? paymentsResult[0].totalAmount : 0;

        // ✅ Evita divisiones por cero
        const newUserRate = usersCount > 0
            ? ((newUsersCount / usersCount) * 100).toFixed(2)
            : 0;

        return {
            dineroRecaudado: totalAmount,
            actividades: campaignsCount,
            reportes: reportsCount,
            tasaNuevosUsuarios: `${newUserRate}%`
        };
    } catch (error) {
        console.error('Error generando resumen:', error);
        throw error;
    }
};