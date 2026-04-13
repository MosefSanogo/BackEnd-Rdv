import loginModel from "../models/login.model.js";
import bcrypt from 'bcrypt';
const login = async (data)=>{
 const {email, password} = data;
 const result = await loginModel.login(email);
 if(!result) {
    throw new Error("Utilisateur non trouvé");
 }
    const isMatch = await bcrypt.compare(password, result.password);
    if(!isMatch) {
        throw new Error("Mot de passe incorrect");
    }

    return { id: result.id, nom: result.nom, email: result.email, tel: result.tel, description: result.description, adresse: result.adresse, image_url: result.image_url,category: result.category ,ville: result.ville };
}

export default {
    login
}