import feriesModel from "../models/feries.model.js"

const getByServiceId = async (serviceId)=>{
    return await feriesModel.findByServiceId(serviceId)
}

const register = async (data)=>{
    const ferie = await feriesModel.findByServiceIdAndDate(data.date,data.id_service);
    if(ferie){
        throw new Error('Information déjà enregistrée')
    }
    const result = await feriesModel.create(data);

    if(result.insertId){
        return {message: "Jour férié enregistré avec succès"}
    }

    return {message: "Un problème est survenu"}
}

export default{
    getByServiceId,
    register
}