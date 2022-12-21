import { Router } from "express";
import {
  login,
  verifyToken,
  aviso,
  avisoProcedure,
} from "../controllers/login.controller";

const router = Router();



/**
 * @swagger
 * tags:
 *  name: Login
 *  description: Login endpoint
 */


/**
 * @swagger
 * /login:
 *  post:
 *    summary: login en el sistema
 *    tags: [Login]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              usuario:
 *                type: string
 *                description: usuario a loguear
 *              contraseña:
 *                type: string
 *                description: contraseña del usuario
 *            required:
 *              - usuario
 *              - contraseña
 *            example:
 *              usuario: miUsuario
 *              contraseña: "1234"
 *    responses:
 *      200:
 *        description: login correcto
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
 *                  description: token de acceso
 *              example:
 *                error: null
 *                data: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibWlVc3VhcmlvIiwiaWQiOiJSdVdYemgwckFocTgwQ0ZEYWVJb3YiLCJpYXQiOjE2Njk4MTY0NTF9.yEus2cZWRjEA7jwNiwz925OEra7-g5TEgnl_Ofgpv3Q
 *      404:
 *        description: login not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: A message for the not found task
 *              example:
 *                  msg: login not found
 *      500:
 *        description: Some server error
 *
 */
router.post("/login", login);

router.get("/aviso", verifyToken, aviso);

router.post("/avisoProcedure", verifyToken, avisoProcedure);


export default router;
