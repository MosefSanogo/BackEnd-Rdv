import database from "../config/database.js";

const findByTelephone = async (telephone) => {
  const [row] = await database.execute("SELECT * FROM citoyens WHERE tel = ?", [
    telephone,
  ]);
  return row[0];
};
const create = async (data) => {
  const { nom, prenom, telephone } = data;
  const [result] = await database.execute(
    `INSERT INTO citoyens 
            (nom, prenom, tel)
            VALUES (?, ?, ?)`,
    [nom, prenom, telephone],
  );
  return { id: result.insertId, nom, prenom, telephone };
};
const findAll = async () => {
  const [row] = await database.execute("SELECT * FROM citoyens");
  return row;
};

const deleteById = async (id) => {
  const [result] = await database.execute("DELETE FROM citoyens WHERE id = ?", [
    id,
  ]);

  return result;
};
const getAllClientForService = async (serviceId) => {
  const [result] = await database.execute(
    `SELECT c.*
        FROM citoyens c
        WHERE EXISTS (
            SELECT 1
            FROM reservation r
            WHERE r.citoyen_id = c.id
            AND r.service_id = ?
        );`,
    [serviceId],
  );
  return result;
};
const getCountClientForService = async (serviceId) => {
  const [result] = await database.execute(
    `SELECT COUNT(*) as count
        FROM citoyens c
        WHERE EXISTS (
            SELECT 1
            FROM reservation r
            WHERE r.citoyen_id = c.id
            AND r.service_id = ?
        );`,
    [serviceId],
  );
  return result[0].count;
};
export default {
  findByTelephone,
  create,
  findAll,
  deleteById,
  getAllClientForService,
  getCountClientForService
};
