import { getConnection, sql } from "./dbSql";

export const getAviso = async () => {
  try {
    const pool = await getConnection();

    let result = await pool?.request().query("select top 2 * from Usuario");

    return result?.recordset;
  } catch (error) {
    console.log(error);
  }
};

export const getlogin = async (data: any) => {
  
  const { usuario, contraseña } = data;
  

  try {
    const pool = await getConnection();

    let result = await pool?.request()
      
      .input("NombreUsuario", sql.VarChar, usuario)
      .input("Contrasena", sql.VarChar, contraseña)
      
      .execute("spUsuarioValidarSel");
    
    return result?.recordset;
  } catch (error) {
    console.log('error BD',error);
  }
};
