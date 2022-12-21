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

export const getAvisoProcedure = async (data: any) => {
  /**
    CREATE procedure [dbo].[spAvisoSel] 
    @FechaDesde			smalldatetime = null,
    @FechaHasta			smalldatetime = null,
    @SucursalId            int = null
   */
  const { fechaDesde, fechaHasta, sucursalId } = data;

  try {
    const pool = await getConnection();

    let result = await pool?.request()
      .input("FechaDesde", sql.VarChar, fechaDesde)
      .input("FechaHasta", sql.VarChar, fechaHasta)
      .input("SucursalId", sql.Int, sucursalId)
      .execute("spAvisoSel");

    return result?.recordset;
  } catch (error) {
    console.log(error);
  }
};
