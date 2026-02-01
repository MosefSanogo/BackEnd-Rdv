import serviceModel from "../models/service.model.js"

const register = async (data,img)=>{

     const exists = await serviceModel.findByNameCityAndAddress(
        data.nom,
        data.ville_id,
        data.adresse
    );

    if (exists) {
        throw new Error("Ce service existe déjà dans cette ville");
    }

    const result = await serviceModel.create(data,img);
    return result;
}

const getAllService = async ()=>{
    return await serviceModel.findAllService();
}

const getSousServiceFromService = async (id) =>{
    if(!id){
        throw new Error("L'identifant est obligatoire")
    }
    
    return await serviceModel.findAllSousServiceFromServiceId(id)
}

const setServiceActif = async (actif,id)=>{
    const result = await serviceModel.setServiceActif(actif, id)
    if(result.affectedRows === 0){
        throw new Error("Service introuvable")
    }

    return {message: "Service modifié avec succès"};
}

const setSousServiceActif = async (actif,id)=>{
    const result = await serviceModel.setSousServiceActif(actif, id)
    if(result.affectedRows === 0){
        throw new Error("Sous Service introuvable")
    }

    return result;
}

export default{
    register,
    getAllService,
    getSousServiceFromService,
    setServiceActif,
    setSousServiceActif
}