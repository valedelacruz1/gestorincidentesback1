import { Router } from "express";


import {
  actualizarTipoIncidente,
  borrarTipoIncidente,
  borrarTipoIncidentePermanente,
  crearTipoIncidente,
  getTipoIncidentes,
  getTipoIncidente,
} from "../controllers/tipoIncidente.controller";

const router = Router();

//Obtener todos los usuarios registrados
router.get("/", getTipoIncidentes);

router.get("/:id", getTipoIncidente);

router.post("/", crearTipoIncidente);

// router.delete("/:id", borrarTipoIncidente);
router.delete("/:id", borrarTipoIncidentePermanente);

router.put("/:id", actualizarTipoIncidente);

export default router;
