import favorisModel from "../models/favoris.model.js"

const register = async (data)=>{
    return await favorisModel.register(data);
}
const getAllByCitoyenId = async (id) =>{
    return await favorisModel.findAllByCitoyenId(id);
}
const deleteById = async (serviceId,citoyenId)=>{
    return await favorisModel.deleteByServiceIdANDCitoyenId(citoyenId,serviceId);
}

export default{
    register,
    getAllByCitoyenId,
    deleteById
}