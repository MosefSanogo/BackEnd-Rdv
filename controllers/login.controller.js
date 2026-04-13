import loginService from "../services/login.service.js";
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || "MALIDEFHSJBCSJKJBSNDNNQ @";


const login = async (req, res, next) => {
  try {
    const result = await loginService.login(req.body);
    const token = jwt.sign(
      {
        id: result.id,
        nom: result.nom,
        adresse: result.adresse,
        description: result.description,
        ville: result.ville,
      },
      SECRET,
      { expiresIn: "2h" },
    );
    res.json({ service: result, token });
  } catch (error) {
    next(error);
  }
};

export default {
  login,
};
