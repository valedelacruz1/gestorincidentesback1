const {
  DependenciaM,
  EstadoIncidenteM,
  IncidenteM,
  RoleM,
  TipoDocumentoM,
  TipoIncidenteM,
  UsuarioM,
} = require("../models/MongoDB/index");

import Dependencia from "../models/MySQL/dependencia";
import EstadoIncidente from "../models/MySQL/estadoIncidente";
import Incidente from "../models/MySQL/incidente";
import Role from "../models/MySQL/role";
import TipoDocumento from "../models/MySQL/tipoDocumento";
import TipoIncidente from "../models/MySQL/tipoIncidente";
import Usuario from "../models/MySQL/usuario";

export const getModeloBD = async (
  modelo: string,
  payload: object,
  basedeDatos: string
) => {
  let modeloRespuesta: any;

  switch (basedeDatos) {
    case "MONGO":
      
      switch (modelo) {
        case "dependencia":
          modeloRespuesta = await DependenciaM.findOne(payload);
          break;
        case "estadoIncidente":
          modeloRespuesta = await EstadoIncidenteM.findOne(payload);
          break;
        case "incidente":
          modeloRespuesta = await IncidenteM.findOne(payload);
          break;
        case "role":
          modeloRespuesta = await RoleM.findOne(payload);
          break;
        case "tipoDocumento":
          modeloRespuesta = await TipoDocumentoM.findOne(payload);
          break;
        case "tipoIncidente":
          modeloRespuesta = await TipoIncidenteM.findOne(payload);
          break;
        case "usuario":
          modeloRespuesta = await UsuarioM.findOne(payload);
          break;

        default:
          break;
      }

      break;

    case "MYSQL":
    

      switch (modelo) {
        case "dependencia":
          modeloRespuesta = await Dependencia.findOne(payload);
          break;
        case "estadoIncidente":
          modeloRespuesta = await EstadoIncidente.findOne(payload);
          break;
        case "incidente":
          modeloRespuesta = await Incidente.findOne(payload);
          break;
        case "role":
          modeloRespuesta = await Role.findOne(payload);
          break;
        case "tipoDocumento":
          modeloRespuesta = await TipoDocumento.findOne(payload);
          break;
        case "tipoIncidente":
          modeloRespuesta = await TipoIncidente.findOne(payload);
          break;
        case "usuario":
          modeloRespuesta = await Usuario.findOne(payload);
          break;
        default:
          break;
      }

      break;

    default:
      break;
  }

  return modeloRespuesta;
};
