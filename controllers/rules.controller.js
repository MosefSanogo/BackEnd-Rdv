import rulesService from "../services/rules.service.js";
const register = async (req,res,next)=>{
    try {
        console.log(req.body)
        const result = await rulesService.register(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error)
    }
}

const getByServiceId = async (req,res, next)=>{
    try {
        const rows = await rulesService.getByServiceId(req.params.id);
        res.status(200).json(rows);
    } catch (error) {
        next(error)
    }
}
export default{
    register,
    getByServiceId
}