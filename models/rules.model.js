import database from "../config/database.js";
const create = async (data) => {
  try {
    const { service_id, delay_min, delay_max, client_max, delay_cancel } = data;

    const [result] = await database.execute(
      `INSERT INTO rules
      (service_id, delay_min, delay_max, client_max, delay_cancel)
      VALUES(?,?,?,?,?)`,
      [service_id, delay_min, delay_max, client_max, delay_cancel]
    );

    return { result, message: "Règle ajoutée avec succès" };

  } catch (error) {
    console.error("SQL ERROR:", error);
    throw error;
  }
};
const findByServiceId = async (serviceId) => {
    const [row] = await database.execute(
        `SELECT * FROM rules
        WHERE service_id = ?
        `,
        [serviceId]
    );
    return row[0];
}
export default {
    create,
    findByServiceId
}