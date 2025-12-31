import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}); 

export const testDBConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ MySQL connecté");
    connection.release();
  } catch (error) {
    console.error("❌ Erreur MySQL :", error);
  }
};
