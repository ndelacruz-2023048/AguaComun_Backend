import User from '../User/user.model.js'
import Community from '../Community/community.model.js'
import { checkPassword, encrypt } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'
import { validateTokenJWT } from '../../middlewares/validate.jwt.js'

export const login = async(req, res)=> {
    const { userLogin, password } = req.body
    try {
        const user = await User.findOne(
            {
                $or: [
                    { email: userLogin },
                    { username: userLogin }
                ]
            }
        )
        if(user && await checkPassword(user.password, password)){
            const loggedUser = {
                uid: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                username: user.username,
                profile: user.profilePicture
            }
            const token = await generateJwt(loggedUser)
            return res
                .cookie('access_token', token, {
                    httpOnly: false,
                    secure: true,
                    sameSite: 'None',
                    maxAge: 2000*60*60
                })
                .send(
                    {
                        success: true,
                        message: `Welcome ${user.name} ${user.surname} to sytem`,
                        loggedUser,
                    }
                )
        }

        return res.status(404).send(
            {
                success: false,
                message: 'Invalid Credentials'
            }
        )
    } catch (e) {
        console.error(e);
        return res.status(500).send(
            {
                success: false,
                message: 'Internal Server error'
            }
        )
    }
}

export const register = async(req, res)=> {
    try {
        const data = req.body
        let user = new User(data)
        user.password = await encrypt(user.password)
        await user.save()

        const {department, municipality, zone} = data.address
        let community = await Community.findOne(
            {
                department,
                municipality,
                zone
            }
        )
        if (!community) {
            // Crear una nueva comunidad si no existe
            community = new Community({
                department,
                municipality,
                zone,
                name: `${department} - ${municipality} - ${zone}`,
                description: `Community of ${department} - ${municipality} - ${zone}`,
                image: 'https://res.cloudinary.com/dzydnoljd/image/upload/v1749830077/Kinal_Blog_vwsczs.png',
                members: [user._id],
                createdBy: user._id,
            });
            await community.save();
        } else {
            // Si existe, agregar el usuario a members solo si no está
            if (!community.members.includes(user._id)) {
                community.members.push(user._id);
                await community.save();
            }
        }
        await community.save()

        return res.status(200).send(
            {
                success: true,
                message: `Register successfully, can be login to system with username: ${user.username} or email: ${user.email}`
            }
        )
    } catch (e) {
        console.error(e);
        return res.status(500).send(
            {
                success: false,
                message: 'Internal Server Error'
            }
        )
    }
}

export const logout = [validateTokenJWT, (req, res) => {
    return res
        .clearCookie('access_token')
        .json({
            success: true,
            message: `Logged out successfully, goodbye ${req.user.name}`,
        });
}];