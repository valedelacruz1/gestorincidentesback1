import { Router } from "express";
import { check } from "express-validator";
import validarJWT from "../middlewares/validar-jwt";
import { validarCampos } from "../middlewares/validar-campos";
import {
  emailExiste,
  esRoleValido,
  existeUsuarioPorId,
  numDocumentoExiste,
  telefonoExiste,
  usernameExiste,
} from "../helpers/db-validators";

import {
  actualizarUsuario,
  crearUsuario,
  borrarUsuario,
  borrarUsuarioPermanente,
  getUsuario,
  getUsuarios,
} from "../controllers/usuario.controller";

const router = Router();

//Obtener todos los usuarios registrados
router.get("/", getUsuarios);

router.get("/:id", getUsuario);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("correo", "El correo no es valido").isEmail(),
    check("correo","El correo ya existe").custom(emailExiste),
    check("username","El username ya existe").custom(usernameExiste),
    check("password","Password es obligatorio y mas de 6 caracteres" ).isLength({ min: 6 }),
    check("roleId", "No es un rol valido").custom(esRoleValido),
    check('telefono',"El telefono ya existe").custom(telefonoExiste),
    check('numDocumento','El numero de documento ya existe').custom(numDocumentoExiste),
    validarCampos,
  ],
  crearUsuario
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "El usuario no existe").custom(existeUsuarioPorId),
    validarCampos,
  ],
  actualizarUsuario
);

router.delete(
  "/:id",
  [
    validarJWT,
    check("id").custom(existeUsuarioPorId),
    // check()
  ],
  borrarUsuario
); //Deshabilitar

// router.delete(
//   "/:id",
//   [
//     validarJWT,
//     check("id").custom(existeUsuarioPorId),
//     // check()
//   ],
//   borrarUsuarioPermanente
// );

export default router;
