import User from '../src/User/user.model.js'
import { encrypt } from '../utils/encrypt.js'

export const initAdmin = async(req, res) => {
    try {
        const adminExists = await User.findOne({ username: process.env.NICKNAME })
        if(!adminExists) {
            console.log('Creating user with ADMIN role default');

            const password = process.env.PASSWORD
            const encryptPassword = await encrypt(password)

            const adminUserDefault = new User(
                {
                    name: process.env.NOMBRE,
                    surname: process.env.APPELLIDOS,
                    username: process.env.NICKNAME,
                    accountNumber: process.env.NOCUENTA, 
                    DPI: process.env.DPI, 
                    address: process.env.DIRECCION,
                    mobilePhone: process.env.CELULAR,
                    country: process.env.COUNTRY,
                    email: process.env.CORREO,
                    password: encryptPassword, 
                    profilePicture: "", 
                    workName: process.env.WORK,
                    monthlyIncome: process.env.MONTOI 
                }
            )
            await adminUserDefault.save()
            console.log('User successfully created');
        } else {
            console.log('Default ADMIN already created')
        }
    } catch (e) {
        console.error('General error when register ADMIN on the sytem');
        throw e
    }
}