import serviceModel from "../models/service.model.js";
import bcrypt from 'bcrypt';
// --- serviceService.js ---
const register = async (data, img) => {
  try {
    console.log('=== SERVICE REGISTER ===');
    
    const exists = await serviceModel.findByNameCityAndAddress(
      data.nom,
      Number(data.ville_id),
      data.adresse
    );
    console.log('Existe déjà ?', exists);

    if (exists) {
      throw new Error('Ce service existe déjà dans cette ville');
    }

    data.password = await bcrypt.hash(data.password, 10);
    console.log('Password hashé ✅');

    const result = await serviceModel.create(data, img);
    console.log('Résultat création :', result);
    
    return result;

  } catch (error) {
    console.error('=== ERREUR SERVICE ===');
    console.error('Message :', error.message);
    console.error('Code SQL :', error.code);      // ER_DUP_ENTRY, ER_NO_REFERENCED_ROW_2...
    console.error('SQL      :', error.sql);        // La requête qui a planté
    console.error('SQLState :', error.sqlState);
    throw error;
  }
};

const getAllService = async () => {
  return await serviceModel.findAllService();
};

const getSousServiceFromService = async (id) => {
  if (!id) {
    throw new Error("L'identifant est obligatoire");
  }

  return await serviceModel.findAllSousServiceFromServiceId(id);
};

const setServiceActif = async (actif, id) => {
  const result = await serviceModel.setServiceActif(actif, id);
  if (result.affectedRows === 0) {
    throw new Error("Service introuvable");
  }

  return { message: "Service modifié avec succès" };
};

const setSousServiceActif = async (actif, id) => {
  const result = await serviceModel.setSousServiceActif(actif, id);
  if (result.affectedRows === 0) {
    throw new Error("Sous Service introuvable");
  }

  return result;
};

const getSousServiceActif = async (serviceId) => {
  return await serviceModel.getSousServiceActif(serviceId);
};
const getCountSousServiceActif = async (serviceId) => {
  return await serviceModel.getCountSousServiceActif(serviceId);
};

const getSousServiceWithParams = async (serviceId) => {
  return await serviceModel.getSousServiceWithParams(serviceId);
};
const addSousService = async (data, serviceId) => {
  if (!data) {
    throw new Error("Le nom du sous service est obligatoire");
  }
  const dataWithoutDoublon = data.filter((item, index) => {
    return data.findIndex((i) => i.nom === item.nom) === index;
  });
  if (dataWithoutDoublon.length !== data.length) {
    throw new Error("Il y a des doublons dans les noms des sous services");
  }
  const formattedData = dataWithoutDoublon.map((item) => [serviceId, item.nom]);
  return await serviceModel.createSousService(formattedData);
};

const deleteSousService = async (id) => {
  const result = await serviceModel.deleteSousService(id);
    if (result.affectedRows === 0) {
            throw new Error("Sous Service introuvable");
    }

    return { message: "Sous Service supprimé avec succès" };

}

const findByServiceId = async (serviceId) => {
   let result = await serviceModel.findByServiceId(serviceId);
   if (!result) {
    throw new Error("Service introuvable");
  }
  result ={
    id: result.id,
    agencyName: result.nom,
    address: result.adresse,
    phone: result.tel,
    email: result.email,
    ville: result.ville_name,
    img: result.image_url,
    category: result.category,
    welcomeMessage: result.description
  }
    return result;
}

export default {
  register,
  getAllService,
  getSousServiceFromService,
  setServiceActif,
  setSousServiceActif,
  getSousServiceActif,
  getCountSousServiceActif,
  getSousServiceWithParams,
  addSousService,
  deleteSousService,
  findByServiceId
};
