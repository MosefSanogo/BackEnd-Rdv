import database from "../config/database.js";
const create = async (data) => {
  const {
    serviceId,
    sousServiceId,
    date,
    heure,
    capacityTotale,
    capacityRestante,
  } = data;
  const [result] = await database.execute(
    `INSERT INTO time_slots 
         (service_id, sous_service_id, date, heure, capacity_total, capacity_restante)
         VALUES(?,?,?,?,?,?)
        `,
    [serviceId, sousServiceId, date, heure, capacityTotale, capacityRestante],
  );

  return {
    id: result.insertId,
    message: "Créneau ajouté avec succès",
  };
};

const findByDateAndSousService = async (date, sousServiceId) => {
  const [rows] = await database.execute(
    `SELECT * FROM time_slots 
     WHERE date = ? AND sous_service_id = ?
     ORDER BY heure`,
    [date, sousServiceId],
  );
  return rows;
};

const bulkInsert = async (slots) => {
  const values = slots.map((s) => [
    s.service_id,
    s.sous_service_id,
    s.date,
    s.heure,
    s.capacite_totale,
    s.capacite_restante,
  ]);

  const sql = `
    INSERT INTO time_slots
    (service_id, sous_service_id, date, heure, capacity_total, capacity_restante)
    VALUES ?
  `;

  await database.query(sql, [values]);
};

const findByServiceAndSousServiceAndDate = async (
  serviceId,
  sousServiceId,
  date,
) => {
  let rows;
  if (sousServiceId === 0 || sousServiceId === "0") {
    [rows] = await database.execute(
      `SELECT
      GROUP_CONCAT(id) AS ids,
      CONCAT(LPAD(HOUR(heure), 2, '0'), ':00') AS time,
      SUM(capacity_restante) AS available,
      SUM(capacity_total) AS capacity
    FROM time_slots
    WHERE service_id = ? AND date = ?
    GROUP BY CONCAT(LPAD(HOUR(heure), 2, '0'), ':00')
    ORDER BY time;`,
      [serviceId, date],
    );
  } else {
    [rows] = await database.execute(
      `SELECT
      GROUP_CONCAT(id) AS ids,
      CONCAT(LPAD(HOUR(heure), 2, '0'), ':00') AS time,
      SUM(capacity_restante) AS available,
      SUM(capacity_total) AS capacity
    FROM time_slots
    WHERE service_id = ? AND sous_service_id = ? AND date = ?
    GROUP BY CONCAT(LPAD(HOUR(heure), 2, '0'), ':00')
    ORDER BY time;`,
      [serviceId, sousServiceId, date],
    );
  }
  const [countRows] = await database.execute(
    `SELECT COUNT(*) as total_creneaux,
          SUM(capacity_restante > 0) as total_disponibles
   FROM time_slots
   WHERE service_id = ? AND sous_service_id = ? AND date = ?`,
    [serviceId, sousServiceId, date],
  );
  return { timeslots: rows, count: countRows[0] };
};

const decrementCapacity = async (timeSlotId) => {
  const [result] = await database.execute(
    `
    UPDATE time_slots
    SET capacity_restante = capacity_restante - 1
    WHERE id = ?
      AND capacity_restante > 0
    `,
    [timeSlotId],
  );

  return result;
};

const incrementCapacity = async (timeSlotId) => {
  const [result] = await database.execute(
    `
    UPDATE time_slots
    SET capacity_restante = capacity_restante + 1
    WHERE id = ?
      AND capacity_restante > 0
    `,
    [timeSlotId],
  );

  return result;
};

export default {
  create,
  decrementCapacity,
  incrementCapacity,
  findByDateAndSousService,
  bulkInsert,
  findByServiceAndSousServiceAndDate,
};
