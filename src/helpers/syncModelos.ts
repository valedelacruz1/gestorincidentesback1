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

export const insercionSincronizacion = async (
  tablaDestino: string,
  baseDeDatos: string,
  payload: any
) => {
  switch (baseDeDatos) {
    case "MYSQL":
      switch (tablaDestino) {
        case "dependencia":
          // modeloRespuesta = await Dependencia.findOne(payload);
          const dependenciaCreada: any = await Dependencia.create(payload);

          //Actualizar el idmysql de la entidad que estaba en mongo

          const dataMDB = {
            idMYSQL: dependenciaCreada.id,
            ...dependenciaCreada,
          };

          const dependenciaMActualizada = await DependenciaM.findOneAndUpdate(
            payload.id,
            dataMDB,
            {
              new: true,
            }
          );

          break;
        case "estadoIncidente":
          // modeloRespuesta = await EstadoIncidente.findOne(payload);
          break;
        case "incidente":
          // modeloRespuesta = await Incidente.findOne(payload);
          break;
        case "role":
          // modeloRespuesta = await Role.findOne(payload);
          break;
        case "tipoDocumento":
          // modeloRespuesta = await TipoDocumento.findOne(payload);
          break;
        case "tipoIncidente":
          // modeloRespuesta = await TipoIncidente.findOne(payload);
          break;
        case "usuario":
          // modeloRespuesta = await Usuario.findOne(payload);
          break;
        default:
          break;
      }

      // const {idMYSQL,id,_id,...dependenciaFiltrada}=dependencia;

      // const dependenciaCreada: any = await Dependencia.create(dependenciaFiltrada);
      break;
    case "MONGO":
      break;

    default:
      break;
  }
};

export const actualizarSincronizacion = async (
  tablaDestino: string,
  baseDeDatos: string,
  payload: any
) => {
  const { id } = payload.id;
  // const dependenciaActualizada
};
