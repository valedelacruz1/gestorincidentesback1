import { Request, Response } from "express";

const { UsuarioM, IncidenteM } = require("../models/MongoDB/index");

import Incidente from "../models/MySQL/incidente";
import Usuario from "../models/MySQL/usuario";
import TipoIncidente from "../models/MySQL/tipoIncidente";
import EstadoIncidente from "../models/MySQL/estadoIncidente";
import Role from "../models/MySQL/role";
import Dependencia from "../models/MySQL/dependencia";
import TipoDocumento from "../models/MySQL/tipoDocumento";
import { getModeloBD } from "../helpers/getModelo";

const coleccionesPermitidas = [
  "incidentesTipoEstado",
  "incidentesUsuario",
  "incidentesUsuarioDocumento",
  "usuariosDependencia",
  "usuariosRole",
  "usuarioDocumento"
];

const getIncidentesPorUsuario = async (req: Request, res: Response) => {
  const { id: idUsuario } = req.params;
  let { tipoIncidente = 0, idTecnico=0,estadoIncidente = 0, estado = true ,desde=0,limite=5 } = req.query;

  let estadoIncidenteVal = Number(estadoIncidente);
  let idTipoIncidente = Number(tipoIncidente);
  let idTecnicoVal = Number(idTecnico);
  let estadoVal: boolean = Boolean(estado);
  let limiteM = Number(limite);
  let desdeM = Number(desde);

  const payloadUsuario = {
    idMYSQL: idUsuario,
  };

  const usuarioM = await getModeloBD("usuario", payloadUsuario, "MONGO");

  if(!usuarioM){
    return res.status(400).json({
      msg: `No existe el usuario `,
    });
  }
  

  let query,
    queryMongo,
    payloadEstadoIncidente: any,
    payloadTipoIncidente: any,
    payloadTecnico: any,
    estadoIncidenteM: any,
    tipoIncidenteM: any,
    usuarioTecnicoM: any;

  if (idTipoIncidente > 0 && estadoIncidenteVal > 0) {
    payloadTipoIncidente = {
      idMYSQL: idTipoIncidente,
    };

    payloadEstadoIncidente = {
      idMYSQL: estadoIncidenteVal,
    };
    tipoIncidenteM = await getModeloBD(
      "tipoIncidente",
      payloadTipoIncidente,
      "MONGO"
    );

    estadoIncidenteM = await getModeloBD(
      "estadoIncidente",
      payloadEstadoIncidente,
      "MONGO"
    );

    query = {
      inc_estado: estadoVal,
      inc_usuarioId: idUsuario,
      inc_estadoIncidenteId: estadoIncidenteVal,
      inc_tipoIncidenteId: idTipoIncidente,
    };

    queryMongo = {
      inc_estado: estadoVal,
      inc_usuario: usuarioM.id,
      inc_estadoIncidente: estadoIncidenteM.id,
      inc_tipoIncidente: tipoIncidenteM.id,
    };
  }
  else if (idTipoIncidente > 0 && estadoIncidenteVal > 0 && idTecnicoVal>0) {
    payloadTipoIncidente = {
      idMYSQL: idTipoIncidente,
    };

    payloadEstadoIncidente = {
      idMYSQL: estadoIncidenteVal,
    };
    payloadTecnico = {
      idMYSQL: idTecnicoVal,
    };
    tipoIncidenteM = await getModeloBD(
      "tipoIncidente",
      payloadTipoIncidente,
      "MONGO"
    );

    estadoIncidenteM = await getModeloBD(
      "estadoIncidente",
      payloadEstadoIncidente,
      "MONGO"
    );

    usuarioTecnicoM= await getModeloBD("usuario",payloadTecnico,"MONGO");

    query = {
      inc_estado: estadoVal,
      inc_estadoIncidenteId: estadoIncidenteVal,
      inc_tipoIncidenteId: idTipoIncidente,
      inc_usuarioRevisionId: idTecnicoVal,
    };

    queryMongo = {
      inc_estado: estadoVal,
      inc_estadoIncidente: estadoIncidenteM.id,
      inc_tipoIncidente: tipoIncidenteM.id,
      inc_usuarioRevision: usuarioTecnicoM.id,
    };
  } 
  else if (idTipoIncidente=== 0 && estadoIncidenteVal >0 && idTecnicoVal>0) {
   

    payloadEstadoIncidente = {
      idMYSQL: estadoIncidenteVal,
    };
    payloadTecnico = {
      idMYSQL: idTecnicoVal,
    };
   

    estadoIncidenteM = await getModeloBD(
      "estadoIncidente",
      payloadEstadoIncidente,
      "MONGO"
    );

    usuarioTecnicoM= await getModeloBD("usuario",payloadTecnico,"MONGO");

    query = {
      inc_estado: estadoVal,
      inc_estadoIncidenteId: estadoIncidenteVal,
      inc_usuarioRevisionId: idTecnicoVal,
    };

    queryMongo = {
      inc_estado: estadoVal,
      inc_estadoIncidente: estadoIncidenteM.id,
      inc_usuarioRevision: usuarioTecnicoM.id,
    };
  } 
  else if (idTipoIncidente === 0 && estadoIncidenteVal === 0) {
    query = {
      inc_estado: true,
      inc_usuarioId: idUsuario,
    };
    queryMongo = {
      inc_estado: true,
      inc_usuario: usuarioM.id,
    };

    console.log("queryMYSQL", query);
    console.log("queryMONGO", queryMongo);
  }
   else if (idTipoIncidente === 0 && estadoIncidenteVal > 0) {
    payloadEstadoIncidente = {
      idMYSQL: estadoIncidenteVal,
    };
    estadoIncidenteM = await getModeloBD(
      "estadoIncidente",
      payloadEstadoIncidente,
      "MONGO"
    );

    query = {
      inc_estado: estadoVal,
      inc_usuarioId: idUsuario,
      inc_estadoIncidenteId: estadoIncidenteVal,
    };
    queryMongo = {
      inc_estado: estadoVal,
      inc_usuario: usuarioM.id,
      inc_estadoIncidente: estadoIncidenteM.id,
    };
  } 
  else if (idTipoIncidente > 0 && estadoIncidenteVal === 0) {
    payloadTipoIncidente = {
      idMYSQL: idTipoIncidente,
    };
    tipoIncidenteM = await getModeloBD(
      "tipoIncidente",
      payloadTipoIncidente,
      "MONGO"
    );

    query = {
      inc_estado: estadoVal,
      inc_usuarioId: idUsuario,
      inc_tipoIncidenteId: idTipoIncidente,
    };
    queryMongo = {
      inc_estado: estadoVal,
      inc_usuario: usuarioM.id,
      inc_tipoIncidente: tipoIncidenteM.id,
    };
  }

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
      IncidenteM.countDocuments(queryMongo),
      IncidenteM.find(query).skip(Number(desde)).limit(Number(limite)),
      IncidenteM.find(queryMongo)
        .populate("inc_usuario", [
          "id",
          "nombre",
          "numDocumento",
          "correo",
          "telefono",
          "idMYSQL",
          "dependencia",
          "role",
        ])
        .populate("inc_usuarioRevision", [
          "id",
          "nombre",
          "correo",
          "idMYSQL",
          "role",
        ])
        .populate("inc_tipoIncidente", [
          "id",
          "idMYSQL",
          "tinc_nombre",
          "tinc_descripcion",
        ])
        .populate("inc_estadoIncidente", [
          "id",
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

    return res.status(200).json({
      msg: "get API -getIncidentesPorUsuario",
      totalMYSQL,
      incidentesMy,
      totalMongoDB,
      incidentesMo,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

const getIncidentesPorUsuarioCedula = async (req: Request, res: Response) => {
  const { id: documento } = req.params;

  let { desde=0,limite=5 } = req.query;
  let limiteM = Number(limite);
  let desdeM = Number(desde);


  const payloadUsuario={
    where:{ numDocumento:documento }
  }
  const payloadUsuarioM = {
    numDocumento: documento,
  };

  const usuario= await getModeloBD("usuario",payloadUsuario,"MYSQL");

  const usuarioM = await getModeloBD("usuario", payloadUsuarioM, "MONGO");
  if(!usuario || !usuarioM ){
    return res.status(200).json({
      msg: `No existe el usuario `,
    });
  }
  
   
  const query={
    inc_usuarioId:usuario.id
  }
  const queryMongo={
    inc_usuario:usuarioM.id
  }

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
      IncidenteM.countDocuments(queryMongo),
      IncidenteM.find(query).skip(Number(desde)).limit(Number(limite)),
      IncidenteM.find(queryMongo)
        .populate("inc_usuario", [
          "id",
          "nombre",
          "numDocumento",
          "correo",
          "telefono",
          "idMYSQL",
          "dependencia",
          "role",
        ])
        .populate("inc_usuarioRevision", [
          "id",
          "nombre",
          "correo",
          "idMYSQL",
          "role",
        ])
        .populate("inc_tipoIncidente", [
          "id",
          "idMYSQL",
          "tinc_nombre",
          "tinc_descripcion",
        ])
        .populate("inc_estadoIncidente", [
          "id",
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

    return res.status(200).json({
      msg: "get API -getIncidentesPorUsuarioCedula",
      totalMYSQL,
      incidentesMy,
      totalMongoDB,
      incidentesMo,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};


const getIncidentesPorTipoEstado = async (req: Request, res: Response) => {
  const { id } = req.params;
  let { estadoIncidente = 0, estado = true ,desde=0,limite=5} = req.query;

  const idTipoIncidente = Number(id);

  let estadoIncidenteVal = Number(estadoIncidente);
  let estadoVal: boolean = Boolean(estado);

  let limiteM = Number(limite);
  let desdeM = Number(desde);


  let query: any,
    queryMongo: any,
    payloadEstadoIncidente: any,
    payloadTipoIncidente: any,
    estadoIncidenteM: any,
    tipoIncidenteM: any;

  if (idTipoIncidente > 0 && estadoIncidenteVal > 0) {
    payloadTipoIncidente = {
      idMYSQL: idTipoIncidente,
    };

    payloadEstadoIncidente = {
      idMYSQL: estadoIncidenteVal,
    };
    tipoIncidenteM = await getModeloBD(
      "tipoIncidente",
      payloadTipoIncidente,
      "MONGO"
    );

    estadoIncidenteM = await getModeloBD(
      "estadoIncidente",
      payloadEstadoIncidente,
      "MONGO"
    );

    query = {
      inc_estado: estadoVal,
      inc_tipoIncidenteId: idTipoIncidente,
      inc_estadoIncidenteId: estadoIncidenteVal,
    };
    queryMongo = {
      inc_estado: estadoVal,
      inc_tipoIncidente: tipoIncidenteM.id,
      inc_estadoIncidente: estadoIncidenteM.id,
    };
  } else if (idTipoIncidente > 0 && estadoIncidenteVal == 0) {
    payloadTipoIncidente = {
      idMYSQL: idTipoIncidente,
    };
    tipoIncidenteM = await getModeloBD(
      "tipoIncidente",
      payloadTipoIncidente,
      "MONGO"
    );

    query = {
      inc_estado: estadoVal,
      inc_tipoIncidenteId: idTipoIncidente,
    };
    queryMongo = {
      inc_estado: estadoVal,
      inc_tipoIncidente: tipoIncidenteM.id,
    };
  } else if (idTipoIncidente == 0 && estadoIncidenteVal > 0) {
    payloadEstadoIncidente = {
      idMYSQL: estadoIncidenteVal,
    };

    estadoIncidenteM = await getModeloBD(
      "estadoIncidente",
      payloadEstadoIncidente,
      "MONGO"
    );

    query = {
      inc_estado: estadoVal,
      inc_estadoIncidenteId: estadoIncidenteVal,
    };
    queryMongo = {
      inc_estado: estadoVal,
      inc_estadoIncidente: estadoIncidenteM.id,
    };
  } else if (idTipoIncidente == 0 && estadoIncidenteVal == 0) {
    query = {
      inc_estado: estadoVal,
    };
    queryMongo = {
      inc_estado: estadoVal,
    };
  }

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
      IncidenteM.countDocuments(queryMongo),
      IncidenteM.find(query).skip(Number(desde)).limit(Number(limite)),
      IncidenteM.find(queryMongo)
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

    console.log("totalMongoDB", totalMongoDB);

    if (!incidentesMo || !incidentesMy) {
      return res.status(400).json({
        msg: `No hay Incidencias registradas en la base de datos`,
      });
    }

    return res.status(200).json({
      msg: "get API -getIncidencias",
      totalMYSQL,
      incidentesMy,
      totalMongoDB,
      incidentesMo,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};





const getUsuariosPorDependencia = async (req: Request, res: Response) => {
  const { id: idDependencia } = req.params;
  let { estado = true } = req.query;

  let estadoVal: boolean = Boolean(estado);

  const payloadDependencia = {
    idMYSQL: idDependencia,
  };

  //Obtener la dependencia MYSQL
  let dependencia: any = await getModeloBD(
    "dependencia",
    payloadDependencia,
    "MYSQL"
  );

  let dependenciaM: any = await getModeloBD(
    "dependencia",
    payloadDependencia,
    "MONGO"
  );
  if (!dependencia) {
    return res.status(404).json({
      msg: `No se encontro dependencia con el id ${idDependencia} en base de datos MYSQL`,
    });
  } else if (!dependenciaM) {
    return res.status(404).json({
      msg: `No se encontro dependencia con el id ${idDependencia} en base de datos MONGODB`,
    });
  }

  console.log(dependenciaM);

  let query, queryMongo;

  if (Number(idDependencia) !== 0 && estadoVal !== undefined) {
    query = {
      estado: estadoVal,
      dependenciaId: idDependencia,
    };
    queryMongo = {
      estado: estadoVal,
      dependencia: dependenciaM.id,
    };
  }

  try {
    //Buscar todas los incidentes

    //MYSQL
    const [totalMYSQL, usuariosMy] = await Promise.all([
      Usuario.count({ where: query }),
      Usuario.findAll({
        where: query,
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
      }),
    ]);

    //MONGODB
    const [totalMongoDB, usuariosMo] = await Promise.all([
      UsuarioM.countDocuments(queryMongo),
      // TipoDocumentoM.find(query).skip(Number(desde)).limit(Number(limite)),
      UsuarioM.find(queryMongo)
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
        ]),
    ]);

    if (!usuariosMy || !usuariosMo) {
      return res.status(400).json({
        msg: `No hay usuarios registrados en la base de datos`,
      });
    }

    res.status(200).json({
      msg: "get API -getUsuarios",
      totalMYSQL,
      usuariosMy,
      totalMongoDB,
      usuariosMo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

const getUsuariosPorRole = async (req: Request, res: Response) => {
  const { id: idRole } = req.params;
  let { estado = true } = req.query;

  let estadoVal: boolean = Boolean(estado);

  const payloadRole = {
    idMYSQL: idRole,
  };

  //Obtener la dependencia MYSQL
  let role: any = await getModeloBD("role", payloadRole, "MYSQL");

  let roleM: any = await getModeloBD("role", payloadRole, "MONGO");
  if (!role) {
    return res.status(404).json({
      msg: `No se encontro role con el id ${idRole} en base de datos MYSQL`,
    });
  } else if (!roleM) {
    return res.status(404).json({
      msg: `No se encontro role con el id ${idRole} en base de datos MONGODB`,
    });
  }

  console.log(roleM);

  let query, queryMongo;

  if (Number(idRole) !== 0 && estadoVal !== undefined) {
    query = {
      estado: estadoVal,
      roleId: idRole,
    };
    queryMongo = {
      estado: estadoVal,
      role: roleM.id,
    };
  }

  try {
    //Buscar todas los incidentes

    //MYSQL
    const [totalMYSQL, usuariosMy] = await Promise.all([
      Usuario.count({ where: query }),
      Usuario.findAll({
        where: query,
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
      }),
    ]);

    //MONGODB
    const [totalMongoDB, usuariosMo] = await Promise.all([
      UsuarioM.countDocuments(queryMongo),
      // TipoDocumentoM.find(query).skip(Number(desde)).limit(Number(limite)),
      UsuarioM.find(queryMongo)
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
        ]),
    ]);

    if (!usuariosMy || !usuariosMo) {
      return res.status(400).json({
        msg: `No hay usuarios registrados en la base de datos`,
      });
    }

    res.status(200).json({
      msg: "get API -getUsuarios",
      totalMYSQL,
      usuariosMy,
      totalMongoDB,
      usuariosMo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

const getUsuarioPorCedula= async(req:Request,res:Response)=>{

  const {id} = req.params;
  

  const query = {
    numDocumento: id,
  };
  try {
    //Obtener la dependencia MYSQL
    let usuarioMy: any = await Usuario.findOne({
      where: query,
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

    //Obtener la dependencia MONGODB
    let usuarioMo: any = await UsuarioM.findOne({ numDocumento: id })
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

    if (!usuarioMy) {
      usuarioMy = {
        msg: "No se encontro en base MYSQL",
      };
    } 
     if (!usuarioMo) {
      usuarioMo = {
        msg: "No se encontro en base MONGODB",
      };
    }

    res.status(200).json({
      msg: "get API -getUsuario ",
      usuarioMy,
      usuarioMo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
  

}




export const buscar = (req: Request, res: Response) => {
  const { coleccion } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "incidentesTipoEstado":
      getIncidentesPorTipoEstado(req, res);
      break;
    case "incidentesUsuario":
      getIncidentesPorUsuario(req, res);
      break;
    case "usuariosDependencia":
      getUsuariosPorDependencia(req, res);
      break;
    case "usuariosRole":
      getUsuariosPorRole(req, res);
      break;
    case "usuarioDocumento":
      getUsuarioPorCedula(req, res);
      break;
    case "incidentesUsuarioDocumento":
      getIncidentesPorUsuarioCedula(req, res);
      break;
    
    default:
      return res.status(500).json({
        msg: "Se le olvido hacer esta busqueda",
      });
  }
};
