// TODO: Pulir los controladores de borrar y los demas
import { Request, Response } from "express";

const { TipoDocumentoM } = require("../models/MongoDB/index");
import TipoDocumento from "../models/MySQL/tipoDocumento";

export const crearTipoDocumento = async (req: Request, res: Response) => {
  const { tdoc_nombre, tdoc_descripcion, tdoc_estado, ...body } = req.body;

  try {
    //Verificar que no exista ya uno con el mismo nombre

    //MYSQL
    const tipoDocumentoDB = await TipoDocumento.findOne({
      where: {
        tdoc_nombre: tdoc_nombre,
      },
    });

    //MONGODB
    const tipoDocumentoMDB = await TipoDocumentoM.findOne({
      tdoc_nombre: tdoc_nombre,
    });

    if (tipoDocumentoDB || tipoDocumentoMDB) {
      return res.status(400).json({
        msg: `El tipo de documento ${tipoDocumentoMDB.tdoc_nombre},ya existe`,
      });
    }

    //Generar la data a guardar
    const data = {
      tdoc_nombre,
      tdoc_descripcion,
      ...body,
    };

    //MYSQL
    const tipoDocumento: any = await TipoDocumento.create(data);

    //MONGODB
    const tipoDocumentoM = new TipoDocumentoM({
      idMYSQL: tipoDocumento.id,
      ...data,
    });
    await tipoDocumentoM.save();

    res.status(201).json({
      msg: "Tipo de Documento creado correctamente.",
      tipoDocumento,
      tipoDocumentoM,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador.",
      //BDSTATUS
    });
  }
};

export const getTipoDocumentos = async (req: Request, res: Response) => {
  // const { limite = 5, desde = 0 } = req.query;

  const query = {
    tdoc_estado: true,
  };

  try {
    //Buscar todos los Tipos de Documentos

    //MYSQL

    const [totalMYSQL, tipoDocumentosMy]: any = await Promise.all([
      TipoDocumento.count({ where: query }),
      TipoDocumento.findAll({ where: query }),
    ]);

    //MONGODB
    const [totalMongoDB, tipoDocumentosMo] = await Promise.all([
      TipoDocumentoM.countDocuments(query),
      // TipoDocumentoM.find(query).skip(Number(desde)).limit(Number(limite)),
      TipoDocumentoM.find(query),
    ]);

    if (!tipoDocumentosMo || !tipoDocumentosMy) {
      return res.status(400).json({
        msg: `No hay tipos de Documento registrados en la base de datos`,
      });
    }

    res.json({
      msg: "get API -getTipoDocumentos",
      totalMYSQL,
      tipoDocumentosMy,
      totalMongoDB,
      tipoDocumentosMo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

export const getTipoDocumento = async (req: Request, res: Response) => {
  const { id } = req.params;

  const query = {
    id: id,
  };

  try {
    //Obtener el tipo de documento MYSQL

    let tipoDocumento: any = await TipoDocumento.findOne({ where: query });

    //Obtener la dependencia MONGODB
    let tipoDocumentoM: any = await TipoDocumentoM.findOne({ idMYSQL: id });

    if (!tipoDocumento) {
      tipoDocumento = {
        msg: "No se encontro en base MYSQL",
      };
    } else if (!tipoDocumentoM) {
      tipoDocumentoM = {
        msg: "No se encontro en base MONGODB",
      };
    }

    res.status(200).json({
      msg: "get API -getTipoDocumento ",
      tipoDocumento,
      tipoDocumentoM,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

export const actualizarTipoDocumento = async (req: any, res: Response) => {
  const { id } = req.params;

  const { body } = req;

  //Asignando el usuario que lo esta actualizando
  // data.usuario = req.usuario._id;

  try {
    //Verificar que exista ya uno con el mismo nombre

    //MYSQL
    //Obtener la dependencia MYSQL
    const tipoDocumentoDB = await TipoDocumento.findByPk(id);

    //Obtener la dependencia MONGODB
    const tipoDocumentoMDB = await TipoDocumentoM.findOne({ idMYSQL: id });
    const { id: idMongo } = tipoDocumentoMDB;
    const dataMDB = { updatedAt: Date.now(), ...body };

    if (!tipoDocumentoDB) {
      return res.status(404).json({
        msg: `No se encontro Tipo de Documento con el id ${id} en base de datos MYSQL`,
      });
    } else if (!tipoDocumentoMDB) {
      return res.status(404).json({
        msg: `No se encontro Tipo de Documento con el id ${id} en base de datos MONGODB`,
      });
    }

    //actualizar la dependencia en MYSQL
    const tipoDocumentoActualizada = await tipoDocumentoDB.update(body);

    //actualizar la dependencia en MONGODB

    const tipoDocumentoMActualizada = await TipoDocumentoM.findOneAndUpdate(
      {_id:idMongo},
      dataMDB,
      {
        new: true,
      }
    );

    res.status(200).json({
      msg: "Tipo de Documento Actualizado Correctamente.",
      tipoDocumentoActualizada,
      tipoDocumentoMActualizada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

export const borrarTipoDocumento = async (req: Request, res: Response) => {
  const { id } = req.params;

  //Deshabilitar

  try {
    //MYSQL
    const tipoDocumentoMYSQL = await TipoDocumento.findByPk(id);
    if (!tipoDocumentoMYSQL) {
      return res.status(404).json({
        msg: `No existe un Tipo de documento con el id ${id}`,
      });
    }

    //Obtener la dependencia MONGODB
    const tipoDocumentoMDB = await TipoDocumentoM.findOne({ idMYSQL: id });
    const { id: idMongo } = tipoDocumentoMDB;

    //MYSQL
    await tipoDocumentoMYSQL.update({ tdoc_estado: false });

    //MongoDB
    const tipoDocumentoM = await TipoDocumentoM.findByIdAndUpdate(
      idMongo,
      { tdoc_estado: false, updatedAt: Date.now() },
      { new: true }
    );

    res.status(200).json({
      msg: "Tipo de documento deshabilitado",
      tipoDocumentoMYSQL,
      tipoDocumentoM,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};

export const borrarTipoDocumentoPermanente = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  //Fisicamente lo borramos

  try {
    //MYSQL
    const tipoDocumentoMYSQL = await TipoDocumento.findByPk(id);
    if (!tipoDocumentoMYSQL) {
      return res.status(404).json({
        msg: `No existe un Tipo de documento con el id  ${id}`,
      });
    }

    //Obtener la dependencia MONGODB
    const tipoDocumentoMDB = await TipoDocumentoM.findOne({ idMYSQL: id });
    const { id: idMongo } = tipoDocumentoMDB;

    //Eliminar en MYSQL
    await tipoDocumentoMYSQL.destroy();
    //Eliminar MONGODB
    const tipoDocumentoMongo = await TipoDocumentoM.findByIdAndDelete(idMongo);

    res.status(200).json({
      msg: "Tipo de Documento borrado",
      tipoDocumentoMYSQL,
      tipoDocumentoMongo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //BDSTATUS
    });
  }
};
