import { Request, Response } from "express";

const { DependenciaM } = require("../models/MongoDB/index");

import Dependencia from "../models/MySQL/dependencia";
import { getModeloBD } from "../helpers/getModelo";
import {
  insercionSincronizacion,
  actualizarSincronizacion,
} from "../helpers/syncModelos";

interface dependenciaMy {
  id: number;
  dep_nombre: string;
  dep_descripcion: string;
  createdAt: Date;
  updatedAt: Date;
}

interface dependenciaMo {
  id: string;
  dep_nombre: string;
  dep_descripcion: string;
  idMYSQL: number;
  createdAt: Date;
  updatedAt: Date;
}

export const crearDependencia = async (req: Request, res: Response) => {
  const { dep_nombre, dep_descripcion, ...body } = req.body;

  try {
    //Verificar que no exista ya uno con el mismo nombre

    //MYSQL
    const dependenciaDB = await Dependencia.findOne({
      where: {
        dep_nombre: dep_nombre,
      },
    });

    //MONGODB
    const dependenciaMDB = await DependenciaM.findOne({
      dep_nombre: dep_nombre,
    });

    if (dependenciaDB || dependenciaMDB) {
      return res.status(400).json({
        msg: `La Dependencia ${dependenciaMDB.dep_nombre},ya existe`,
      });
    }

    //Generar la data a guardar
    const data = {
      dep_nombre,
      dep_descripcion,
      ...body,
    };

    //MYSQL
    const dependencia: any = await Dependencia.create(data);

    //MONGODB
    const dependenciaM = new DependenciaM({
      idMYSQL: dependencia.id || null,
      ...data,
    });
    await dependenciaM.save();

    res.status(201).json({
      msg: "Dependencia Creada Correctamente",
      dependencia,
      dependenciaM,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

export const getDependencias = async (req: Request, res: Response) => {
  // const { limite = 5, desde = 0 } = req.query;

  const query = {
    dep_estado: true,
  };
  try {
    //Buscar todas las dependencias

    //MYSQL
    const [totalMYSQL, dependenciasMy]: any = await Promise.all([
      Dependencia.count({ where: query }),
      Dependencia.findAll({ where: query }),
    ]);

    //MONGODB
    const [totalMongoDB, dependenciasMo] = await Promise.all([
      DependenciaM.countDocuments(query),
      // TipoDocumentoM.find(query).skip(Number(desde)).limit(Number(limite)),
      DependenciaM.find(query),
    ]);

    if (!dependenciasMo || !dependenciasMy) {
      return res.status(400).json({
        msg: `No hay tipos de Documento registrados en la base de datos`,
      });
    }

    res.status(200).json({
      msg: "get API -getDependencias",
      totalMYSQL,
      dependenciasMy,
      totalMongoDB,
      dependenciasMo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

export const getDependencia = async (req: Request, res: Response) => {
  const { id } = req.params;

  const query = {
    id: id,
  };

  const queryMongo = {
    idMYSQL: id,
  };

  try {
    //Obtener la dependencia MYSQL
    let dependencia: any = await getModeloBD("dependencia", query, "MYSQL");

    //Obtener la dependencia MONGODB
    let dependenciaM: any = await getModeloBD(
      "dependencia",
      queryMongo,
      "MONGO"
    );
    // DependenciaM.findOne({ idMYSQL: id });

    if (!dependencia) {
      dependencia = {
        msg: "No se encontro en base MYSQL",
      };
    } else if (!dependenciaM) {
      dependenciaM = {
        msg: "No se encontro en base MONGODB",
      };
    }

    res.status(200).json({
      msg: "get API -getDependencia ",
      dependencia,
      dependenciaM,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

export const actualizarDependencia = async (req: any, res: Response) => {
  const { id } = req.params;

  const { body } = req;

  //Asignando el usuario que lo esta actualizando
  // data.usuario = req.usuario._id;

  try {
    //Verificar que exista ya uno con el mismo nombre

    //MYSQL
    //Obtener la dependencia MYSQL
    const dependenciaDB = await Dependencia.findByPk(id);

    //Obtener la dependencia MONGODB
    const dependenciaMDB = await DependenciaM.findOne({ idMYSQL: id });
    const { id: idMongo } = dependenciaMDB;
    const dataMDB = { updatedAt: Date.now(), ...body };

    if (!dependenciaDB) {
      return res.status(404).json({
        msg: `No se encontro dependencia con el id ${id} en base de datos MYSQL`,
      });
    } else if (!dependenciaMDB) {
      return res.status(404).json({
        msg: `No se encontro dependencia con el id ${id} en base de datos MONGODB`,
      });
    }

    //actualizar la dependencia en MYSQL
    const dependenciaActualizada = await dependenciaDB.update(body);

    //actualizar la dependencia en MONGODB

    const dependenciaMActualizada = await DependenciaM.findOneAndUpdate(
      { _id: idMongo },
      dataMDB,
      {
        new: true,
      }
    );

    res.status(200).json({
      msg: "Dependencia Actualizada",
      dependenciaActualizada,
      dependenciaMActualizada,
      // dataMDB
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

export const borrarDependencia = async (req: Request, res: Response) => {
  const { id } = req.params;

  const query = {
    id,
  };

  const queryMongo = {
    idMYSQL: id,
  };

  //Deshabilitar

  try {
    //MYSQL
    const dependenciaDB = await Dependencia.findByPk(id);
    if (!dependenciaDB) {
      return res.status(404).json({
        msg: `No existe una dependencia con el id ${id}`,
      });
    }

    //Obtener la dependencia MONGODB
    const dependenciaMDB = await getModeloBD(
      "dependencia",
      queryMongo,
      "MONGO"
    );

    const { id: idMongo } = dependenciaMDB;
    //MYSQL
    await dependenciaDB.update({ dep_estado: false });

    //MongoDB
    const dependenciaM = await DependenciaM.findByIdAndUpdate(
      idMongo,
      { dep_estado: false, updatedAt: Date.now() },
      { new: true }
    );

    res.status(200).json({
      msg: "Dependencia deshabilitada",
      dependenciaDB,
      dependenciaM,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

export const borrarDependenciaPermanente = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  //Fisicamente lo borramos

  try {
    //MYSQL
    const dependenciaMYSQL = await Dependencia.findByPk(id);
    if (!dependenciaMYSQL) {
      return res.status(404).json({
        msg: "No existe una dependencia con el id" + id,
      });
    }

    //Obtener la dependencia MONGODB
    const dependenciaMDB = await DependenciaM.findOne({ idMYSQL: id });
    const { id: idMongo } = dependenciaMDB;

    //Eliminar en MYSQL
    await dependenciaMYSQL.destroy();
    //Eliminar MONGODB
    const dependenciaMongo = await DependenciaM.findByIdAndDelete(idMongo);

    res.status(200).json({
      msg: "Tipo de documento borrado",
      dependenciaMYSQL,
      dependenciaMongo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

export const sincronizarTablaDependencia = async () => {
  const [totalMYSQL, dependenciasMy]: any = await Promise.all([
    Dependencia.count(),
    Dependencia.findAll(),
  ]);

  //MONGODB
  const [totalMongoDB, dependenciasMo]: any = await Promise.all([
    DependenciaM.countDocuments(),
    DependenciaM.find(),
  ]);

  //INSERTAR
  //mongo tiene mas que mysql
  if (totalMongoDB > totalMYSQL) {
    //Si esta que tengo en mongo no esta en mysql se la meto a mysql
    let query;
    dependenciasMo.forEach((dependenciaMo: dependenciaMo) => {
      query = {
        id: dependenciaMo.id,
      };
      let isOnMYSQL = getModeloBD("dependencia", query, "MYSQL");

      //SI NO ESTA EN MYSQL LO INSERTA
      if (!isOnMYSQL) {
        //Generar la data a guardar

        const { id, idMYSQL, ...data } = dependenciaMo;
        let dependenciaEnvio = { ...data };

        insercionSincronizacion("dependencia", "MYSQL", dependenciaEnvio);
      }
    });
  }
  //mysql tiene mas que mongo
  else if (totalMYSQL > totalMongoDB) {
    let queryMongo;
    dependenciasMo.forEach((dependenciaMy: dependenciaMy) => {
      queryMongo = {
        idMYSQL: dependenciaMy.id,
      };
      let isOnMONGO = getModeloBD("dependencia", queryMongo, "MONGO");

      //SI NO ESTA EN MYSQL LO INSERTA
      if (!isOnMONGO) {
        //Generar la data a guardar
        let dependenciaEnvio = {
          idMYSQL: dependenciaMy.id,
          ...dependenciaMy,
        };
        insercionSincronizacion("dependencia", "MONGO", dependenciaEnvio);
      }
    });
  }

  //ACTUALIZAR
  if (totalMongoDB == totalMYSQL) {
    dependenciasMo.forEach((dependenciaMo: dependenciaMo) => {
      dependenciasMy.forEach((dependenciaMy: dependenciaMy) => {
        if (dependenciaMy.id === dependenciaMo.idMYSQL) {
          if (
            dependenciaMy.dep_nombre !== dependenciaMo.dep_nombre ||
            dependenciaMy.dep_descripcion !== dependenciasMo.dep_descripcion
          ) {
          }
        }
      });
    });
  }
};
