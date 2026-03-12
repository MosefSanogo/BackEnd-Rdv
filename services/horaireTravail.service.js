import horaireTravailModel from "../models/horaireTravail.model.js";

const register = async (data) => {
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

export default {
  register,
  setActif,
  getBySousServiceId,
};
