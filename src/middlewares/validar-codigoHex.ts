import { Response, NextFunction } from "express";

export const expiradoCodigoHex = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { codigo, tiempoExpiracion } = req.body;

  const date = new Date(tiempoExpiracion);
  let expiro = date < new Date();

  if (expiro) {
    return res.status(401).json({ error: "El código ha expirado" });
  }
  
  next();
};
