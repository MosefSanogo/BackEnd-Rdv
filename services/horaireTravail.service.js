import horaireTravailModel from "../models/horaireTravail.model.js"

const register = async (data) => {
  return await horaireTravailModel.create(data)
}

const setActif = async (actif,id) =>{
    const result = await horaireTravailModel.setActif(actif,id);
    if (result.affectedRows === 0) {
         throw new Error("Horaire introuvable");
    }

    return {message: "Horaire modifée avec succès"};
}

export default{
    register,
    setActif
}