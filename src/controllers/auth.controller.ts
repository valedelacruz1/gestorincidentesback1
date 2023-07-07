import { Request, Response } from "express";

import Usuario from "../models/MySQL/usuario";
import bcrypt from "bcrypt";

import { expiredJWT, generarJWT } from "../helpers/generarJwt";
import Role from "../models/MySQL/role";
import Dependencia from "../models/MySQL/dependencia";
import TipoDocumento from "../models/MySQL/tipoDocumento";
import { generarCodigoHex, validarCodigoHex } from "../helpers/generarHex";
import { enviarMensajeInsideServer } from "../helpers/sendEmail";

const { UsuarioM, RoleM } = require("../models/MongoDB/index");

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    //verificar si el username existe

    //MYSQL
    const usuarioMy: any = await Usuario.findOne({
      where: { username },
      include: [
        {
          model: Role,
          as: "role",
          required: true, // INNER JOIN
          attributes: ["id", "rol_nombre", "rol_descripcion"],
        },
        {
          model: Dependencia,
          as: "dependencia",
          required: true, // INNER JOIN
          attributes: ["id", "dep_nombre", "dep_descripcion"],
        },
        {
          model: TipoDocumento,
          as: "tipoDocumento",
          required: true, // INNER JOIN
          attributes: ["id", "tdoc_nombre", "tdoc_descripcion"],
        },
      ],
    });
    //MONGODB

    let usuarioMo: any = await UsuarioM.findOne({ username: username })
      .populate("role", ["idMYSQL", "rol_nombre", "rol_descripcion "])
      .populate("dependencia", [
        "idMYSQL",
        "dep_nombre",
        "dep_descripcion",
        "role",
      ])
      .populate("tipoDocumento", [
        "idMYSQL",
        "tdoc_nombre",
        "tdoc_descripcion",
      ]);

    if (!usuarioMy || !usuarioMo) {
      return res.status(400).json({
        msg: "Usuario / Contraseña no son correctos ",
        // username(borrar luego)
      });
    }

    //Si el usuario esta activo
    if (usuarioMy.estado === false || usuarioMo.estado === false) {
      return res.status(400).json({
        msg: "Usuario / Contraseña no son correctos ",
        // - estado:false(borrar luego)
      });
    }
    //Verificar la contrasenia

    const validPassword = bcrypt.compareSync(password, usuarioMy.password);
    const validPasswordMo = bcrypt.compareSync(password, usuarioMo.password);

    if (!validPassword || !validPasswordMo) {
      return res.status(400).json({
        msg: "Usuario / Contraseña no son correctos",
        // - password(borrar luego)
      });
    }

    //Generar el JWT
    let token;
    let usuarioToken;
    if (!usuarioMy) {
      usuarioToken = usuarioMo;
      token = await generarJWT(usuarioMo.idMYSQL);
    } else {
      usuarioToken = usuarioMy;
      token = await generarJWT(usuarioMy.id);
    }

    //Obtener Rol
    const roleBD = await obtenerRole(usuarioToken);

    res.status(200).json({
      msg: "Login ok",
      usuarioMy,
      usuarioMo,
      role: roleBD,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};
export const enviarCorreoRestablecer = async (req: any, res: Response) => {
  const { correo } = req.body;
  

  try {
    //MYSQL
    const usuarioMy: any = await Usuario.findOne({
      where: { correo },
      include: [
        {
          model: Role,
          as: "role",
          required: true, // INNER JOIN
          attributes: ["id", "rol_nombre", "rol_descripcion"],
        },
        {
          model: Dependencia,
          as: "dependencia",
          required: true, // INNER JOIN
          attributes: ["id", "dep_nombre", "dep_descripcion"],
        },
        {
          model: TipoDocumento,
          as: "tipoDocumento",
          required: true, // INNER JOIN
          attributes: ["id", "tdoc_nombre", "tdoc_descripcion"],
        },
      ],
    });
    //MONGODB

    let usuarioMo: any = await UsuarioM.findOne({ correo: correo })
      .populate("role", ["idMYSQL", "rol_nombre", "rol_descripcion "])
      .populate("dependencia", [
        "idMYSQL",
        "dep_nombre",
        "dep_descripcion",
        "role",
      ])
      .populate("tipoDocumento", [
        "idMYSQL",
        "tdoc_nombre",
        "tdoc_descripcion",
      ]);

    if (!usuarioMy || !usuarioMo) {
      return res.status(400).json({
        msg: "No existe cuenta de usuario con ese correo.",
      });
    }

    const {codigo,tiempoExpiracion}:any = generarCodigoHex(2);
    
    

    let usuarioInfoEmail = {
      correo,
      nombre: usuarioMy.nombre,
      username: usuarioMy.username,
      codigo
    };

    console.log(usuarioInfoEmail);

    // NOTIFICAR AL USUARIO EL CODIGO HEX

    const correoEnviado = await enviarMensajeInsideServer(
      usuarioInfoEmail,
      `Restablecer Cuenta`,
      usuarioInfoEmail
    );

    //Generar el JWT
    let token;
    let usuarioToken;
    if (!usuarioMy) {
      usuarioToken = usuarioMo;
      token = await generarJWT(usuarioMo.idMYSQL);
    } else {
      usuarioToken = usuarioMy;
      token = await generarJWT(usuarioMy.id);
    }

    res.status(201).json({
      msg: `Mensaje enviado a correo ${usuarioInfoEmail.correo} exitosamente,revisa tu bandeja de correos.!`,
      usuario: usuarioToken,
      tiempoExpiracion,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

export const validarCodigoHexa = async (req: any, res: Response) => {
  const { codigo } = req.body;

  const codigoValido = validarCodigoHex(codigo);



  if (codigoValido) {
    return res.status(200).json({
      msg: "Codigo Valido",
      ok: true,
    });
  } else {
    return res.status(401).json({
      msg: "Codigo Invalido",
      ok: false,
    });
  }
};

export const obtenerRole = async (usuarioToken: any) => {
  const usuarioRol: any = await Role.findOne({
    where: { id: usuarioToken.roleId },
  });
  const usuarioRolM: any = await RoleM.findOne({
    where: { idMYSQL: usuarioToken.roleId },
  });

  let roleBD = undefined;
  if (!usuarioRol) {
    roleBD = usuarioRolM.rol_nombre;
  } else {
    roleBD = usuarioRol.rol_nombre;
  }

  return roleBD;
};

export const revalidarToken = async (req: any, res: Response) => {
  const id = req.id;

  // leer la base de datos

  //MYSQL

  let usuarioMy: any = await Usuario.findOne({
    where: { id },
    include: [
      {
        model: Role,
        as: "role",
        required: true, // INNER JOIN
        attributes: ["id", "rol_nombre", "rol_descripcion"],
      },
      {
        model: Dependencia,
        as: "dependencia",
        required: true, // INNER JOIN
        attributes: ["id", "dep_nombre", "dep_descripcion"],
      },
      {
        model: TipoDocumento,
        as: "tipoDocumento",
        required: true, // INNER JOIN
        attributes: ["id", "tdoc_nombre", "tdoc_descripcion"],
      },
    ],
  });

  //MONGODB
  const usuarioMo: any = await UsuarioM.findOne({ idMYSQL: id })
    .populate("role", ["idMYSQL", "rol_nombre", "rol_descripcion "])
    .populate("dependencia", ["idMYSQL", "dep_nombre", "dep_descripcion"])
    .populate("tipoDocumento", ["idMYSQL", "tdoc_nombre", "tdoc_descripcion"]);

  let usuarioToken;
  if (!usuarioMy) {
    usuarioToken = {
      id: usuarioMo.idMYSQL,

      role: usuarioMo.role.rol_nombre,
    };
  } else {
    usuarioToken = {
      id: usuarioMy.id,

      role: usuarioMy.role.rol_nombre,
    };
  }

  // Generar el JWT
  const token = await generarJWT(usuarioToken.id);

  return res.status(200).json({
    ok: true,
    usuarioMy,
    usuarioMo,
    role: usuarioToken.role,
    token,
  });
};

export const expiradoToken = async (req: any, res: Response) => {
  const token = req.header("x-token");

  const expirado = await expiredJWT(token);
  if (expirado) {
    res.json({
      ok: false,
      msg: "El Token ha expirado",
    });
  } else {
    res.json({
      ok: true,
      msg: "Token no ha expirado",
    });
  }
};
