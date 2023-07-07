// TODO: Pulir los controladores de borrar y los demas
import { Request, Response } from "express";

const { TipoIncidenteM } = require("../models/MongoDB/index");
import TipoIncidente from "../models/MySQL/tipoIncidente";

export const crearTipoIncidente = async (req: Request, res: Response) => {
  const { tinc_nombre, tinc_descripcion, tinc_estado, ...body } = req.body;

  try {
    //Verificar que no exista ya uno con el mismo nombre

    //MYSQL
    const tipoIncidenteDB = await TipoIncidente.findOne({
      where: {
        tinc_nombre: tinc_nombre,
      },
    });

    //MONGODB
    const tipoIncidenteMDB = await TipoIncidenteM.findOne({
      tinc_nombre: tinc_nombre,
    });

    if (tipoIncidenteDB || tipoIncidenteMDB) {
      return res.status(400).json({
        msg: `El tipo de incidente ${ tipoIncidenteMDB.tinc_nombre},ya existe`,
      });
    }

    //Generar la data a guardar
    const data = {
      tinc_nombre,
      tinc_descripcion,
      ...body,
    };

    //MYSQL
    const tipoIncidente: any = await TipoIncidente.create(data);

    //MONGODB
    const tipoIncidenteM = new TipoIncidenteM({
      idMYSQL: tipoIncidente.id,
      ...data,
    });
    await tipoIncidenteM.save();

    res.status(201).json({
      msg: "Tipo de Incidente creado correctamente.",
      tipoIncidente,
      tipoIncidenteM,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador.",
      //BDSTATUS
    });
  }
};

export const getTipoIncidentes = async (req: Request, res: Response) => {
  // const { limite = 5, desde = 0 } = req.query;

  const query = {
    tinc_estado: true,
  };

  try {
  //Buscar todos los Tipos de Incidentes

  //MYSQL
    const [totalMYSQL, tipoIncidentesMy]: any = await Promise.all([
    TipoIncidente.count({ where: query }),
    TipoIncidente.findAll({ where: query }),
  ]);
  //MONGODB
  const [totalMongoDB, tipoIncidentesMo] = await Promise.all([
    TipoIncidenteM.countDocuments(query),
    // tipoIncidenteM.find(query).skip(Number(desde)).limit(Number(limite)),
    TipoIncidenteM.find(query),
  ]);

  if (!tipoIncidentesMo || !tipoIncidentesMy) {
    return res.status(400).json({
      msg: `No hay tipos de Incidente registrados en la base de datos`,
    });
  }

  res.json({
    msg: "get API -gettipoIncidentes",
    totalMYSQL,
    tipoIncidentesMy,
    totalMongoDB,
    tipoIncidentesMo,
  });  
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }

  
};

export const getTipoIncidente = async (req: Request, res: Response) => {
  const { id } = req.params;

  const query = {
    id: id,

  };

  try {
    //Obtener el tipo de Incidente MYSQL
  
  let tipoIncidente: any = await TipoIncidente.findOne({ where: query });

  //Obtener la dependencia MONGODB
  let tipoIncidenteM: any = await TipoIncidenteM.findOne({ idMYSQL: id });

  if (!tipoIncidente) {
    tipoIncidente = {
      msg: "No se encontro en base MYSQL",
    };
  } else if (!tipoIncidenteM) {
    tipoIncidenteM = {
      msg: "No se encontro en base MONGODB",
    };
  }

  res.status(200).json({
    msg: "get API -getTipoIncidente ",
    tipoIncidente,
    tipoIncidenteM,
  });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }

  
};

export const actualizarTipoIncidente = async (req: any, res: Response) => {
  const { id } = req.params;

  const { body } = req;

  //Asignando el usuario que lo esta actualizando
  // data.usuario = req.usuario._id;

  try {
    //Verificar que exista ya uno con el mismo nombre

    //MYSQL
    //Obtener la dependencia MYSQL
    const tipoIncidenteDB = await TipoIncidente.findByPk(id);

    //Obtener la dependencia MONGODB
    const tipoIncidenteMDB = await TipoIncidenteM.findOne({ idMYSQL: id });
    const { id: idMongo } = tipoIncidenteMDB;
    const dataMDB = { updatedAt: Date.now(), ...body };

    if (!tipoIncidenteDB) {
      return res.status(404).json({
        msg: `No se encontro Tipo de Incidente con el id ${id} en base de datos MYSQL`,
      });
    } else if (!tipoIncidenteMDB) {
      return res.status(404).json({
        msg: `No se encontro Tipo de Incidente con el id ${id} en base de datos MONGODB`,
      });
    }


    //actualizar la dependencia en MYSQL
    const tipoIncidenteActualizada = await tipoIncidenteDB.update(body);

    //actualizar la dependencia en MONGODB

    const tipoIncidenteMActualizada = await TipoIncidenteM.findOneAndUpdate(
      idMongo,
      dataMDB,
      {
        new: true,
      }
    );


    res.status(200).json({
      msg:'Tipo de Incidente Actualizado Correctamente.',
      tipoIncidenteActualizada,
      tipoIncidenteMActualizada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }


};

export const borrarTipoIncidente = async (req: Request, res: Response) => {
  const { id } = req.params;

  //Deshabilitar

  try {
    //MYSQL
  const tipoIncidenteMYSQL = await TipoIncidente.findByPk(id);
  if (!tipoIncidenteMYSQL) {
    return res.status(404).json({
      msg: `No existe un Tipo de Incidente con el id ${id}`,
    });
  }

  //Obtener la dependencia MONGODB
  const tipoIncidenteMDB = await TipoIncidenteM.findOne({ idMYSQL: id });
  const { id: idMongo } = tipoIncidenteMDB;

  //MYSQL
  await tipoIncidenteMYSQL.update({ tinc_estado: false });

  //MongoDB
  const tipoIncidenteM = await TipoIncidenteM.findByIdAndUpdate(
    idMongo,
    { tinc_estado: false, updatedAt: Date.now() },
    { new: true }
  );

  res.status(200).json({ 
    msg:'Tipo de Incidente deshabilitado',
    tipoIncidenteMYSQL,
     tipoIncidenteM });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }

  
};


export const borrarTipoIncidentePermanente = async (  req: Request, res: Response) => {
  const { id } = req.params;

  //Fisicamente lo borramos

  try {
    
  //MYSQL
  const tipoIncidenteMYSQL = await TipoIncidente.findByPk(id);
  if (!tipoIncidenteMYSQL) {
    return res.status(404).json({
      msg: `No existe un Tipo de Incidente con el id  ${id}`,
    });
  }

  //Obtener la dependencia MONGODB
  const tipoIncidenteMDB = await TipoIncidenteM.findOne({ idMYSQL: id });
  const { id: idMongo } = tipoIncidenteMDB;

  //Eliminar en MYSQL
  await tipoIncidenteMYSQL.destroy();
  //Eliminar MONGODB
  const tipoIncidenteMongo = await TipoIncidenteM.findByIdAndDelete(idMongo);

  res.status(200).json({
    msg:'Tipo de Incidente borrado',
    tipoIncidenteMYSQL,
    tipoIncidenteMongo,
  });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }

};