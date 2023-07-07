//TODO: definir rutas

import { Router } from "express";

const {
  actualizarDependencia,
  borrarDependencia,
  borrarDependenciaPermanente,
  crearDependencia,
  getDependencia,
  getDependencias,
} = require("../controllers/dependencia.controller");

const router = Router();

//Obtener todos las dependencias registrados
router.get("/", getDependencias);

router.get("/:id", getDependencia);

router.post("/", crearDependencia);

router.delete("/:id", borrarDependencia);
// router.delete("/:id", borrarDependenciaPermanente);

router.put("/:id", actualizarDependencia);

export default router;
