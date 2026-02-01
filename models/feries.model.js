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
        `SELECT * FROM jours_feries j
        WHERE id_service = ?
        `,
        [serviceId]
    );

    return row;
}

const create = async (data)=>{
    const{id_service,date,description} = data
    const [result] = await database.execute(
        `INSERT INTO jours_feries
        (id_service, date, description)
        VALUES(?,?,?)
        `,
        [id_service,date,description]
    );

    return result;
}


export default{
    findByServiceIdAndDate,
    findByServiceId,
    create
}