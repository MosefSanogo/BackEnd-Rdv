import horaireTravailService from "../services/horaireTravail.service.js"

const register = async (req,res, next) =>{
    try{
        const horaire = await horaireTravailService.register(req.body)
        res.status(200).send(horaire);
    } catch (error) {
        next(error);
    }
    
}
const setActif = async(req,res,next)=>{
    try{
        const{actif,id} = req.body
        const horaire = await horaireTravailService.setActif(actif, id)
        res.status(200).send(horaire);
    } catch (error) {
        next(error);
    }
}
const getBySousServiceId = async (req,res,next)=>{
    try {
        const sousServiceId = req.params.id;
        const horaires = await horaireTravailService.getBySousServiceId(sousServiceId);
        res.status(200).json(horaires);
    } catch (error) {
        next(error);
    }
}

export default{
    register,
    setActif,
    getBySousServiceId
}
