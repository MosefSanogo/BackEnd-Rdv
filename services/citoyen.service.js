import citoyenModel from "../models/citoyen.model.js"

const register = async (data)=>{
    const{telephone} = data
    const exists = await citoyenModel.findByTelephone(telephone)
    if(exists){
        throw new Error("Téléphone déjà utilisé");
    }

    return await citoyenModel.create(data);
};

const getCitoyen = async ()=>{
    return await citoyenModel.findAll();
}

const deleteCitoyen = async (id)=>{
    const result = await citoyenModel.deleteById(id)
    if (result.affectedRows === 0) {
         throw new Error("Citoyen introuvable");
    }
}

export default{
    register,
    getCitoyen,
    deleteCitoyen
}