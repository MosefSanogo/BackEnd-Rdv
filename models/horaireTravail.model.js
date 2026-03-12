import database from "../config/database.js";

const findBySousServiceAndDay = async (sousServiceId, jourSemaine) => {
  const [rows] = await database.execute(
    `SELECT * FROM horaires_travail
     WHERE sous_service_id = ?
       AND jour_semaine = ?
       AND actif = 1`,
    [sousServiceId, jourSemaine],
  );
  return rows[0];
};

const findBySousService = async (sousServiceId) => {
  const [rows] = await database.execute(
    `SELECT * FROM horaires_travail
     WHERE sous_service_id = ?
       AND actif = 1`,
    [sousServiceId],
  );
  return rows;
};

const setActif = async (actif, id) => {
  const [result] = await database.execute(
    `UPDATE horaires_travail
        SET actif = ?
        WHERE id = ?`,
    [actif, id],
  );

  return result;
};

const create = async (data) => {
  try {
    // Transformer le tableau d'objets en tableau de tableaux
    // L'ordre des éléments doit correspondre EXACTEMENT à l'ordre des colonnes dans INSERT INTO
    const values = data.map((item) => [
      item.service_id,
      item.sous_service_id,
      item.jour_semaine,
      item.heure_debut,
      item.heure_fin,
      item.capacity_heure,
    ]);

    const [result] = await database.query(
      `INSERT INTO horaires_travail 
       (service_id, sous_service_id, jour_semaine, heure_debut, heure_fin, capacity_heure) 
       VALUES ?`,
      [values], // Note : on passe [values] (un tableau contenant le tableau de tableaux)
    );

    return {
      affectedRows: result.affectedRows,
      message: "Horaires ajoutées avec succès",
    };
  } catch (error) {
    console.error("SQL ERROR:", error);
    throw error;
  }
};

export default {
  findBySousServiceAndDay,
  setActif,
  create,
  findBySousService,
};
