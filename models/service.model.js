import database from "../config/database.js";
const create = async (data, image) => {
  const {
    nom,
    description,
    ville_id,
    adresse,
    category,
    sousServices
  } = data;

  const connection = await database.getConnection();

  try {
    await connection.beginTransaction();

    // 1️⃣ Création service
    const [serviceResult] = await connection.execute(
      `INSERT INTO services
       (nom, description, ville_id, adresse, image_url, category)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nom, description, ville_id, adresse, image, category]
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

const findByNameCityAndAddress  = async (nom,id,adresse)=>{
    const [result] = await database.execute(
        'SELECT * FROM services WHERE nom = ? AND ville_id = ? AND adresse = ?',
        [nom,id,adresse]
    );

    return result[0];
}

const findAllService = async ()=>{
    const [row] = await database.execute(
        `SELECT * FROM services 
        WHERE actif = 1
        `,
    );

    return row;
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

export default{
    create,
    findByNameCityAndAddress,
    findAllService,
    findAllSousServiceFromServiceId,
    setServiceActif,
    setSousServiceActif 
}