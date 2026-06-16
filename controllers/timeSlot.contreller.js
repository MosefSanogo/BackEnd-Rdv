import timeSlotService from "../services/timeSlot.service.js";

const generate = async (req, res, next) => {
    
    try{
        const { date, service_id, sous_service_id } = req.body;
        const slots = await timeSlotService.generateTimeSlotsIfNotExist(date,service_id,sous_service_id);
        res.status(200).json({
            date,
            total_slots: slots.length,
            time_slots: slots
        });
    } catch (error) {
    next(error);
  }
}
const getTimeSlots = async (req, res, next) => {
    try{
        const { service_id, sous_service_id, date } = req.params;
        const slots = await timeSlotService.getTimeSlots(service_id, sous_service_id, date);
         res.status(200).json({
            ...slots
        });
    } catch (error) {
    next(error);
  }
}
export default{
    generate,
    getTimeSlots
}