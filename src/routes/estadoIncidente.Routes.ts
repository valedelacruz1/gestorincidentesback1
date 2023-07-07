//TODO: definir rutas

import { Router } from "express";
import {
  actualizarEstadoIncidente,
  crearEstadoIncidente,
  borrarEstadoIncidente,
  borrarEstadoIncidentePermanente,
  getEstadoIncidente,
  getEstadoIncidentes,
} from "../controllers/estadoIncidente.controller";

const router = Router();

//Obtener todos los usuarios registrados
router.get("/", getEstadoIncidentes);

router.get("/:id", getEstadoIncidente);

router.post("/", crearEstadoIncidente);

router.put("/:id", actualizarEstadoIncidente);

// router.delete("/:id", borrarEstadoIncidente);
router.delete("/:id", borrarEstadoIncidentePermanente);

export default router;
