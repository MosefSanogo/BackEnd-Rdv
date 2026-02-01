import citoyenService from "../services/citoyen.service.js"
const register = async (req, res, next) => {
  try {
    const citoyen = await citoyenService.register(req.body);
    res.status(201).json({
      message: "Citoyen inscrit avec succès",
      data: citoyen
    });
  } catch (error) {
    next(error);
  }
};
const getCitoyen = async (req,res,next)=>{
    try{
        const citoyens = await citoyenService.getCitoyen()
        res.status(200).json(citoyens);
    } catch (error) {
        next(error);
    }
}
const deleteCitoyen = async (req,res,next)=>{
    try{
        const id = req.params.id
        await citoyenService.deleteCitoyen(id)
        res.status(200).json({
            message : "Client a été supprimé avec succès"
        });
    } catch (error) {
        next(error);
    }
}
export default{
    register,
    getCitoyen,
    deleteCitoyen
}