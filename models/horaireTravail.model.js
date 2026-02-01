import database from "../config/database.js";

const findBySousServiceAndDay = async (sousServiceId, jourSemaine) => {
  const [rows] = await database.execute(
    `SELECT * FROM horaires_travail
     WHERE sous_service_id = ?
       AND jour_semaine = ?
       AND actif = 1`,
    [sousServiceId, jourSemaine]
  );
  return rows[0];
};

const setActif = async (actif,id)=>{
    const [result] = await database.execute(
        `UPDATE horaires_travail
        SET actif = ?
        WHERE id = ?`,
        [actif,id]
    );

    return result;
}

const create = async (data)=>{
    const {service_id,sous_service_id,jour_semaine,heure_debut,heure_fin,capacity_heure} = data;
    const [result] = await database.execute(
        `INSERT INTO horaires_travail
        (service_id, sous_service_id, jour_semaine,heure_debut,heure_fin,capacity_heure)
        VALUES (?,?,?,?,?,?)`,
        [service_id,sous_service_id,jour_semaine,heure_debut,heure_fin,capacity_heure]
    );

    return {id: result.insertId, message: "Horaire ajoutée avec succès"}
}

export default{
    findBySousServiceAndDay,
    setActif,
    create
}