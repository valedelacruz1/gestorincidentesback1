import { Router } from "express";

import validarJWT from "../middlewares/validar-jwt";
import { validarCampos } from "../middlewares/validar-campos";

import {
  crearIncidente,
  borrarIncidente,
  borrarIncidentePermanente,
  getIncidente,
  getIncidentes,
  actualizarIncidente,
} from "../controllers/incidente.controller";
import { check } from "express-validator";

import { existeEstadoIncidentePorId } from "../helpers/db-validators";
import {
  existeIncidentePorId,
  esRoleValido,
  existeTipoIncidentePorId,
  existeUsuarioPorId,
} from "../helpers/db-validators";
import { esAdminRole } from "../middlewares/validar-roles";

const router = Router();

router.get("/", getIncidentes);
router.get(
  "/:id",
  [validarJWT, 
   check("id").custom(existeIncidentePorId),
   validarCampos],
  getIncidente
);

//REGISTRAR INCIDENTE
router.post(
  "/",
  [
    validarJWT,
    check("inc_nombre", "El nombre es obligatorio").not().isEmpty(),
    check("inc_usuarioId", "El usuario no existe").custom(existeUsuarioPorId),
    check("inc_tipoIncidenteId", "No es un Tipo Incidente valido").custom(existeTipoIncidentePorId),
    validarCampos,
  ],
  crearIncidente
);

//ACTUALIZAR INCIDENTE
router.put(
  "/:id",
  
  [
    validarJWT,
    check("id").custom(existeIncidentePorId),
    
    check("inc_usuarioRevisionId", "El usuario no existe").custom(existeUsuarioPorId),
    check("inc_estadoIncidenteId", "No es un estadoIncidente valido").custom(existeEstadoIncidentePorId),
    validarCampos,
  ],
  actualizarIncidente
);

router.delete("/:id",
[validarJWT,  validarCampos],
 borrarIncidente);// desactivar incidente

// router.delete(
//   "/:id",
//   [validarJWT,  validarCampos],
//   borrarIncidentePermanente
// );
 //Forma permanent

export default router;
