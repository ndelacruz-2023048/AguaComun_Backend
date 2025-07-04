'use string'

    import express from "express"
    import morgan from "morgan"
    import helmet from "helmet"
    import cors from "cors"
    import cookieParser from "cookie-parser"
    import authRoutes from '../src/Auth/auth.routes.js'
    import paymentRoutes from '../src/Payment/payment.routes.js'
    import { limiter } from '../middlewares/rate.limit.js'
    import http from "http"
    import {Server as SocketServer} from 'socket.io'
    import { communityCollaboration } from "../src/Sockets/communityCollaboration.socket.js"
    import reportRoutes from '../src/Reports/report.routes.js'
    import { watterReports } from "../src/Sockets/WatterReports.js"
    import {newpaymentSocket} from "../src/Sockets/newpayment.socket.js"
    import communitysRoutes from '../src/Community/community.routes.js'
    import campaignRouter from '../src/Campaign/campaign.router.js'
    import communityRoutesManager from '../src/CommunityManager/community.routes.js'
    import communityCollaborationRouter from '../src/CommunityCollaboration/communityCollaboration.routes.js'
        import userRoutes from '../src/User/user.routes.js'
    import communityTurnRouter from '../src/CommunityTurn/communityTurn.routes.js'
    import { communityCollaborationTurn } from "../src/Sockets/communityCollaborationTurn.socket.js"
    import { setIO } from "../src/Sockets/io.js"
    import { communityManagerSocket } from "../src/Sockets/communityManager.socket.js"
    import {userSocket} from "../src/Sockets/user.sockets.js"
    import { paymentSocket } from "../src/Sockets/payment.socket.js"
    import {communitySocket} from "../src/Sockets/community.socket.js"
    import {reportStatsSocket} from "../src/Sockets/reports.socket.js"

    const configs = (app)=>{
        app.use(express.json())
        app.use(express.urlencoded({extended: false}))
        app.use(cors(
            {
                origin: ['https://aguacomunfrontend-production.up.railway.app', 'http://localhost:5173'],
                credentials: true,
            }
        ))
        app.use(helmet())
        app.use(cookieParser())
        app.use(morgan('dev'))
        app.use(limiter)
    }

    
    const routes = (app)=>{
        app.use('/v1/aguacomun/auth', authRoutes)
        app.use('/v1/aguacomun/reports', reportRoutes)
        app.use('/v1/aguacomun/community', communitysRoutes)
        app.use('/v1/aguacomun/campaign', campaignRouter)
        app.use('/v1/aguacomun/payment', paymentRoutes)
        app.use('/v1/aguacomun/communityCollaboration', communityCollaborationRouter)
        app.use('/v1/aguacomun/communityManager', communityRoutesManager)
        app.use('/v1/aguacomun/user', userRoutes)
        app.use('/v1/aguacomun/communityTurn', communityTurnRouter)
}

    const socketConfig = (socket,io)=>{
        communityCollaboration(socket, io)
        watterReports(socket, io)
        communityCollaborationTurn(socket, io)
        userSocket(socket, io)
        communityManagerSocket(socket, io)
        paymentSocket(socket, io)
        newpaymentSocket(socket, io)
        communitySocket(socket, io)
        reportStatsSocket(socket, io)
    }     


    export const initServer =()=>{
        const app = express()
        const server = http.createServer(app)
        const io = new SocketServer(server,{
            cors: {
                origin: ['https://aguacomunfrontend-production.up.railway.app', 'http://localhost:5173'],           
                credentials: true,
            }
        })

        io.on('connection', (socket) => {
            setIO(io); // <-- Agregar esto para exponer io globalmente
            console.log(`New socket connection: ${socket.id}`)
            socketConfig(socket, io)
            socket.on("disconnect", () => {
                console.log(`❌ Cliente desconectado: ${socket.id}`);
                console.log(`🔢 Clientes restantes: ${io.engine.clientsCount}`);
            });
        })

        try{
            configs(app)
            routes(app)
            server.listen(process.env.PORT)
            console.log(`Server running in port ${process.env.PORT}`)
        }catch(e){
            console.error('S3erver init failed', e)
        }
    }
