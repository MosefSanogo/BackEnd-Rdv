import database from "../config/database.js";

const create = async (data)=>{
    const{service_id,sous_service_id,heure_debut,heure_fin} = data;
    const [row] = await database.execute(
        `
        INSERT INTO pauses
        (service_id,sous_service_id,heure_debut,heure_fin)
        VALUES(?,?,?,?)
        `,
        [service_id,sous_service_id,heure_debut,heure_fin]
    );

    return {id:row.insertId};
}

const findAllPausesBySousServiceId = async (serviceId) =>{
    const [rows] = await database.execute(
        `SELECT p.id,p.heure_debut,p.heure_fin,p.sous_service_id, s.nom as sous_service_name 
        FROM pauses p
        INNER JOIN sous_service s on s.id = p.sous_service_id 
        WHERE p.service_id = ?`,
        [serviceId]
    );

    return rows;
}

const deletePauseBySousServiceId = async (serviceId)=>{
    try {
    const [row] = await database.execute(
        `DELETE FROM pauses WHERE id  = ?`,
        [serviceId]
    );

    return row;
    } catch (error) {
        console.error("SQL ERROR:", error);
        throw error;
    }
}

export default{
    create,
    findAllPausesBySousServiceId,
    deletePauseBySousServiceId
}