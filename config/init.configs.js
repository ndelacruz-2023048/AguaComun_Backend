import User from '../src/User/user.model.js';
import { encrypt } from '../utils/encrypt.js';

export const initAdmin = async (req, res) => {
    try {
        const adminExists = await User.findOne({ rol: 'ADMIN' });
        if (!adminExists) {
        console.log('Creating user with ADMIN role default');

        const password = process.env.PASSWORD;
        const encryptPassword = await encrypt(password);

        const adminUserDefault = new User({
            name: process.env.NOMBRE,
            surname: process.env.APPELLIDOS,
            username: process.env.NICKNAME,
            address: {
                zone: process.env.ADDRESS_ZONE,
                municipality: process.env.ADDRESS_MUNICIPALITY,
                department: process.env.ADDRESS_DEPARTMENT,
            },
            mobilePhone: process.env.CELULAR,
            country: process.env.COUNTRY,
            email: process.env.CORREO,
            password: encryptPassword,
            profilePicture: '',
            rol: process.env.ROL,
        });
        await adminUserDefault.save();
        console.log('User successfully created');
        } else {
        console.log('Default ADMIN already created');
        }
    } catch (e) {
        console.error('General error when register ADMIN on the system');
        throw e;
    }
};