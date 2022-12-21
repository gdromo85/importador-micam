import { Handler, Request, Response, NextFunction } from "express";

import {
  getValidarImportacionXls,
  insImportacionXls,
  getFacturasXUsuario,
} from "../services/importacion.service";

import { Importacion } from "../model/model.importacion";

require("dotenv").config();

export const getFactura: Handler = async (req: Request, res: Response) => {
  try {
    const { usuario } = req.body;
    
    let result = await getFacturasXUsuario(usuario.id);
    res.json(result);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const validarImportacion: Handler = async (
  req: Request,
  res: Response
) => {
  try {
    const { usuario, data } = req.body;

    let correctos = [];

    let errores = [];

    for (let index = 0; index < data.length; index++) {
      const element: Importacion = data[index];
      let result = await getValidarImportacionXls(element);
      if (result?.recordset[0].intError === 0) {
        correctos.push(element);
      } else {
        errores.push({
          posicion: element.fila,
          problema: result?.recordset[0].varError,
        });
      }
    }

    res.json({
      correctos: correctos,
      errores: errores,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: importacion.controller.ts:59 ~ constvalidarImportacion:Handler= ~ error",
      error
    );
    return res.status(500).send(error);
  }
};

export const guardarImportacion: Handler = async (
  req: Request,
  res: Response
) => {
  const { usuario, data, factura } = req.body;
  
  try {
    for (let index = 0; index < data.length; index++) {
      const element: Importacion = data[index];
      let result = await insImportacionXls(
        element,
        usuario.id,
        factura.comprobante
      );
      
    }

    res.json("Se guardo correctamente");
  } catch (error) {
    console.log(
      "🚀 ~ file: importacion.controller.ts:84 ~ constguardarImportacion:Handler= ~ error",
      error
    );
    return res.status(500).send(error);
  }
};

/*
export const aviso: Handler = async (req, res) => {
  try {
    
    let result = await getAviso();
    
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error);
  }
};
*/
