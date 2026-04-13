import pauseService from "../services/pause.service.js"

const register = async (req,res,next)=>{
    try {
        const row = await pauseService.register(req.body);
        res.status(201).json({message: "Pause ajoutée avec succès"})
    } catch (error) {
        next(error)
    }
}

const getAllPausesBySousServiceId = async (req,res,next)=>{
    try {
        const {serviceId} = req.params;
        const rows = await pauseService.getAllPausesBySousServiceId(serviceId);
        res.status(200).json(rows);
    } catch (error) {
        next(error)
    }
}

const deleteFromPauseBySousServiceId = async (req,res,next)=>{
    try {
        const {serviceId} = req.params;
        const rows = await pauseService.deleteFromPauseBySousServiceId(serviceId);
        res.status(201).json({message: "Pause supprimée avec succès"});
    } catch (error) {
        next(error)
    }
}

export default{
    register,
    getAllPausesBySousServiceId,
    deleteFromPauseBySousServiceId
}