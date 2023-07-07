import { Request, Response } from "express";

const {
  UsuarioM,
  IncidenteM,
  TipoIncidenteM,
  EstadoIncidenteM,
} = require("../models/MongoDB/index");
import Incidente from "../models/MySQL/incidente";
import Usuario from "../models/MySQL/usuario";
import TipoIncidente from "../models/MySQL/tipoIncidente";
import EstadoIncidente from "../models/MySQL/estadoIncidente";
import { Role } from "../models/MySQL";
import { enviarMensajeInsideServer } from "../helpers/sendEmail";
import { getModeloBD } from "../helpers/getModelo";

export const crearIncidente = async (req: Request, res: Response) => {
  const {
    inc_nombre,
    inc_descripcion,
    inc_tipoIncidenteId,
    inc_estadoIncidenteId,
    inc_usuarioId,
    inc_usuarioRevisionId,
    ...body
  } = req.body;
  // incidente
  try {
    //MYSQL
    const incidenteDB = await Incidente.findOne({
      where: {
        inc_nombre: inc_nombre,
      },
    });

    //MONGODB
    const incidenteMDB = await IncidenteM.findOne({
      inc_nombre: inc_nombre,
    });

    if (incidenteDB || incidenteMDB) {
      return res.status(400).json({
        msg: `El incidente ${incidenteMDB.inc_nombre},ya existe`,
      });
    }

    //Generar la data a guardar
    const data = {
      inc_nombre,
      inc_descripcion,
      inc_tipoIncidenteId,
      inc_estadoIncidenteId,
      inc_usuarioId,
      inc_usuarioRevisionId,

      ...body,
    };

    //MYSQL
    const incidente: any = await Incidente.create(data);

    //Preparar data mongo
    const usuarioMDB = await UsuarioM.findOne({
      idMYSQL: data.inc_usuarioId,
    });
    const usuarioRevisionMDB = await UsuarioM.findOne({
      idMYSQL: data.inc_usuarioRevisionId,
    });
    const tipoIncidenteMDB = await TipoIncidenteM.findOne({
      idMYSQL: data.inc_tipoIncidenteId,
    });

    const estadoIncidenteMDB = await EstadoIncidenteM.findOne({
      idMYSQL: data.inc_estadoIncidenteId,
    });

    const { id: idUsuarioMongo } = usuarioMDB;
    const { id: idUsuarioRevisionMongo } = usuarioRevisionMDB;
    const { id: idTipoIncidenteMongo } = tipoIncidenteMDB;
    const { id: idEstadoIncidenteMongo } = estadoIncidenteMDB;

    const dataMongo = {
      inc_nombre,
      inc_descripcion,
      inc_tipoIncidente: idTipoIncidenteMongo,
      inc_usuario: idUsuarioMongo,
      inc_usuarioRevision: idUsuarioRevisionMongo,
      inc_estadoIncidente: idEstadoIncidenteMongo,
      idMYSQL: incidente.id,
      ...body,
    };

    //MONGODB
    const incidenteM = new IncidenteM(dataMongo);

    //Guardar en DB
    await incidenteM.save();

    // Enviar Email notificar ADMIN que se creo un incidente

    const correoEnviado = await enviarMensajeInsideServer(
      usuarioRevisionMDB,
      `Registro de Incidente`,
      incidente
    );

    res.status(201).json({
      msg: "Incidente Creado Correctamente",
      incidente,
      incidenteM,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

export const getIncidentes = async (req: Request, res: Response) => {
  
  const { limite = 5, desde = 0 } = req.query;
  let limiteM = Number(limite);
  let desdeM = Number(desde);

  const query = {
    inc_estado: true,
  };
  try {
    //Buscar todas los incidentes

    //MYSQL

    const [totalMYSQL, incidentesMy] = await Promise.all([
      Incidente.count({ where: query }),
      Incidente.findAll({
        offset: desdeM,
        limit: limiteM,
        where: query,
        include: [
          {
            model: Usuario,
            as: "inc_usuario",
            required: true, // INNER JOIN
            attributes: [
              "id",
              "nombre",
              "numDocumento",
              "correo",
              "telefono",
              "dependenciaId",
              "roleId",
            ],
          },
          {
            model: Usuario,
            as: "inc_usuarioRevision",
            required: true, // INNER JOIN
            attributes: ["id", "nombre", "correo", "roleId"],
          },
          {
            model: TipoIncidente,
            as: "inc_tipoIncidente",
            required: true, // INNER JOIN
            attributes: ["id", "tinc_nombre", "tinc_descripcion"],
          },
          {
            model: EstadoIncidente,
            as: "inc_estadoIncidente",
            required: true, // INNER JOIN
            attributes: ["id", "est_nombre", "est_descripcion"],
          },
        ],
      }),
    ]);

    //MONGODB
    const [totalMongoDB, incidentesMo] = await Promise.all([
      IncidenteM.countDocuments(query),
      IncidenteM.find(query).skip(Number(desde)).limit(Number(limite)),
      IncidenteM.find(query)
        .populate("inc_usuario", [
          "idMYSQL",
          "nombre",
          "numDocumento",
          "correo",
          "telefono",
          "dependencia",
          "role",
        ])
        .populate("inc_usuarioRevision", [
          "idMYSQL",
          "nombre",
          "correo",
          "role",
        ])
        .populate("inc_tipoIncidente", [
          "idMYSQL",
          "tinc_nombre",
          "tinc_descripcion",
        ])
        .populate("inc_estadoIncidente", [
          "idMYSQL",
          "est_nombre",
          "est_descripcion",
        ]),
    ]);

    if (!incidentesMo || !incidentesMy) {
      return res.status(400).json({
        msg: `No hay Incidencias registradas en la base de datos`,
      });
    }

    res.status(200).json({
      msg: "get API -getIncidencias",
      totalMYSQL,
      incidentesMy,
      totalMongoDB,
      incidentesMo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

export const getIncidente = async (req: Request, res: Response) => {
  const { id } = req.params;

  const query = {
    id: id,
  };

  try {
    //Conseguir el incidente

    //Obtener la dependencia MYSQL

    let incidente: any = await Incidente.findOne({
      where: query,
      include: [
        {
          model: Usuario,
          as: "inc_usuario",
          required: true, // INNER JOIN
          attributes: [
            "id",
            "nombre",
            "correo",
            "numDocumento",
            "telefono",
            "dependenciaId",
            "roleId",
          ],
        },
        {
          model: Usuario,
          as: "inc_usuarioRevision",
          required: true, // INNER JOIN
          attributes: ["id", "nombre", "correo", "roleId"],
        },
        {
          model: TipoIncidente,
          as: "inc_tipoIncidente",
          required: true, // INNER JOIN
          attributes: ["id", "tinc_nombre", "tinc_descripcion"],
        },
        {
          model: EstadoIncidente,
          as: "inc_estadoIncidente",
          required: true, // INNER JOIN
          attributes: ["id", "est_nombre", "est_descripcion"],
        },
      ],
    });

    //Obtener la dependencia MONGODB
    let incidenteM: any = await IncidenteM.findOne({ idMYSQL: id })
      .populate("inc_usuario", [
        "idMYSQL",
        "nombre",
        "numDocumento",
        "telefono",
        "correo",
        "dependencia",
        "role",
      ])
      .populate("inc_usuarioRevision", ["idMYSQL", "nombre", "correo", "role"])
      .populate("inc_tipoIncidente", [
        "idMYSQL",
        "tinc_nombre",
        "tinc_descripcion",
      ])
      .populate("inc_estadoIncidente", [
        "idMYSQL",
        "est_nombre",
        "est_descripcion",
      ]);

    if (!incidente) {
      incidente = {
        msg: "No se encontro en base MYSQL",
      };
    } else if (!incidenteM) {
      incidenteM = {
        msg: "No se encontro en base MONGODB",
      };
    }

    res.status(200).json({
      msg: "get API -getIncidente",
      incidente,
      incidenteM,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

//Actualizar Incidente
export const actualizarIncidente = async (req: any, res: Response) => {
  const { id } = req.params;
  const { inc_usuarioRevisionId, inc_usuarioAdmin, ...resto } = req.body;
  
  try {
    const query = {
      id,
    };
    //Verificar que exista ya uno

    //MYSQL

    //Obtener la dependencia MYSQL
    // const incidenteDB = await Incidente.findByPk(id);
    let incidenteDB: any = await Incidente.findOne({
      where: query,
      include: [
        {
          model: Usuario,
          as: "inc_usuario",
          required: true, // INNER JOIN
          attributes: [
            "id",
            "nombre",
            "correo",
            "telefono",
            "dependenciaId",
            "roleId",
          ],
        },
        {
          model: Usuario,
          as: "inc_usuarioRevision",
          required: true, // INNER JOIN
          attributes: ["id", "nombre", "correo", "roleId"],
        },
        {
          model: TipoIncidente,
          as: "inc_tipoIncidente",
          required: true, // INNER JOIN
          attributes: ["id", "tinc_nombre", "tinc_descripcion"],
        },
        {
          model: EstadoIncidente,
          as: "inc_estadoIncidente",
          required: true, // INNER JOIN
          attributes: ["id", "est_nombre", "est_descripcion"],
        },
      ],
    });

    //Obtener la dependencia MONGODB
    // const incidenteMDB = await IncidenteM.findOne({ idMYSQL: id });
    let incidenteMDB: any = await IncidenteM.findOne({ idMYSQL: id })
      .populate("inc_usuario", [
        "idMYSQL",
        "nombre",
        "telefono",
        "correo",
        "dependencia",
        "role",
      ])
      .populate("inc_usuarioRevision", ["idMYSQL", "nombre", "correo", "role"])
      .populate("inc_tipoIncidente", [
        "idMYSQL",
        "tinc_nombre",
        "tinc_descripcion",
      ])
      .populate("inc_estadoIncidente", [
        "idMYSQL",
        "est_nombre",
        "est_descripcion",
      ]);

    if (!incidenteDB) {
      return res.status(404).json({
        msg: `No se encontro incidente con el id ${id} en base de datos MYSQL`,
      });
    } else if (!incidenteMDB) {
      return res.status(404).json({
        msg: `No se encontro incidente con el id ${id} en base de datos MONGODB`,
      });
    }

    const { id: idMongo } = incidenteMDB;

    const dataMDB = { updatedAt: Date.now(), inc_usuarioRevisionId, ...resto };

    //actualizar la dependencia en MYSQL
    const incidenteActualizado = await incidenteDB.update(dataMDB);

    //actualizar la dependencia en MONGODB

    let {
      inc_usuarioId: userId,
      inc_usuarioRevisionId: adminId,
      inc_tipoIncidenteId: tipoId,
      inc_estadoIncidenteId: estadoId,
      ...data
    } = incidenteActualizado;

    let usuarioRev: any = await getModeloBD(
      "usuario",
      { idMYSQL: inc_usuarioRevisionId },
      "MONGO"
    );
    let inc_usuario: any = await getModeloBD(
      "usuario",
      { id: userId },
      "MYSQL"
    );
    let tipoIncide: any = await getModeloBD(
      "tipoIncidente",
      { idMYSQL: tipoId },
      "MONGO"
    );
    let estadoIncide: any = await getModeloBD(
      "estadoIncidente",
      { idMYSQL: estadoId },
      "MONGO"
    );

    let { inc_descripcion, inc_nombre, inc_estado } = incidenteActualizado;

    const dataEnvMDB = {
      inc_nombre,
      inc_descripcion,
      inc_estado,
      inc_usuarioRevision: usuarioRev.id,
      inc_tipoIncidente: tipoIncide.id,
      inc_estadoIncidente: estadoIncide.id,
      updatedAt: Date.now(),
    };

    const incidenteMActualizado: any = await IncidenteM.findOneAndUpdate(
      { _id: idMongo },
      dataEnvMDB,
      { new: true }
    );

    // Enviar Email notificar USUARIO que se actualizo su incidnete

    //VERIFICAR si el que actualiza es admin

    if (inc_usuarioAdmin) {
      const queryRevision = {
        id: inc_usuarioAdmin,
      };

      let usuarioAdminMy: any = await Usuario.findOne({
        where: queryRevision,
        include: [
          {
            model: Role,
            as: "role",
            required: true, // INNER JOIN
            attributes: ["id", "rol_nombre", "rol_descripcion"],
          },
        ],
      });
      let usuarioAdminMo: any = await UsuarioM.findOne({
        idMYSQL: query.id,
      }).populate("role", ["idMYSQL", "rol_nombre", "rol_descripcion "]);

      if (
        usuarioAdminMy.role.rol_nombre === "ADMIN_ROLE" ||
        usuarioAdminMo.role.rol_nombre === "ADMIN_ROLE"
      ) {
        const { inc_usuario } = incidenteActualizado;

        //Asignacion tenico
        const correoEnviadoTecnico = await enviarMensajeInsideServer(
          usuarioRev,
          `Asignacion de Incidente`,
          incidenteActualizado
        );
      }

      //Aviso a usuario
      const correoEnviadoUsuario = await enviarMensajeInsideServer(
        inc_usuario,
        `Actualizacion de Incidente`,
        incidenteActualizado
      );
    }

    res.status(200).json({
      msg: "Incidente Actualizado",
      incidenteActualizado,
      incidenteMActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

export const borrarIncidente = async (req: Request, res: Response) => {
  const { id } = req.params;

  //Deshabilitar
  try {
    //MYSQL
    const incidenteMy = await Incidente.findByPk(id);
    if (!incidenteMy) {
      return res.status(404).json({
        msg: `No existe un incidente con el id ${id}`,
      });
    }

    //Obtener la dependencia MONGODB
    const incidenteMDB: any = await IncidenteM.findOne({ idMYSQL: id });
    const { id: idMongo } = incidenteMDB;

    //MYSQL
    await incidenteMy.update({ inc_estado: false });

    //MongoDB
    const incidenteMo = await IncidenteM.findByIdAndUpdate(
      idMongo,
      { inc_estado: false, updatedAt: Date.now() },
      { new: true }
    );

    res.status(200).json({
      msg: "Incidente  deshabilitado",
      incidenteMy,
      incidenteMo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

export const borrarIncidentePermanente = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  // console.log(id);
  //Fisicamente lo borramos

  try {
    //MYSQL
    const incidenteMy = await Incidente.findByPk(id);
    if (!incidenteMy) {
      return res.status(404).json({
        msg: "No existe una dependencia con el id" + id,
      });
    }

    //Obtener la dependencia MONGODB
    const incidenteMDB: any = await IncidenteM.findOne({ idMYSQL: id });
    const { id: idMongo } = incidenteMDB;

    //Eliminar en MYSQL
    await incidenteMy.destroy();
    //Eliminar MONGODB
    const incidenteMo = await IncidenteM.findByIdAndDelete(idMongo);

    res.status(200).json({
      msg: "Incidente borrado",
      incidenteMy,
      incidenteMo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};
