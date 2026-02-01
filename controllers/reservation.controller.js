import reservationService from "../services/reservation.service.js"

const register = async (req,res,next)=>{
    try {
        const result = await reservationService.register(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error)
    }    
}

const getByDateAndSousService = async (req,res,next)=>{
    try {
        const{date, id} = req.params;
        const row = await reservationService.getByDateAndSousService(date,id);
        res.status(200).json(row);
    } catch (error) {
        next(error);
    }

}

const getByDateAndService = async (req,res,next)=>{
    try {
        const{date, id} = req.params;
        const row = await reservationService.getByDateAndService(date, id);

        res.status(200).json(row);
    } catch (error) {
        next(error);
    }

}

const setStatus = async (req,res,next) =>{
    try {
        const {reservationId, statut} = req.body;
        const result = await reservationService.setStatus(reservationId,statut);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

const getByQrCode = async (req,res,next)=>{
    try {
        const{qrCode} = req.params;
        const row = await reservationService.getByQrCode(qrCode);
        res.status(200).json(row);
    } catch (error) {
        next(error);
    }

}

export default{
    register,
    getByDateAndSousService,
    getByDateAndService,
    setStatus,
    getByQrCode
}