'use strict'
import jwt from 'jsonwebtoken'
import User from '../src/User/user.model.js'

export const validateTokenJWT = async(req, res, next)=> {
    try {
        const token = req.cookies.access_token
        if(!token) return res.status(401).send(
            {
                success: false,
                message: 'Unauthorized, no token provided'
            }
        )
        const user = jwt.verify(token, process.env.SECRET_KEY)
        const userVerify = await User.findOne({ _id: user.uid })
        if(!userVerify) return res.status(404).send(
            {
                success: false,
                message: 'User not found - unauthorized'
            }
        )
        req.user = user
        console.log('user: ', user.uid);
        
        next() 
    } catch (e) {
        console.error(e)
        return res.status(401).send(
            {
                success: false,
                message: 'Invalid credentials'
            }
        )
    }
}

export const isAdmin = (req, res, next)=>{
    try {
        const { user } = req
        if(!user  || user.type != 'ADMIN') return res.status(403).send(
            {
                success: false,
                message: `You dont have acces | username ${user.username}, is not an ADMIN`
            }
        )
        console.log('role: ', user.type);
        next()
    } catch (e) {
        console.error(e);
        return res.status(403).send(
            {
                success: false,
                message: 'Error with authorization'
            }
        )
    }
}