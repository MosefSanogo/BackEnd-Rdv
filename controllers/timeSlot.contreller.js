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
export default{
    generate
}