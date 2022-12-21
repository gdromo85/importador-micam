import sql from "mssql";
require('dotenv').config();

let server = '';
if (process.env.DB_HOST !== undefined) server = process.env.DB_HOST;

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: server, 
  database: process.env.DB_NAME,
  parseJSON: true,
  options: { 
    encrypt: false,
    trustServerCertificate: true,
    } 
}
/*
DB_HOST=25.87.195.9
DB_USER=argensoft
DB_PASSWORD=Server3276
DB_NAME=BdTurnero
*/
export const getConnection = async () => {
  try {
    
    const pool = await sql.connect(sqlConfig);
    
    return pool;
  } catch (error) {
    console.error(error);
  }
};

export { sql };
