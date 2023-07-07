import { Router } from "express";


import {
  actualizarTipoDocumento,
  borrarTipoDocumento,
  borrarTipoDocumentoPermanente,
  crearTipoDocumento,
  getTipoDocumentos,
  getTipoDocumento,
} from "../controllers/tipoDocumento.controller";

const router = Router();

//Obtener todos los usuarios registrados
router.get("/", getTipoDocumentos);

router.get("/:id", getTipoDocumento);

router.post("/", crearTipoDocumento);

// router.delete("/:id", borrarTipoDocumento);
router.delete("/:id", borrarTipoDocumentoPermanente);

router.put("/:id", actualizarTipoDocumento);

export default router;
