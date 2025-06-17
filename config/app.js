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
    import communitysRoutes from '../src/Community/community.routes.js'
    import campaignRouter from '../src/Campaign/campaign.router.js'
    import communityCollaborationRouter from '../src/CommunityCollaboration/communityCollaboration.routes.js'
    import communityTurnRouter from '../src/CommunityTurn/communityTurn.routes.js'
import { communityCollaborationTurn } from "../src/Sockets/communityCollaborationTurn.socket.js"

    const configs = (app)=>{
        app.use(express.json())
        app.use(express.urlencoded({extended: false}))
        app.use(cors(
            {
                origin: 'http://localhost:5173',
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
        app.use('/v1/aguacomun/communityTurn', communityTurnRouter)
}

    const socketConfig = (socket,io)=>{
        communityCollaboration(socket, io)
        watterReports(socket, io)
        communityCollaborationTurn(socket, io)
    }     


    export const initServer =()=>{
        const app = express()
        const server = http.createServer(app)
        const io = new SocketServer(server,{
            cors: {
                origin: 'http://localhost:5173',
                credentials: true,
            }
        })

        io.on('connection', (socket) => {
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
