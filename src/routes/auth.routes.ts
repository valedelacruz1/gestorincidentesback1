

import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos";

import { login, expiradoToken, revalidarToken, validarCodigoHexa, enviarCorreoRestablecer } from '../controllers/auth.controller';


import validarJWT from "../middlewares/validar-jwt";
import { enviarMensajeReq } from "../helpers/sendEmail";
import { expiradoCodigoHex } from "../middlewares/validar-codigoHex";




const router = Router();

//Obtener todos las dependencias registrados
router.post(
  "/login",
  [
    check("username", "El username es obligatorio").not().isEmpty(),
    check("password", "La contrasenia es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  login
);

// Validar y revalidar token de usuario 
router.get('/renew',validarJWT,revalidarToken  );

// Validar si ya expiro el token de usuario 
router.get('/expired' ,expiradoToken);

router.post('/sendEmail',validarJWT,enviarMensajeReq);

router.post('/restablecerCuenta',enviarCorreoRestablecer);

router.post('/validarCodigoHexa',expiradoCodigoHex,validarCodigoHexa);

export default router;
