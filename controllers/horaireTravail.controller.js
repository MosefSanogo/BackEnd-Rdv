import horaireTravailService from "../services/horaireTravail.service.js"

const register = async (req,res, next) =>{
    try{
        const horaire = await horaireTravailService.register(Object.values(req.body))
        res.status(200).send(horaire);
    } catch (error) {
        next(error);
        res.status(400).json({ success: false, message: error.message });
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

const updateOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(req.body)
    // ✅ Vérifier que l'id est valide
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'ID invalide'
      });
    }

    // ✅ Vérifier que le body n'est pas vide
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucune donnée à mettre à jour',
        body: Object.keys(req.body).length
      });
    }

    const updated = await horaireTravailService.updateOne(Number(id), req.body);

    res.status(200).json({
      success: true,
      message: 'Planning mis à jour',
    });

  } catch (error) {
    const clientErrors = ['invalide', 'introuvable', 'début', 'fin', 'Capacité'];
    const isClientError = clientErrors.some(msg => error.message?.includes(msg));

    if (isClientError) {
      return res.status(400).json({ success: false, message: error.message });
    }

    next(error);
  }
};

export default{
    register,
    setActif,
    getBySousServiceId,
    updateOne
}
