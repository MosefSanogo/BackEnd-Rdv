import ReservationModel from "../models/reservation.model.js";
import timeSlotModel from "../models/timeSlot.model.js";
import crypto from 'crypto';

const register = async (data)=>{
    const result = await timeSlotModel.decrementCapacity(data.timeSlotId);
    if(result.affectedRows === 0){
        throw new Error('Créneau déjà complet');
    }

     const qrToken = crypto.randomUUID();

    await ReservationModel.create({
        ...data,
        qrToken
    });

  return { message: "Réservation confirmée", qrToken };

}

const getByDateAndSousService  = async (date,sousServiceId)=>{

    return await ReservationModel.findByDateAndSousService(date, sousServiceId);
}

const getByDateAndService  = async (date,serviceId)=>{

    return await ReservationModel.findByDateAndService(date, serviceId);
}

const getByQrCode = async (qrCode)=>{
    const result = await ReservationModel.findByQrToken(qrCode);
    if(result.id){
        const update = await ReservationModel.updateStatus(result.id,"Valide");
        if(update.affectedRows === 0){
        throw new Error('Réservation introuvable');
    }
    }
    return result;
}

const setStatus = async (id, statut)=>{
    const result = await ReservationModel.updateStatus(id,statut);
    if(result.affectedRows === 0){
        throw new Error('Réservation introuvable');
    }

    return {message: "Statut mise à jour avec succès"}
}

export default{
    register,
    getByDateAndSousService,
    getByDateAndService,
    getByQrCode,
    setStatus
}