import { getConnection, sql } from "./dbSql";
import { Importacion } from "../model/model.importacion";
import dayjs from "dayjs";

export const getAviso = async () => {
  try {
    const pool = await getConnection();

    let result = await pool?.request().query("select top 2 * from Usuario");

    return result?.recordset;
  } catch (error) {
    console.log(error);
  }
};

export const getValidarImportacionXls = async (data: Importacion) => {
  
  /**
    alter procedure spValidarImportacionXls
  @nroAutorizacion				varchar (20),
  @isMicam						bit,
  @isInternado					bit,
  @fechaAutorizacion			smalldatetime,
  @fechaEfectivizacion			smalldatetime,
  @cuitPrescriptor				varchar (20),
  @cuitEfector					varchar (20) = null,
  @matriculaPrescriptor			varchar (20),
  @matriculaEfector				varchar (20),
  @diagnostico					varchar (20),
  @documentoAfiliado			varchar (20) = null,
  @nroAfiliado					varchar (20) = null,
  @codigoPractica				varchar (20),
  @cantidad						int,
  @coseguro						int,
  @montoFacturado				int
   */
  

  try {
    const pool = await getConnection();
    
    let result = await pool?.request()
      
      .input("nroAutorizacion", sql.Int, data.nroAutorizacion)
      .input("isMicam", sql.Bit, data.isMicam)
      .input("isInternado", sql.Bit, data.isInternado)
      .input("fechaAutorizacion", sql.Date, new Date(dayjs(data.fechaAutorizacion.toString()).format('MM/DD/YYYY')))
      .input("fechaEfectivizacion", sql.Date, data.fechaEfectivizacion !== 'NULL' &&  data.fechaEfectivizacion !== undefined ? 
                                new Date(dayjs(data.fechaEfectivizacion.toString()).format('MM/DD/YYYY'))
                              :
                                null)
      .input("cuitPrescriptor", sql.VarChar, data.cuitPrescriptor.toString())
      .input("cuitEfector", sql.VarChar, data.cuitEfector.toString())
      .input("matriculaPrescriptor", sql.VarChar, data.matriculaPrescriptor.toString())
      .input("matriculaEfector", sql.VarChar, data.matriculaEfector.toString())
      .input("diagnostico", sql.VarChar, data.diagnostico)
      .input("documentoAfiliado", sql.VarChar, data.documentoAfiliado !== undefined ? data.documentoAfiliado.toString() : null)
      .input("nroAfiliado", sql.VarChar, data.nroAfiliado !== undefined ? data.nroAfiliado.toString() : null)
      .input("codigoPractica", sql.VarChar, data.codigoPractica.toString())
      .input("cantidad", sql.Int, data.cantidad)
      .input("coseguro", sql.Int, data.coseguro)
      .input("montoFacturado", sql.Int, data.montoFacturado)

      .execute("spValidarImportacionXls");
    

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const insImportacionXls = async (data: Importacion, usuario: number, nroFactura: string ) => {
  
  /**
    alter procedure spImportacionXlsIns
  @nroFactura					varchar (100),
  @usuario						int,
  @nroAutorizacion				varchar (20),
  @isMicam						bit,
  @isInternado					bit,
  @fechaAutorizacion			smalldatetime,
  @fechaEfectivizacion			smalldatetime,
  @cuitPrescriptor				varchar (20),
  @cuitEfector					varchar (20)= null,
  @matriculaPrescriptor			varchar (20),
  @matriculaEfector				varchar (20),
  @diagnostico					varchar (20),
  @documentoAfiliado			varchar (20) = null,
  @nroAfiliado					varchar (20) = null,
  @codigoPractica				varchar (20),
  @cantidad						int,
  @coseguro						int,
  @montoFacturado				int
   */
  

  try {
    const pool = await getConnection();
    
    let result = await pool?.request()
      .input("nroFactura", sql.VarChar, nroFactura)
      .input("usuario", sql.Int, usuario)
      .input("nroAutorizacion", sql.Int, data.nroAutorizacion)
      .input("isMicam", sql.Bit, data.isMicam)
      .input("isInternado", sql.Bit, data.isInternado)
      .input("fechaAutorizacion", sql.Date, new Date(dayjs(data.fechaAutorizacion.toString()).format('MM/DD/YYYY')))
      .input("fechaEfectivizacion", sql.Date, data.fechaEfectivizacion !== 'NULL' &&  data.fechaEfectivizacion !== undefined ? 
                                new Date(dayjs(data.fechaEfectivizacion.toString()).format('MM/DD/YYYY'))
                              :
                                null)
      .input("cuitPrescriptor", sql.VarChar, data.cuitPrescriptor.toString())
      .input("cuitEfector", sql.VarChar, data.cuitEfector.toString())
      .input("matriculaPrescriptor", sql.VarChar, data.matriculaPrescriptor.toString())
      .input("matriculaEfector", sql.VarChar, data.matriculaEfector.toString())
      .input("diagnostico", sql.VarChar, data.diagnostico)
      .input("documentoAfiliado", sql.VarChar, data.documentoAfiliado !== undefined ? data.documentoAfiliado.toString() : null)
      .input("nroAfiliado", sql.VarChar, data.nroAfiliado !== undefined ? data.nroAfiliado.toString() : null)
      .input("codigoPractica", sql.VarChar, data.codigoPractica.toString())
      .input("cantidad", sql.Int, data.cantidad)
      .input("coseguro", sql.Int, data.coseguro)
      .input("montoFacturado", sql.Int, data.montoFacturado)

      .execute("spImportacionXlsIns");
    

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getFacturasXUsuario = async (usuario: number ) => {
  
  /**
    alter procedure spFacturasXUsuario
  @Usuario int
   */
  

  try {
    const pool = await getConnection();
    
    let result = await pool?.request()
      
      .input("usuario", sql.Int, usuario)
      
      .execute("spFacturasXUsuario");
    
        
    return result?.recordset || [];
  } catch (error) {
    console.log(error);
  }
};
