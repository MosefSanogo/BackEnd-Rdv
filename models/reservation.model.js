import database from '../config/database.js';

const ReservationModel = {

  create: async (data) => {
    const {
        citoyenId,
        serviceId,
        sousServiceId,
        timeSlotId,
        date,
        heure,
        qrToken
    } = data;

    const [result] = await database.execute(
      `
      INSERT INTO reservation
      (citoyen_id, service_id, sous_service_id, time_slot_id, date, heure, qr_token)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        citoyenId,
        serviceId,
        sousServiceId,
        timeSlotId,
        date,
        heure,
        qrToken
      ]
    );

    return {id: result.insertId};
  },

  findByDateAndService: async (date, serviceId) => {
    const [rows] = await database.execute(
      `
      SELECT r.*, c.nom, c.prenom, c.tel
      FROM reservation r
      INNER JOIN citoyens c ON c.id = r.citoyen_id
      WHERE r.service_id = ?
        AND r.date = ?
      ORDER BY r.heure ASC
      `,
      [serviceId, date]
    );

    return rows;
  },

  findByDateAndSousService: async (date,serviceId) => {
    const [rows] = await database.execute(
      `
      SELECT r.*, c.nom, c.prenom, c.tel
      FROM reservation r
      JOIN citoyens c ON c.id = r.citoyen_id
      WHERE r.sous_service_id = ?
        AND r.date = ?
      ORDER BY r.heure ASC
      `,
      [serviceId, date]
    );

    return rows;
  },

  updateStatus: async (reservationId, statut) => {
    const [result] = await database.execute(
      `
      UPDATE reservation
      SET statut = ?
      WHERE id = ?
      `,
      [statut, reservationId]
    );

    return result;
  },

  findByQrToken: async (qrToken) => {
    const [rows] = await database.execute(
      `
      SELECT r.*, s.nom AS service_nom
      FROM reservation r
      JOIN services s ON s.id = r.service_id
      WHERE r.qr_token = ?
      `,
      [qrToken]
    );

    return rows[0];
  }

};

export default ReservationModel;
