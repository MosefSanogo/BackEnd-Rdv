import database from "../config/database.js";
const create = async (data, image) => {
  const {
    nom,
    description,
    ville_id,
    adresse,
    category,
    sousServices,
    tel,
    email,
    password
  } = data;

  const connection = await database.getConnection();

  try {
    await connection.beginTransaction();

    // 1️⃣ Création service
    const [serviceResult] = await connection.execute(
      `INSERT INTO services
       (nom, description, ville_id, adresse, image_url, category,tel,email,password)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nom, description, ville_id, adresse, image, category, tel, email, password]
    );

    const serviceId = serviceResult.insertId;

    // 2️⃣ Si aucun sous-service → créer Service Principal
    if (!Array.isArray(sousServices) || sousServices.length === 0) {
      const [ssResult] = await connection.execute(
        `INSERT INTO sous_service (service_id, nom)
         VALUES (?, ?)`,
        [serviceId, "Service Principal"]
      );

      await connection.commit();

      return {
        service_id: serviceId,
        sous_service_id: ssResult.insertId
      };
    }

    // 3️⃣ Sinon, créer les sous-services fournis
    for (const ss of sousServices) {
      await connection.execute(
        `INSERT INTO sous_service (service_id, nom)
         VALUES (?, ?)`,
        [serviceId, ss.nom]
      );
    }

    await connection.commit();

    return { service_id: serviceId };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const createSousService = async (data) => {
    const [result] = await database.query(
        `INSERT INTO sous_service (service_id, nom)
         VALUES ? `,
        [data]
    );
    return { message: "Sous service ajouté avec succès" };
}

const findByNameCityAndAddress  = async (nom,id,adresse)=>{
    const [result] = await database.execute(
        `SELECT s.*, v.nom AS ville_name 
        FROM services s 
        INNER JOIN villes v ON s.ville_id = v.id 
        WHERE nom = ? AND ville_id = ? AND adresse = ?`,
        [nom,id,adresse]
    );

    return result[0];
}

const findAllService = async ()=>{
    const [row] = await database.execute(
        `SELECT s.*, v.nom AS ville_name 
        FROM services s 
        INNER JOIN villes v ON s.ville_id = v.id `,
    );

    return row;
}

const findByServiceId = async (serviceId)=>{
    const [row] = await database.execute(
        `SELECT s.*, v.nom as ville_name
        FROM services s 
        INNER JOIN villes v ON s.ville_id = v.id 
        WHERE s.id = ?`,
        [serviceId]
    );

    return row[0];
}

const findAllSousServiceFromServiceId = async (serviceId)=>{
    const [row] = await database.execute(
        `SELECT * FROM sous_service 
        WHERE service_id = ? 
        AND actif = 1
        `,
        [serviceId]
    );

    return row;
}

const setServiceActif = async (actif,serviceId)=>{
    const [result] = await database.execute(
        `UPDATE services 
        SET actif = ?
        WHERE id = ?
        `,
        [actif,serviceId]
    );

    return result
}

const setSousServiceActif = async (actif,serviceId)=>{
    const [result] = await database.execute(
        `UPDATE sous_service
        SET actif = ?
        WHERE id = ?
        `,
        [actif,serviceId]
    );

    return result
}

const getSousServiceActif = async (serviceId)=>{
    const [result] = await database.execute(
        `SELECT * FROM sous_service WHERE service_id = ? AND actif = 1`,
        [serviceId]
    );

    return result;
}

const getCountSousServiceActif = async (serviceId)=>{
    const [result] = await database.execute(
        `SELECT COUNT(*) as count FROM sous_service WHERE service_id = ? AND actif = 1`,
        [serviceId]
    );

    return result[0];
}

const getSousServiceWithParams = async (serviceId) => {
  const query = `SELECT
      ss.id,
      ss.nom AS name,
      v.nom AS localisation,
      s.category AS category,
      (
        SELECT COALESCE(SUM(h.capacity_heure), 0)
        FROM horaires_travail h
        WHERE h.sous_service_id = ss.id
      ) AS capacity,
      (
        SELECT COUNT(r.id)
        FROM reservation r
        WHERE r.sous_service_id = ss.id
          AND r.date >= CURDATE()
          AND r.date < CURDATE() + INTERVAL 1 DAY
      ) AS appointmentsToday,

      CASE
        WHEN ss.actif = 1 THEN 'active'
        ELSE 'inactive'
      END AS status

    FROM sous_service ss
    INNER JOIN services s ON s.id = ss.service_id
    INNER JOIN villes v ON v.id = s.ville_id
    WHERE ss.service_id = ?`;
    
  

  const [rows] = await database.execute(query, [serviceId]);

  return rows.map(row => ({
    id: String(row.id),
    name: row.name,
    localisation: row.localisation,
    category: row.category,
    status: row.status,
    capacity: Number(row.capacity),
    appointmentsToday: Number(row.appointmentsToday),
  }));
};

const deleteSousService = async (id) => {
  const connection = await database.getConnection();

  try {
    await connection.beginTransaction();
   const [result] = await connection.execute(
      `DELETE FROM sous_service WHERE id = ?`,
      [id]
    );
    await connection.execute(
      `DELETE FROM horaires_travail WHERE sous_service_id = ?`,
      [id]
    );
    await connection.execute(
      `DELETE FROM time_slots WHERE sous_service_id = ?`,
      [id]
    );
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};


export default{
    create,
    findByNameCityAndAddress,
    findAllService,
    findAllSousServiceFromServiceId,
    setServiceActif,
    setSousServiceActif,
    getSousServiceActif,
    getCountSousServiceActif,
    getSousServiceWithParams,
    createSousService,
    deleteSousService,
    findByServiceId,
}