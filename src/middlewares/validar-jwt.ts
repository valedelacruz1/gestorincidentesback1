import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { Usuario } from "../models/MySQL";
import { getModeloBD } from '../helpers/getModelo';

const { UsuarioM } = require("../models/MongoDB/index");

export const validarJWT = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la peticion",
    });
  }

  try {
    const { id }: any = jwt.verify(token, process.env.SECRET_KEY);

    const query = {
      id,
      estado: true,
    };
    //leer el usuario que corresponde al id
    let usuario: any = await getModeloBD("usuario",query,"MYSQL");


    if (!usuario) {
      return res.status(401).json({
        msg: "Token no valido - Usuario no existe en la base de datos.",
      });
    }
    //Verificar si el usuario esta activo

    if (usuario.estado ===false) {
      return res.status(401).json({
        msg: "Token no valido - Usuario no activo",
      });
    }

    req.id = id;
    req.usuario = usuario;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no valido",
    });
  }
};

export default validarJWT;
