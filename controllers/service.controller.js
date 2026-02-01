import serviceService from "../services/service.service.js"

const register = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      ville_id: Number(req.body.ville_id)
    };

    const result = await serviceService.register(
      data,
      req.file?.filename || null
    );

    res.status(201).json({
      message: "Service créé avec succès",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const findAllService = async (req,res,next) =>{
    try {
        const rows = await serviceService.getAllService();
        res.status(200).json(rows);
    } catch (error) {
        next(error)
    }
}

const findSousServiceFromService = async (req,res,next) =>{
    try {
        const id = req.params.id
        const rows = await serviceService.getSousServiceFromService(id);
        res.status(200).json(rows);
    } catch (error) {
        next(error)
    }
}

const setServiceActif = async (req,res,next) =>{
    try {
        const {actif,id} = req.body
        const rows = await serviceService.setServiceActif(actif,id);
        res.status(200).json(rows);
    } catch (error) {
        next(error)
    }
}

const setSousServiceActif = async (req,res,next) =>{
    try {
        const {actif,id} = req.body
        const rows = await serviceService.setSousServiceActif(actif,id);
        res.status(200).json(rows);
    } catch (error) {
        next(error)
    }
}

export default{
    register,
    findAllService,
    findSousServiceFromService,
    setSousServiceActif,
    setServiceActif
}