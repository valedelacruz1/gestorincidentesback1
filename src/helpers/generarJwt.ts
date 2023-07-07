import { response } from "express";
import jwt, { Secret } from "jsonwebtoken";
// import { Request, Response } from "express";

export const generarJWT = (id = "") => {
  return new Promise((resolve, reject) => {
    const payload = {
      id,
    };

    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

export const expiredJWT = (token = "") => {
  if (!token) {
    return response.status(400).json({
      msg: "No hay token en la peticion",
    });
  }

  try {
    const tokenResp = jwt.verify(token, process.env.SECRET_KEY);
    console.log(tokenResp);
    let expirado = false;

    //   if (tokenResp.exp > Date.now()) {
    //     return expirado;
    //   }

    // return expirado;
  } catch (error) {
    // expirado=true
    return error;
  }
};
