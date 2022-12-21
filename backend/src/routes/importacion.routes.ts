import { Router } from "express";
import {
  getFactura,
  validarImportacion,
  guardarImportacion,
} from "../controllers/importacion.controller";

import {
  verifyToken
} from "../controllers/login.controller";

const router = Router();


/**
 * @swagger
 * tags:
 *  name: Importacion
 *  description: Importacion endpoint
 */


/**
 * @swagger
 * /validar:
 *  post:
 *    summary: validar datos del excel
 *    tags: [Importacion]
 *    description: Restringido por BearerAuth .
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              usuario:
 *                type: string
 *                description: usuario valida
 *              data:
 *                type: array
 *                description: datos a validar
 *            required:
 *              - usuario
 *              - data
 *            example:
 *              usuario: miUsuario
 *              data: [{}]
 *    responses:
 *      200:
 *        description: validar correcto
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: array
 *                  description: registros con problemas
 *                correcto:
 *                  type: array
 *                  description: registros correctos
 *              example:
 *                error: [{fila: 2, error: problema},{fila: 30, error: problema}]
 *                data: [{},{},{},{}, ...]
 *      404:
 *        description: validar not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: A message for the not found validar
 *              example:
 *                  msg: validar not found
 *      500:
 *        description: Some server error
 *
 */

router.post("/validar", verifyToken, validarImportacion);


/**
 * @swagger
 * /registrar:
 *  post:
 *    summary: registrar datos del excel en la BD
 *    tags: [Importacion]
 *    description: Restringido por BearerAuth .
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              usuario:
 *                type: string
 *                description: usuario que registra
 *              data:
 *                type: array
 *                description: datos a registrar
 *            required:
 *              - usuario
 *              - data
 *            example:
 *              usuario: miUsuario
 *              data: [{}]
 *    responses:
 *      200:
 *        description: registrar correcto
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: errores
 *                data:
 *                  type: string
 *                  description: registro correcto
 *              example:
 *                error: null
 *                data: "OK"
 *      404:
 *        description: registro not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: A message for the not found registro
 *              example:
 *                  msg: registro not found
 *      500:
 *        description: Some server error
 *
 */

 router.post("/registrar", verifyToken, guardarImportacion);

 
/**
 * @swagger
 * /facturas/:usuario:
 *  post:
 *    summary: traer facturas del usuario
 *    tags: [Importacion]
 *    description: Restringido por BearerAuth .
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              usuario:
 *                type: string
 *                description: usuario relacionado a las facturas
 *            required:
 *              - usuario
 *            example:
 *              usuario: miUsuario
 *    responses:
 *      200:
 *        description: traer correcto
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: array
 *                  description: array de facturas del usuario
 *              example:
 *                data: [{},{}, ....]
 *      404:
 *        description: get not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: A message for the not found get facturas
 *              example:
 *                  msg: get not found
 *      500:
 *        description: Some server error
 *
 */

 router.post("/facturas", verifyToken, getFactura);

export default router;
