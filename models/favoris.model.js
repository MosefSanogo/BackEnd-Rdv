import database from "../config/database.js";

const register = async (data) => {
  try {
    const { serviceId, citoyenId } = data;
    const [result] = await database.execute(
      `INSERT INTO favoris
            (service_id, citoyen_id)
        VALUES(?,?)`,
      [serviceId, citoyenId],
    );

    return { id: result.insertId };
  } catch (error) {
    console.log(error);
  }
};

const findAllByCitoyenId = async (id) => {
  try {
    const [rows] = await database.execute(
      `SELECT * FROM favoris WHERE citoyen_id = ?`,
      [id],
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
};

const findAllWithService = async (id) => {
  try {
    const [rows] = await database.execute(
      `SELECT
              f.id as favorisId,
              f.service_id,
              f.citoyen_id,
              s.id as id,
              s.nom,
              s.description,
              s.ville_id,
              s.adresse,
              s.image_url,
              s.category,
              s.tel,
              s.email,
              s.actif,
              s.created_at
            FROM favoris f
            JOIN services s on s.id = f.service_id
            WHERE f.citoyen_id = ?`,
      [id],
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
};

const deleteByServiceIdANDCitoyenId = async (citoyenId, serviceId) => {
  try {
    const [result] = await database.execute(
      `DELETE FROM favoris WHERE service_id = ? AND citoyen_id = ?`,
      [serviceId, citoyenId],
    );

    return result;
  } catch (error) {
    console.log(error);
  }
};

export default {
  register,
  findAllByCitoyenId,
  deleteByServiceIdANDCitoyenId,
  findAllWithService
};
