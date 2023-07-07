import { Router } from "express";

import validarJWT from "../middlewares/validar-jwt";
import { validarCampos } from "../middlewares/validar-campos";
import { buscar } from "../controllers/busqueda.controller";
import { check } from "express-validator";

const router = Router();

router.get(
  "/:coleccion/:id",
  [
    validarJWT,
    check("id", "El id a buscar es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  buscar
);



export default router;
