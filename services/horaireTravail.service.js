import horaireTravailModel from "../models/horaireTravail.model.js";

const register = async (data) => {
  const rows = await horaireTravailModel.findBySousService(data[0].sous_service_id)
  if(rows.length > 0){
    throw new Error("Vous avez déjà enregistré les horaires pour ce sous service")
  }
  const some = data.some(item => {
    return item.heure_debut >= item.heure_fin;
  });
  if (some) {
    throw new Error("Une ou plusieurs heures de début sont postérieures aux heures de fin");
  }
  return await horaireTravailModel.create(data);
};

const setActif = async (actif, id) => {
  const result = await horaireTravailModel.setActif(actif, id);
  if (result.affectedRows === 0) {
    throw new Error("Horaire introuvable");
  }

  return { message: "Horaire modifée avec succès" };
};
const joursMap = {
  0: "Lundi",
  1: "Mardi",
  2: "Mercredi",
  3: "Jeudi",
  4: "Vendredi",
  5: "Samedi",
  6: "Dimanche",
};
const getBySousServiceId = async (sousServiceId) => {
  const rows = await horaireTravailModel.findBySousService(sousServiceId);
  const rowsFormat = rows.map((row) => ({
    id: row.id.toString(),
    day: joursMap[row.jour_semaine],
    isActive: !!row.actif,
    startTime: row.heure_debut.slice(0, 5),
    endTime: row.heure_fin.slice(0, 5),
    capacity: row.capacity_heure,
  }));

  return rowsFormat;
};

const updateOne = async (id, updates) => {

  // ✅ Validation des valeurs
  if (updates.startTime && updates.endTime) {
    if (updates.startTime >= updates.endTime) {
      throw new Error('L\'heure de début doit être avant l\'heure de fin');
    }
  }

  if (updates.capacity !== undefined) {
    if (isNaN(updates.capacity) || updates.capacity < 0 || updates.capacity > 9999) {
      throw new Error('Capacité invalide (0-9999)');
    }
    updates.capacity = Math.floor(updates.capacity); // pas de décimales
  }

  if (updates.isActive !== undefined) {
    updates.isActive = Boolean(updates.isActive);
  }

  return await horaireTravailModel.updateOne(id, updates);
};

export default {
  register,
  setActif,
  getBySousServiceId,
  updateOne
};
