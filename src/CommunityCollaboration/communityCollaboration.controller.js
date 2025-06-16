import CommunityCollaboration from "./communityCollaboration.model.js"
import CommunityTurn from "../CommunityTurn/communityTurn.model.js"
import { emitNewCollaboration } from "../Sockets/communityCollaboration.socket.js"
import dayjs from "dayjs"
import duration from 'dayjs/plugin/duration.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
dayjs.extend(duration)
dayjs.extend(customParseFormat)
export const createCommunityCollaboration = async (req, res) => {
    try {
        const { activityName, description, startDate, endDate, startTime, endTime, address, shiftDuration, community } = req.body
        const newCommunityCollaboration = new CommunityCollaboration({ activityName, description, startDate, endDate, startTime, endTime, address, shiftDuration, community })
        const result= await newCommunityCollaboration.save()
        const dataNewTurns = {
            activityName, startDate, endDate, startTime, endTime, shiftDuration, community:result, activityId:result._id
        }


        // Emitir evento usando la nueva implementación
        await emitNewCollaboration()
        const data = await createTurnsAutomatic(dataNewTurns)

        await CommunityTurn.insertMany(data)
        res.status(201).send({
            success: true,
            message: "Actividad comunitaria creada correctamente",
            communityCollaboration: newCommunityCollaboration
        })
    } catch (error) {
        console.log("Error al guardar la actividad comunitaria", error)
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}


export const createTurnsAutomatic = async(dataNewTurns) => {
    const dateStart = dayjs(dataNewTurns.startDate)
    const dateEnd = dayjs(dataNewTurns.endDate)
    
    const timeStart = dayjs(dataNewTurns.startTime,"HH:mm:ss")
    const timeEnd = dayjs(dataNewTurns.endTime,"HH:mm:ss")

    const differenceTime = timeEnd.diff(timeStart)
    const durationTime = dayjs.duration(differenceTime)

    /*Dias totales*/
    const totalDays = dateEnd.diff(dateStart,'day')

    /*Horas y minutos totales*/
    const totalHours = Math.floor(durationTime.asHours())
    const totalMinutes = durationTime.minutes()

    
    /*Total horas y minutos por dia*/
    const totalHoursPerDay = totalHours * totalDays
    const totalMinutesPerDay = totalMinutes * totalDays
    
    /**LOGICA PARA CREAR LOS TURNOS*/
    const turns = []
    let currentDate = dateStart
    let currentTime = timeStart

    // Iterar por cada día
    while (currentDate.isBefore(dateEnd) || currentDate.isSame(dateEnd, 'day')) {
        // Reiniciar el tiempo para cada día
        currentTime = timeStart
        
        // Crear turnos para el día actual
        while (currentTime.isBefore(timeEnd)) {
            const turnStartTime = currentTime.format("HH:mm:ss")
            const turnEndTime = sumarHora(turnStartTime, dataNewTurns.shiftDuration)
            
            // Verificar si el turno termina después del horario permitido
            if (dayjs(turnEndTime, "HH:mm:ss").isAfter(timeEnd)) {
                break
            }

            // Crear el turno
            const turn = {
                dateAssigned: currentDate.format("YYYY-MM-DDTHH:mm:ss"),
                startTime: turnStartTime,
                endTime: turnEndTime,
                status: "pending",
                activityId: dataNewTurns.activityId,
                community: dataNewTurns.community
            }
            
            turns.push(turn)
            
            // Actualizar el tiempo para el siguiente turno
            currentTime = dayjs(turnEndTime, "HH:mm:ss")
        }
        /**{
      date: '2025-06-16',
      startTime: '03:04:04',
      endTime: '05:04:04',
      status: 'pending',
      activityId: new ObjectId('6850339abcee034b52f83812'),
      community: [Object]
    }, */
        // Avanzar al siguiente día
        currentDate = currentDate.add(1, 'day')
    }

    return turns
}


const sumarHora=(horaBase, tiempoASumar)=> {
    // Parseamos la hora base
    const base = dayjs(horaBase, "HH:mm:ss")
  
    // Parseamos la hora a sumar para extraer horas, minutos y segundos
    const [h, m, s] = tiempoASumar.split(':').map(Number)
  
    // Sumamos la cantidad exacta a la hora base
    const nuevaHora = base
      .add(h, 'hour')
      .add(m, 'minute')
      .add(s, 'second')
  
    return nuevaHora.format("HH:mm:ss")
}