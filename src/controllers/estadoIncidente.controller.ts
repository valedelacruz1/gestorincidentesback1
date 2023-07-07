//TODO: PULIR CONTROLADOR

import { Request, Response } from "express";

const { EstadoIncidenteM } = require("../models/MongoDB/index");
import EstadoIncidente from "../models/MySQL/estadoIncidente";
import { getModeloBD } from "../helpers/getModelo";

export const crearEstadoIncidente = async (req: Request, res: Response) => {
  const { est_nombre, est_descripcion, ...body } = req.body;

  try {
    //Verificar que no exista ya uno con el mismo nombre

    //MYSQL
    const estadoIncidenteDB = await EstadoIncidente.findOne({
      where: { est_nombre: est_nombre },
    });

    //MONGODB
    const estadoIncidenteMDB = await EstadoIncidenteM.findOne({
      est_nombre: est_nombre,
    });

    if (estadoIncidenteDB || estadoIncidenteMDB) {
      return res.status(400).json({
        msg: `El Estado Incidente ${estadoIncidenteMDB.est_nombre},ya existe`,
      });
    }

    //Generar la data a guardar
    const data = {
      est_nombre,
      est_descripcion,
      ...body,
    };

    //MYSQL
    const estadoIncidente: any = await EstadoIncidente.create(data);

    //MONGODB
    const estadoIncidenteM = new EstadoIncidenteM({
      idMYSQL: estadoIncidente.id,
      ...data,
    });
    await estadoIncidenteM.save();

    res.status(201).json({
      msg: "Estado de Incidente creado correctamente.",
      estadoIncidente,
      estadoIncidenteM,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

export const getEstadoIncidentes = async (req: Request, res: Response) => {
  // const { limite = 5, desde = 0 } = req.query;

  const query = {
    est_estado: true,
  };

  try {
    //Buscar todas las dependencias

    //MYSQL
    const [totalMYSQL, estadoIncidentesMy]: any = await Promise.all([
      EstadoIncidente.count({ where: query }),
      EstadoIncidente.findAll({ where: query }),
    ]);

    //MONGODB
    const [totalMongoDB, estadoIncidentesMo] = await Promise.all([
      EstadoIncidenteM.countDocuments(query),
      // TipoDocumentoM.find(query).skip(Number(desde)).limit(Number(limite)),
      EstadoIncidenteM.find(query),
    ]);

    if (!estadoIncidentesMo || !estadoIncidentesMy) {
      return res.status(400).json({
        msg: `No hay Estados Incidente registrados en la base de datos`,
      });
    }

    res.status(200).json({
      msg: "get Api-getEstadoIncidentes",
      totalMYSQL,
      estadoIncidentesMy,
      totalMongoDB,
      estadoIncidentesMo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

export const getEstadoIncidente = async (req: Request, res: Response) => {
  const { id } = req.params;

  const query = {
    id: id,
  };
  const queryMongo = {
    idMYSQL: id,
  };
  try {
    //Obtener la dependencia MYSQL

    let estadoIncidente: any = await getModeloBD(
      "estadoIncidente",
      query,
      "MYSQL"
    );

    //Obtener la dependencia MONGODB
    let estadoIncidenteM: any = await getModeloBD(
      "estadoIncidente",
      queryMongo,
      "MONGO"
    );

    if (!estadoIncidente) {
      estadoIncidente = {
        msg: "No se encontro en base MYSQL",
      };
    } else if (!estadoIncidenteM) {
      estadoIncidenteM = {
        msg: "No se encontro en base MONGODB",
      };
    }

    res.status(200).json({
      msg: "get API- getEstadoIncidente",
      estadoIncidente,
      estadoIncidenteM,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

export const actualizarEstadoIncidente = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const { body } = req;

  //Asignando el usuario que lo esta actualizando
  // data.usuario = req.usuario._id;

  try {
    //Verificar que exista ya uno con el mismo nombre

    //MYSQL
    //Obtener la dependencia MYSQL
    const estadoIncidenteDB = await EstadoIncidente.findByPk(id);

    //Obtener la dependencia MONGODB

    const estadoIncidenteMDB = await getModeloBD(
      "estadoIncidente",
      { idMYSQL: id },
      "MONGO"
    );

    if (!estadoIncidenteDB) {
      return res.status(404).json({
        msg: `No se encontro Estado Incidente con el id ${id} en base de datos MYSQL`,
      });
    } else if (!estadoIncidenteMDB) {
      return res.status(404).json({
        msg: `No se encontro Estado Incidente con el id ${id} en base de datos MONGODB`,
      });
    }

    //actualizar la dependencia en MYSQL
    await estadoIncidenteDB.update(body);

    const { id: idMongo } = estadoIncidenteMDB;

    //actualizar la dependencia en MONGODB
    await estadoIncidenteMDB.findOneAndUpdate({ _id: idMongo }, body, {
      new: true,
    });

    res.status(200).json({
      msg: "Estado de Incidente Actualizado correctamente.",
      estadoIncidenteDB,
      estadoIncidenteMDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

export const borrarEstadoIncidente = async (req: Request, res: Response) => {
  const { id } = req.params;

  //Deshabilitar

  try {
    //MYSQL
    const estadoIncidenteMYSQL = await EstadoIncidente.findByPk(id);
    if (!estadoIncidenteMYSQL) {
      return res.status(404).json({
        msg: "No existe un Estado Incidente con el id" + id,
      });
    }

    //Obtener la dependencia MONGODB
    const estadoIncidenteMDB = await EstadoIncidenteM.findOne({ idMYSQL: id });
    const { id: idMongo } = estadoIncidenteMDB;

    //MYSQL
    await estadoIncidenteMYSQL.update({ est_estado: false });

    //MongoDB
    const estadoIncidenteM = await EstadoIncidenteM.findByIdAndUpdate(
      idMongo,
      { est_estado: false },
      { new: true }
    );

    res.status(200).json({
      msg: "Estado de Incidente deshabilitado",
      estadoIncidenteMYSQL,
      estadoIncidenteM,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

export const borrarEstadoIncidentePermanente = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  //Fisicamente lo borramos

  try {
    //MYSQL
    const estadoIncidenteMYSQL = await EstadoIncidente.findByPk(id);
    if (!estadoIncidenteMYSQL) {
      return res.status(404).json({
        msg: "No existe un Estado Incidente con el id" + id,
      });
    }

    //Obtener la dependencia MONGODB
    const EstadoIncidenteMDB = await EstadoIncidenteM.findOne({ idMYSQL: id });
    const { id: idMongo } = EstadoIncidenteMDB;

    //Eliminar en MYSQL
    await estadoIncidenteMYSQL.destroy();
    //Eliminar en MONGODB
    const estadoIncidenteMongo = await EstadoIncidenteM.findByIdAndDelete(
      idMongo
    );

    res.status(200).json({
      msg: "Tipo de Documento borrado",
      estadoIncidenteMYSQL,
      estadoIncidenteMongo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};
