import { Handler, Request, Response, NextFunction } from "express";

import { nanoid } from "nanoid";

import { getAviso, getAvisoProcedure } from "../services/aviso.service";
import { getlogin } from "../services/login.service";

import jwt, { Secret, JwtPayload } from 'jsonwebtoken';

require('dotenv').config();

export interface CustomRequest extends Request {
  token: string | JwtPayload;
 }

export const login: Handler = async (req, res) => {
  const { usuario, contraseña } = req.body;
  try {
  // validacion
    const result = await getlogin(req.body) || [];
    
    if (result.length === 0){
      res.status(500).send({
        error: true,
        data: 'El usuario y/o contraseña no son correctas'
      });
    } else {
      
      const id= nanoid();
      // create token
      const token = jwt.sign({
        name: result[0].NombreUsuario,
        id: id
      }, process.env.JWT_SECRET || '123456');
      let data = result[0];
      
      data.token = token;
      res.json({
        error: false,
        data: data
      });
    }

    
  } catch (error) {
    console.log("🚀 ~ file: login.controller.ts:43 ~ constlogin:Handler= ~ error", error)
    //res.status(500).send(error);
  }
};

export const verifyToken: Handler = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  //const token = req.header('auth-token')
  if (!token) return res.status(401).json({ error: 'Acceso denegado' })
  try {
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '123456');
      (req as CustomRequest).token = decoded;

      next();
      
  } catch (error) {
      res.status(400).json({error: 'token no es válido'})
  }
}


export const aviso: Handler = async (req, res) => {
  try {
    
    let result = await getAviso();
    
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error);
  }
};

export const avisoProcedure: Handler = async (req, res) => {
  
  try {
    const result = await getAvisoProcedure(req.body);
    
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error);
  }
};