import pauseModel from "../models/pause.model.js"

const register = async (data) =>{
    if(data.heure_debut >= data.heure_fin){
        throw new Error("L'heure de début doit être avant l'heure de fin");
    }
    return await pauseModel.create(data);
}
const getAllPausesBySousServiceId = async (serviceId)=>{
    return await pauseModel.findAllPausesBySousServiceId(serviceId);
}
const deleteFromPauseBySousServiceId = async (serviceId)=>{
    return await pauseModel.deletePauseBySousServiceId(serviceId);
}

export default{
    register,
    getAllPausesBySousServiceId,
    deleteFromPauseBySousServiceId
}