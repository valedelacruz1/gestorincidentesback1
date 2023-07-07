//TODO: definir rutas

import { Router } from "express";

import {
  actualizarRole,
  borrarRole,
  borrarRolPermanente,
  crearRole,
  getRole,
  getRoles,
} from "../controllers/rol.controller";

const router = Router();

//Obtener todos las dependencias registrados
router.get("/", getRoles);

router.get("/:id", getRole);

router.post("/", crearRole);

router.delete("/:id", borrarRole);

router.put("/:id", actualizarRole);

export default router;
