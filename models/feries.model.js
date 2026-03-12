import database from "../config/database.js";

const findByServiceIdAndDate = async (date,serviceId)=>{
    const [row] = await database.execute(
        `SELECT * FROM jours_feries
        WHERE id_service = ?
        AND date = ?
        `,
        [serviceId,date]
    );

    return row[0];
}

const findByServiceId = async (serviceId)=>{
    const [row] = await database.execute(
        `SELECT id,DATE_FORMAT(date, '%d/%m/%Y') as date, description as label, type FROM jours_feries j
        WHERE id_service = ?
        `,
        [serviceId]
    );

    return row;
}

const create = async (data)=>{
    const{id_service,date,description,type} = data
    const [result] = await database.execute(
        `INSERT INTO jours_feries
        (id_service, date, description,type)
        VALUES(?,?,?,?)
        `,
        [id_service,date,description,type]
    );

    return result;
}

const deleteFerie = async (id)=>{
    const [result] = await database.execute(
        `DELETE FROM jours_feries
         WHERE id = ?`,
         [id]
    );
    return {message: "Jour férié supprimé avec succès"};
}


export default{
    findByServiceIdAndDate,
    findByServiceId,
    create,
    deleteFerie
}