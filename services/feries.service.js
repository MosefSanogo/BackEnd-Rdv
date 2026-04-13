import feriesModel from "../models/feries.model.js"

const getByServiceId = async (serviceId)=>{
    return await feriesModel.findByServiceId(serviceId)
}

const register = async (data)=>{
    const ferie = await feriesModel.findByServiceIdAndDate(data.date,data.id_service);
    if(ferie){
        throw new Error('Information déjà enregistrée')
    }
    if(new Date(data.date) < new Date()){
        throw new Error('La date doit être supérieure ou égale à la date actuelle')
    }
    const result = await feriesModel.create(data);

    if(result.insertId){
        return {message: "Jour férié enregistré avec succès"}
    }

    return {message: "Un problème est survenu"}
}

const deleteFerie = async (id)=>{
    const result = await feriesModel.deleteFerie(id);
    return result;
}

export default{
    getByServiceId,
    register,
    deleteFerie
}