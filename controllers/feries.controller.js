import feriesService from "../services/feries.service.js"

const getByServiceId = async (req,res, next)=>{
    try {
        const rows = await feriesService.getByServiceId(req.params.id);
        res.status(200).json(rows);
    } catch (error) {
        next(error)
    }
}

const register = async (req,res,next)=>{
    try {
        const result = await feriesService.register(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error)
    }
}

const deleteFerie = async (req,res,next)=>{
    try {
        const id = req.params.id;
        const result = await feriesService.deleteFerie(id);
        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}

export default{
    register,
    getByServiceId,
    deleteFerie
}