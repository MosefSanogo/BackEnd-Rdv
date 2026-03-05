import reservationService from "../services/reservation.service.js";

const register = async (req, res, next) => {
  try {
    const result = await reservationService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getByDateAndSousService = async (req, res, next) => {
  try {
    const { date, id } = req.params;
    const row = await reservationService.getByDateAndSousService(date, id);
    res.status(200).json(row);
  } catch (error) {
    next(error);
  }
};

const getByDateAndService = async (req, res, next) => {
  try {
    const { date, id } = req.params;
    const row = await reservationService.getByDateAndService(date, id);

    res.status(200).json(row);
  } catch (error) {
    next(error);
  }
};

const getByDateAndServiceGroupByTime = async (req, res, next) => {
  try {
    const { date, id } = req.params;
    const row = await reservationService.getByDateAndServiceGroupByTime(
      date,
      id,
    );
    res.status(200).json(row);
  } catch (error) {
    next(error);
  }
};

const setStatus = async (req, res, next) => {
  try {
    const { reservationId, statut } = req.body;
    const result = await reservationService.setStatus(reservationId, statut);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getByQrCode = async (req, res, next) => {
  try {
    const { qrCode } = req.params;
    const row = await reservationService.getByQrCode(qrCode);
    res.status(200).json(row);
  } catch (error) {
    next(error);
  }
};

const getAllClientReservation = async (req, res, next) => {
  try {
    const serviceId = req.params.id;
    const row = await reservationService.getAllClientReservation(serviceId);
    res.status(200).json(row);
  } catch (error) {
    next(error);
  }
};

const getClientReservation = async (req, res, next) => {
  try {
    const serviceId = req.params.id;
    const row = await reservationService.getClientReservation(serviceId);
    res.status(200).json(row);
  } catch (error) {
    next(error);
  }
};

const getStatisticByServiceId = async (req,res,next)=>{
    try {
        const id = req.params.id;
        const row = await reservationService.getStatisticByServiceId(id);
        res.status(200).json(row);
    } catch (error) {
        next(error)
    }
}
const getHourlyDataByServiceIdAndDate = async (req,res,next)=>{
    try {
        const{id,date} = req.params;
        const row =  await reservationService.getHourlyDataByServiceIdAndDate(id,date);
        res.status(200).json(row);
    } catch (error) {
        next(error)
    }
}
const getDayServiceDistributionByServiceIdAndDate = async (req,res,next)=>{
    try {
        const{id,date} = req.params;
        const row =  await reservationService.getDayServiceDistributionByServiceIdAndDate(id,date);
        res.status(200).json(row);
    } catch (error) {
        next(error)
    }
}
const getWeeklyDataByServiceIdAndDate = async (req,res,next)=>{
    try {
        const{id,date} = req.params;
        const row =  await reservationService.getWeeklyDataByServiceIdAndDate(id,date);
        res.status(200).json(row);
    } catch (error) {
        next(error)
    }
}
const getWeeklyServiceDistributionByServiceIdAndDate = async (req,res,next)=>{
    try {
        const{id,date} = req.params;
        const row =  await reservationService.getWeeklyServiceDistributionByServiceIdAndDate(id,date);
        res.status(200).json(row);
    } catch (error) {
        next(error)
    }
}
const getMonthlyByServiceIdAndDate = async (req,res,next)=>{
    try {
        const{id,date} = req.params;
        const row =  await reservationService.getMonthlyByServiceIdAndDate(id,date);
        res.status(200).json(row);
    } catch (error) {
        next(error)
    }
}
const getMonthlyServiceDistributionByServiceIdAndDate = async (req,res,next)=>{
    try {
        const{id,date} = req.params;
        const row =  await reservationService.getMonthlyServiceDistributionByServiceIdAndDate(id,date);
        res.status(200).json(row);
    } catch (error) {
        next(error)
    }
}  
const getYearlyByServiceIdAndDate = async (req,res,next)=>{
    try {
        const{id,date} = req.params;
        const row =  await reservationService.getYearlyByServiceIdAndDate(id,date);
        res.status(200).json(row);
    } catch (error) {
        next(error)
    }
}    
const getYearlyServiceDistributionByServiceIdAndDate = async (req,res,next)=>{
    try {
        const{id,date} = req.params;
        const row =  await reservationService.getYearlyServiceDistributionByServiceIdAndDate(id,date);
        res.status(200).json(row);
    } catch (error) {
        next(error)
    }
}  
export default {
  register,
  getByDateAndSousService,
  getByDateAndService,
  setStatus,
  getByQrCode,
  getByDateAndServiceGroupByTime,
  getAllClientReservation,
  getClientReservation,
  getStatisticByServiceId,
  getHourlyDataByServiceIdAndDate,
  getDayServiceDistributionByServiceIdAndDate,
  getWeeklyDataByServiceIdAndDate,
  getWeeklyServiceDistributionByServiceIdAndDate,
  getMonthlyByServiceIdAndDate,
  getMonthlyServiceDistributionByServiceIdAndDate,
  getYearlyByServiceIdAndDate,
  getYearlyServiceDistributionByServiceIdAndDate
};
