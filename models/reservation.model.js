import database from "../config/database.js";

const ReservationModel = {
  create: async (data) => {
    const {
      citoyenId,
      serviceId,
      sousServiceId,
      timeSlotId,
      date,
      heure,
      qrToken,
    } = data;

    const [result] = await database.execute(
      `
      INSERT INTO reservation
      (citoyen_id, service_id, sous_service_id, time_slot_id, date, heure, qr_token)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [citoyenId, serviceId, sousServiceId, timeSlotId, date, heure, qrToken],
    );

    return { id: result.insertId };
  },

  findByDateAndService: async (date, serviceId) => {
    const [rows] = await database.execute(
      `
      SELECT r.id, r.heure, r.statut, r.date, c.nom, c.prenom, c.tel, s.nom AS sous_service_nom
      FROM reservation r
      INNER JOIN citoyens c ON c.id = r.citoyen_id
      INNER JOIN sous_service s ON s.id = r.sous_service_id
      WHERE r.service_id = ?
        AND r.date = ?
      ORDER BY r.heure ASC
      `,
      [serviceId, date],
    );

    return rows;
  },

  findByDateAndServiceGroupByTime: async (date, serviceId) => {
    const [rows] = await database.execute(
      `
      SELECT
        CONCAT(LPAD(HOUR(heure), 2, '0'), ':00') AS time,
        COUNT(*) AS total_reservations
      FROM reservation
      WHERE service_id = ?
        AND date = ?
      GROUP BY CONCAT(LPAD(HOUR(heure), 2, '0'), ':00')
      ORDER BY time ASC
      `,
      [serviceId, date],
    );
    return rows;
  },
  findTimeSlotCapacityByDateAndServiceGroupByTime: async (serviceId) => {
    const [rows] = await database.execute(
      `
      SELECT
        CONCAT(LPAD(HOUR(heure), 2, '0'), ':00') AS time,
        SUM(capacity_total) AS capacity
      FROM time_slots
      WHERE service_id = ?
      GROUP BY CONCAT(LPAD(HOUR(heure), 2, '0'), ':00')
      ORDER BY time ASC
      `,
      [serviceId],
    );
    return rows;
  },

  findByDateAndSousService: async (date, serviceId) => {
    const [rows] = await database.execute(
      `
      SELECT r.*, c.nom, c.prenom, c.tel
      FROM reservation r
      JOIN citoyens c ON c.id = r.citoyen_id
      WHERE r.sous_service_id = ?
        AND r.date = ?
      ORDER BY r.heure ASC
      `,
      [serviceId, date],
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
      [statut, reservationId],
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
      [qrToken],
    );

    return rows[0];
  },

  findAllClientReservation: async (serviceId) => {
    const [row] = await database.execute(
      `
      SELECT 
          c.id,
          CONCAT(c.nom, ' ', c.prenom) AS fullName,
          c.tel as phone,
          COUNT(r.id) AS totalAppointments,
          DATE_FORMAT(MAX(r.date), '%d/%m/%Y') AS lastAppointment,
          SUM(r.statut = 'absent') AS absences,
          GROUP_CONCAT(DISTINCT s.nom) AS services,
          DATE(c.created_at) AS createdAt,
          CASE 
              WHEN MAX(r.date) >= CURDATE() - INTERVAL 6 MONTH 
              THEN 'active'
              ELSE 'inactive'
          END AS status
      FROM citoyens c
      LEFT JOIN reservation r ON r.citoyen_id = c.id
      LEFT JOIN sous_service s ON s.id = r.sous_service_id
      WHERE r.service_id = ?
      GROUP BY c.id;
      `,
      [serviceId],
    );

    return row;
  },
  findClientReservation: async (clientId) => {
    const [rows] = await database.execute(
      `
      SELECT 
      DATE_FORMAT(r.date, '%d/%m/%Y') as date,
      r.heure as time,
      s.nom as service,
      r.statut as status
      FROM reservation r
      INNER JOIN sous_service s on s.id = r.sous_service_id
      WHERE r.citoyen_id = ?
      `,
      [clientId],
    );
    return rows;
  },
  findStatisticByServiceId: async (serviceId) => {
    const query = `SELECT

    (SELECT COUNT(*) 
     FROM reservation r
     WHERE r.service_id = ?
       AND DATE(r.date) = CURDATE()
    ) AS rdv_aujourdhui,

    (SELECT COUNT(*)
     FROM reservation r
     WHERE r.service_id = ?
       AND MONTH(r.date) = MONTH(CURDATE())
       AND YEAR(r.date) = YEAR(CURDATE())
    ) AS rdv_mois,

    (SELECT COUNT(DISTINCT r.citoyen_id)
     FROM reservation r
     WHERE r.service_id = ?
    ) AS clients_uniques,

    (SELECT 
        CONCAT(
            ROUND(
                (SUM(CASE WHEN r.statut = 'absent' THEN 1 ELSE 0 END) 
                / COUNT(*)) * 100
            , 0),
        '%')
     FROM reservation r
     WHERE r.service_id = ?
    ) AS taux_absence,

    (SELECT 
    CONCAT(
            ROUND(
                (
                    SUM(CASE WHEN c.capacity_restante = 0 THEN 1 ELSE 0 END)
                    / NULLIF(COUNT(*), 0)
                ) * 100
            , 0),
        '%')
    FROM time_slots c
    WHERE c.service_id = ?
    ) AS creneaux_remplis,

    (SELECT s.nom
     FROM reservation r
     JOIN sous_service s ON r.sous_service_id = s.id
     WHERE r.service_id = ?
     GROUP BY s.id
     ORDER BY COUNT(*) DESC
     LIMIT 1
    ) AS top_service;`;

    const [rows] = await database.execute(query, [
      serviceId,
      serviceId,
      serviceId,
      serviceId,
      serviceId,
      serviceId,
    ]);

    const stats = rows[0];
    return [
      { id: "1", label: "RDV Aujourd'hui", value: stats.rdv_aujourdhui },
      { id: "2", label: "RDV ce mois", value: stats.rdv_mois },
      { id: "3", label: "Clients uniques", value: stats.clients_uniques },
      { id: "4", label: "Taux d'absence", value: stats.taux_absence || "0%" },
      {
        id: "5",
        label: "Créneaux remplis",
        value: stats.creneaux_remplis || "0%",
      },
      { id: "6", label: "Top service", value: stats.top_service || "-" },
    ];
  },
  findHourlyDataByServiceIdAndDate: async (serviceId, date) => {
    const query = `
    SELECT
        CONCAT(LPAD(HOUR(r.heure), 2, '0'), ':00') AS time,
        COUNT(r.id) AS appointments,
        (SELECT SUM(capacity_total) 
          FROM time_slots 
          WHERE service_id = ? 
          GROUP BY HOUR(heure)
          ORDER BY HOUR(heure) ASC) AS capacity
    FROM reservation r
    WHERE r.service_id = ?
    AND r.date = ?
    GROUP BY HOUR(r.heure) 
    ORDER BY HOUR(r.heure) ASC
  `;

    const [rows] = await database.execute(query, [date, serviceId]);
    return rows;
  },
  findDayServiceDistributionByServiceIdAndDate: async (serviceId, date) => {
    const query = `
      SELECT 
        COUNT(r.id) AS value,
        s.nom AS label
      FROM reservation r
      JOIN sous_service s ON r.sous_service_id = s.id
      WHERE r.service_id = ? AND r.date = ?
      GROUP BY s.id, s.nom
    `;
    const [rows] = await database.execute(query, [serviceId, date]);
    return rows;
  },
  findWeeklyDataByServiceIdAndDate: async (serviceId, date) => {
    const query = `
             SELECT 
                CASE WEEKDAY(d.date)
                    WHEN 0 THEN 'Lundi'
                    WHEN 1 THEN 'Mardi'
                    WHEN 2 THEN 'Mercredi'
                    WHEN 3 THEN 'Jeudi'
                    WHEN 4 THEN 'Vendredi'
                    WHEN 5 THEN 'Samedi'
                    WHEN 6 THEN 'Dimanche'
                END AS hour,
                COUNT(r.id) AS appointments,
                COALESCE(TIMESTAMPDIFF(HOUR, h.heure_debut, h.heure_fin) * h.capacity_heure, 0) AS capacity
            FROM (
                SELECT DATE_SUB(?, INTERVAL WEEKDAY(?) DAY) + INTERVAL seq DAY AS date
                FROM (
                    SELECT 0 seq UNION SELECT 1 UNION SELECT 2 UNION
                    SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6
                ) s
            ) d
            LEFT JOIN horaires_travail h
                ON h.service_id = ?
                AND h.jour_semaine = WEEKDAY(d.date)
                AND h.actif = 1
            LEFT JOIN reservation r
                ON r.service_id = h.service_id
                AND r.date = d.date
            GROUP BY d.date,h.heure_debut, h.heure_fin, h.capacity_heure
            ORDER BY d.date;
    `;
    const [rows] = await database.execute(query, [date, date, serviceId]);
    return rows;
  },
  findWeeklyServiceDistributionByServiceIdAndDate: async (serviceId, date) => {
    const query = `
      SELECT 
      COUNT(r.id) AS value,
      s.nom AS label
    FROM reservation r
    JOIN sous_service s 
        ON r.sous_service_id = s.id
    WHERE r.service_id = ?
    AND r.date BETWEEN 
        DATE_SUB(?, INTERVAL WEEKDAY(?) DAY)
        AND DATE_ADD(DATE_SUB(?, INTERVAL WEEKDAY(?) DAY), INTERVAL 6 DAY)
    GROUP BY s.id
    ORDER BY value DESC;
    `;
    const [rows] = await database.execute(query, [
      serviceId,
      date,
      date,
      date,
      date,
    ]);
    return rows;
  },

  findMonthlyServiceDistributionByServiceIdAndDate: async (serviceId, date) => {
    const query = `
    WITH RECURSIVE weeks_of_month AS (
        SELECT 
            DATE(CONCAT(YEAR(?), '-', MONTH(?), '-01')) AS week_start,
            DATE(CONCAT(YEAR(?), '-', MONTH(?), '-01')) + INTERVAL 6 DAY AS week_end,
            1 AS week_number
        
        UNION ALL
        
        SELECT 
            week_start + INTERVAL 7 DAY,
            week_end + INTERVAL 7 DAY,
            week_number + 1
        FROM weeks_of_month
        WHERE week_start + INTERVAL 7 DAY <= LAST_DAY(DATE(CONCAT(YEAR(?), '-', MONTH(?), '-01')))
    )
    SELECT
      COUNT(r.id) AS value,
      COALESCE(s.nom, 'Sans service') AS label    -- Gérer les NULL
    FROM weeks_of_month w
    LEFT JOIN reservation r 
        ON r.date BETWEEN w.week_start 
            AND CASE 
                WHEN w.week_end > LAST_DAY(DATE(CONCAT(YEAR(?), '-', MONTH(?), '-01')))
                THEN LAST_DAY(DATE(CONCAT(YEAR(?), '-', MONTH(?), '-01')))
                ELSE w.week_end 
            END
        AND r.service_id = ?
        AND YEAR(r.date) = YEAR(?) 
        AND MONTH(r.date) = MONTH(?)  
    INNER JOIN sous_service s ON s.id = r.sous_service_id
    GROUP BY s.nom  
    ORDER BY value DESC;
    `;

    const [rows] = await database.execute(query, [
      // Pour week_start
      date,
      date, // YEAR(date), MONTH(date)
      date,
      date, // Pour week_end
      date,
      date, // Pour LAST_DAY dans WHERE
      // Pour le CASE dans la jointure
      date,
      date, // 1er LAST_DAY
      date,
      date, // 2ème LAST_DAY
      serviceId, // service_id
      date,
      date, // YEAR(r.date), MONTH(r.date)
    ]);

    return rows;
  },

  findYearlyServiceDistributionByServiceIdAndDate: async (serviceId, date) => {
    const query = `
    WITH RECURSIVE months_of_year AS (
    SELECT 
        1 AS month_number,
        DATE(CONCAT(?, '-01-01')) AS month_start,
        LAST_DAY(DATE(CONCAT(?, '-01-01'))) AS month_end
    
    UNION ALL
    
    SELECT 
        month_number + 1,
        DATE(CONCAT(?, '-', LPAD(month_number + 1, 2, '0'), '-01')),
        LAST_DAY(DATE(CONCAT(?, '-', LPAD(month_number + 1, 2, '0'), '-01')))
    FROM months_of_year
    WHERE month_number < 12
    )
    SELECT
        COUNT(r.id) AS value, 
        COALESCE(s.nom, 'Sans service') AS label -- Gérer les NULL
    FROM months_of_year w
    LEFT JOIN reservation r 
        ON r.date BETWEEN w.month_start AND w.month_end
        AND r.service_id = ?
        AND YEAR(r.date) = YEAR(?) 
        AND MONTH(r.date) = w.month_number  
    INNER JOIN sous_service s ON s.id = r.sous_service_id
    GROUP BY s.nom  
    ORDER BY value DESC;
    `;
    const [rows] = await database.execute(query, [
      date,
      date, // YEAR(date)
      date,
      date, // Pour les mois suivants
      serviceId, // service_id
      date,
    ]);
    return rows;
  },  

  findMonthlyByServiceIdAndDate: async (
    serviceId,
    date,
  ) => {
    const query = `
    WITH RECURSIVE weeks_of_month AS (
        SELECT 
            DATE(CONCAT(YEAR(?), '-', MONTH(?), '-01')) AS week_start,
            DATE(CONCAT(YEAR(?), '-', MONTH(?), '-01')) + INTERVAL 6 DAY AS week_end,
            1 AS week_number
        
        UNION ALL
        
        SELECT 
            week_start + INTERVAL 7 DAY,
            week_end + INTERVAL 7 DAY,
            week_number + 1
        FROM weeks_of_month
        WHERE week_start + INTERVAL 7 DAY <= LAST_DAY(?)
    )
    SELECT 
        CONCAT('Semaine ', w.week_number) AS month,
        COUNT(r.id) AS appointments

    FROM weeks_of_month w
    LEFT JOIN reservation r
        ON r.date BETWEEN w.week_start 
            AND CASE 
                WHEN w.week_end > LAST_DAY(?) 
                THEN LAST_DAY(?)
                ELSE w.week_end 
            END
        AND r.service_id = ? 

    GROUP BY w.week_number
    ORDER BY w.week_number;
    `;

    const [rows] = await database.execute(query, [
      date,
      date,
      date,
      date,
      date,
      date,
      date,
      serviceId,
    ]);
    return rows;
  },
  findYearlyByServiceIdAndDate: async (
    serviceId,
    date,
  ) => {
    const query = `
    WITH RECURSIVE months_of_year AS (
    SELECT 
        1 AS month_number,
        DATE(CONCAT(YEAR(?), '-01-01')) AS month_start,
        LAST_DAY(DATE(CONCAT(YEAR(?), '-01-01'))) AS month_end
    
    UNION ALL
    
    SELECT 
        month_number + 1,
        DATE(CONCAT(YEAR(?), '-', LPAD(month_number + 1, 2, '0'), '-01')),
        LAST_DAY(DATE(CONCAT(YEAR(?), '-', LPAD(month_number + 1, 2, '0'), '-01')))
    FROM months_of_year
    WHERE month_number < 12
    )
    SELECT 
        CASE m.month_number
            WHEN 1 THEN 'Janvier'
            WHEN 2 THEN 'Février'
            WHEN 3 THEN 'Mars'
            WHEN 4 THEN 'Avril'
            WHEN 5 THEN 'Mai'
            WHEN 6 THEN 'Juin'
            WHEN 7 THEN 'Juillet'
            WHEN 8 THEN 'Août'
            WHEN 9 THEN 'Septembre'
            WHEN 10 THEN 'Octobre'
            WHEN 11 THEN 'Novembre'
            WHEN 12 THEN 'Décembre'
        END AS month,
        COUNT(r.id) AS appointments
    FROM months_of_year m
    LEFT JOIN reservation r
        ON r.date BETWEEN m.month_start AND m.month_end
        AND r.service_id = ?
        AND YEAR(r.date) = YEAR(?)
        AND MONTH(r.date) = m.month_number
    GROUP BY m.month_number, m.month_start, m.month_end
    ORDER BY m.month_number;
    `;

    const [rows] = await database.execute(query, [
      date,
      date,
      date,
      date,
      serviceId,
      date,
    ]);
    return rows;
  },
};

export default ReservationModel;
