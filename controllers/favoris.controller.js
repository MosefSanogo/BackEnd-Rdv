import favorisService from "../services/favoris.service.js";

const register = async (req, res, next) => {
  try {
    const result = await favorisService.register(req.body);
    res.status(201).json({message: "Favoris cree"});
  } catch (error) {
    next(error);
  }
};

const getAllByCitoyenId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await favorisService.getAllByCitoyenId(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllWithService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await favorisService.getAllWithService(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const { serviceId, citoyenId } = req.params;
    const result = await favorisService.deleteById(serviceId, citoyenId);
    res.status(200).json({
      message: "favoris a été supprimé avec succès",
    });
  } catch (error) {
    next(error);
  }
};

export default{
    register,
    getAllByCitoyenId,
    deleteById,
    getAllWithService
}
