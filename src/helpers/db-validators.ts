import Dependencia from "../models/MySQL/dependencia";
import EstadoIncidente from "../models/MySQL/estadoIncidente";
import Incidente from "../models/MySQL/incidente";
import Role from "../models/MySQL/role";
import TipoIncidente from "../models/MySQL/tipoIncidente";
import TipoDocumento from "../models/MySQL/tipoDocumento";
import Usuario from "../models/MySQL/usuario";

const {
  DependenciaM,
  EstadoIncidenteM,
  IncidenteM,
  RoleM,
  TipoIncidenteM,
  TipoDocumentoM,
  UsuarioM,
} = require("../models/MongoDB/index");

export const esRoleValido = async (id: number = 0) => {
  const query = {
    id: id,
  };

  let existeRol: any = await Role.findOne({ where: query });

  //Obtener la el rol MONGODB
  let existeRolMongo: any = await RoleM.findOne({ idMYSQL: id });

  if (!existeRol || !existeRolMongo) {
    throw new Error(`El Rol ${id} no esta registrado en la BD`);
  }
};

export const emailExiste = async (correo = "") => {
  // Verificar si el correo existe

  const existeEmail = await Usuario.findOne({ where: { correo } });
  const existeEmailMongo = await UsuarioM.findOne({ where: { correo } });
  if (existeEmail || existeEmailMongo) {
    throw new Error(`El Correo: ${correo} ya ha sido usado en la BD`);
  }
};
export const usernameExiste = async (username = "") => {
  // Verificar si el username existe

  const existeEmail = await Usuario.findOne({ where: { username } });
  const existeEmailMongo = await UsuarioM.findOne({ where: { username } });
  if (existeEmail || existeEmailMongo) {
    throw new Error(`El username: ${username} ya ha sido usado en la BD`);
  }
};

export const numDocumentoExiste = async (numDocumento = "") => {
  // Verificar si el numero de documento ya  existe

  const existeEmail = await Usuario.findOne({ where: { numDocumento } });
  const existeEmailMongo = await UsuarioM.findOne({ where: { numDocumento } });
  if (existeEmail || existeEmailMongo) {
    throw new Error(`El Numero de documento: ${numDocumento} ya ha sido usado en la BD`);
  }
};
export const telefonoExiste = async (telefono = "") => {
  // Verificar si el numero de documento ya  existe

  const existeEmail = await Usuario.findOne({ where: { telefono } });
  const existeEmailMongo = await UsuarioM.findOne({ where: { telefono } });
  if (existeEmail || existeEmailMongo) {
    throw new Error(`El telefono: ${telefono} ya ha sido usado en la BD`);
  }
};

export const existeUsuarioPorId = async (id: string) => {
  // Verificar si el correo existe

  const existeId = await Usuario.findOne({ where: { id } });
  const existeIdMongo: any = await UsuarioM.findOne({ idMYSQL: id });

  if (!existeId || !existeIdMongo) {
    throw new Error(`El Usuario con id: ${id} no existe en la BD`);
  }
};

// Validadores de Incidente
export const existeIncidentePorId = async (id: string) => {
  // Verificar si el incidente existe

  const existeIncidente = await Incidente.findOne({ where: { id } });

  const existeIncidenteMongo: any = await IncidenteM.findOne({ idMYSQL: id });
  if (!existeIncidente || !existeIncidenteMongo) {
    throw new Error(`El id: ${id} no existe en la BD`);
  }
};

// Validadores de TipoIncidente
export const existeTipoIncidentePorId = async (id: string) => {
  // Verificar si el tipoIncidente existe

  const existeTipoIncidente = await TipoIncidente.findOne({ where: { id } });

  const existeTipoIncidenteMongo: any = await TipoIncidenteM.findOne({
    idMYSQL: id,
  });
  if (!existeTipoIncidente || !existeTipoIncidenteMongo) {
    throw new Error(`El id: ${id} no existe en la BD`);
  }
};

// Validadores de EstadoIncidente
export const existeEstadoIncidentePorId = async (id: string) => {
  // Verificar si el EstadoIncidente existe

  const existeEstadoIncidente = await EstadoIncidente.findOne({
    where: { id },
  });

  const existeEstadoIncidenteMongo: any = await EstadoIncidenteM.findOne({
    idMYSQL: id,
  });
  if (!existeEstadoIncidente || !existeEstadoIncidenteMongo) {
    throw new Error(`El id: ${id} no existe en la BD`);
  }
};

// Validadores de tipoDocumento
export const existeTipoDocumentoPorId = async (id: string) => {
  // Verificar si la tipoDocumento existe

  const existeTipoDocumento = await TipoDocumento.findOne({ where: { id } });

  const existeTipoDocumentoMongo: any = await TipoDocumentoM.findOne({
    idMYSQL: id,
  });
  if (!existeTipoDocumento || !existeTipoDocumentoMongo) {
    throw new Error(`El id: ${id} no existe en la BD`);
  }
};

// Validadores de Dependencia
export const existeDependenciaPorId = async (id: string) => {
  // Verificar si la Dependencia existe

  const existeDependencia = await Dependencia.findOne({ where: { id } });

  const existeDependenciaMongo: any = await DependenciaM.findOne({
    idMYSQL: id,
  });

  if (!existeDependencia || !existeDependenciaMongo) {
    throw new Error(`El id: ${id} no existe en la BD`);
  }
};

// Validar colecciones permitidas
export const coleccionesPermitidas = (
  coleccion: string = "",
  colecciones: string[] = []
) => {
  const incluida = colecciones.includes(coleccion);

  if (!incluida) {
    throw new Error(
      `La coleccion ${coleccion} no es permitida, ${colecciones}`
    );
  }

  return true;
};
