import database from "../config/database.js";

const login = async (email)=>{
    const connection = await database.getConnection();
    try {
        const [row] = await connection.execute(
            `SELECT s.id, s.password, s.nom, s.email,s.tel,s.description,s.adresse,s.image_url,s.category, v.nom AS ville FROM services s
            JOIN villes v ON s.ville_id = v.id
            WHERE s.email = ?`,
            [email]
        );
        return row[0];
    }catch (error) {
        console.error("SQL ERROR:", error);
        throw error;
    } finally { 
        connection.release();
    }
}

export default {
    login
}