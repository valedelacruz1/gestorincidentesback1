//TODO: TERMINAR CONTROLADOR

import { Request, Response } from "express";

const { RoleM } = require("../models/MongoDB/index");
import Role from "../models/MySQL/role";

export const crearRole = async (req: Request, res: Response) => {
  const { rol_nombre, rol_descripcion, ...body } = req.body;

  try {
    //Verificar que no exista ya uno con el mismo nombre
    //MYSQL
    const roleDB = await Role.findOne({
      where: {
        rol_nombre: rol_nombre,
      },
    });

    //MONGODB
    const roleMDB = await RoleM.findOne({
      rol_nombre: rol_nombre,
    });

    if (roleDB || roleMDB) {
      return res.status(400).json({
        msg: `El Rol ${roleMDB.rol_nombre},ya existe`,
      });
    }

    //Generar la data a guardar
    const data = {
      rol_nombre,
      rol_descripcion,
      ...body,
    };

    //MYSQL
    const role: any = await Role.create(data);

    //MONGODB
    const roleM = new RoleM({ idMYSQL: role.id, ...data });
    await roleM.save();

    res.status(201).json({
      msg: "Rol Creado correctamente.",
      role,
      roleM,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //
    });
  }
};

export const getRoles = async (req: Request, res: Response) => {
  // const { limite = 5, desde = 0 } = req.query;

  const query = {
    rol_estado: true,
  };

  try {
    //Buscar todas las dependencias

    //MYSQL
    const [totalMYSQL, rolesMy]: any = await Promise.all([
      Role.count({ where: query }),
      Role.findAll({ where: query }),
    ]);

    //MONGODB
    const [totalMongoDB, rolesMo] = await Promise.all([
      RoleM.countDocuments(query),
      // TipoDocumentoM.find(query).skip(Number(desde)).limit(Number(limite)),
      RoleM.find(query),
    ]);

    if (!rolesMo || !rolesMy) {
      return res.status(400).json({
        msg: `No hay Roles registrados en la base de datos`,
      });
    }

    res.status(200).json({
      msg: "get API -getRoles",
      totalMYSQL,
      rolesMy,
      totalMongoDB,
      rolesMo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //
    });
  }
};

export const getRole = async (req: Request, res: Response) => {
  const { id } = req.params;

  const query = {
    id: id,
  };
  try {
    //Obtener el rol MYSQL
    let role: any = await Role.findOne({ where: query });

    //Obtener el rol MONGODB
    let roleM: any = await RoleM.findOne({ idMYSQL: id });

    if (!role) {
      role = {
        msg: "No se encontro en base MYSQL",
      };
    } else if (!roleM) {
      roleM = {
        msg: "No se encontro en base MONGODB",
      };
    }

    res.status(200).json({
      msg: "get API - getRole",
      role,
      roleM,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //
    });
  }
};

export const actualizarRole = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { body } = req;

  //Asignando el usuario que lo esta actualizando
  // data.usuario = req.usuario._id;

  try {
    //Verificar que exista ya uno con el mismo nombre

    //MYSQL
    //Obtener la dependencia MYSQL
    const roleDB = await Role.findByPk(id);

    //Obtener la dependencia MONGODB
    const roleMDB = await RoleM.findOne({ idMYSQL: id });
    const { id: idMongo } = roleMDB;
    const dataMDB = { updatedAt: Date.now(), ...body };

    if (!roleDB) {
      return res.status(404).json({
        msg: `No se encontro rol con el id ${id} en base de datos MYSQL`,
      });
    } else if (!roleMDB) {
      return res.status(404).json({
        msg: `No se encontro rol con el id ${id} en base de datos MONGODB`,
      });
    }

    //actualizar la dependencia en MYSQL
    const roleActualizado = await roleDB.update(body);

    //actualizar la dependencia en MONGODB

    const roleMActualizado = await RoleM.findOneAndUpdate({_id:idMongo}, dataMDB, {
      new: true,
    });

    res.status(200).json({
      msg: "Rol Actualizado Correctamente.",
      roleActualizado,
      roleMActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //
    });
  }
};

export const borrarRole = async (req: Request, res: Response) => {
  const { id } = req.params;

  //Deshabilitar

  try {
    //MYSQL
    const roleMYSQL = await Role.findByPk(id);
    if (!roleMYSQL) {
      return res.status(404).json({
        msg: "No existe un rol con el id" + id,
      });
    }

    //Obtener la dependencia MONGODB
    const roleMDB = await RoleM.findOne({ idMYSQL: id });
    const { id: idMongo } = roleMDB;

    //MYSQL
    await roleMYSQL.update({ rol_estado: false });

    //MongoDB
    const roleM = await RoleM.findByIdAndUpdate(
      idMongo,
      { rol_estado: false, updatedAt: Date.now() },
      { new: true }
    );

    res.status(200).json({
      msg: "Rol deshabilitado",
      roleMYSQL,
      roleM,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //
    });
  }
};

export const borrarRolPermanente = async (req: Request, res: Response) => {
  const { id } = req.params;

  //Fisicamente lo borramos

  try {
    //MYSQL
    const roleMYSQL = await Role.findByPk(id);
    if (!roleMYSQL) {
      return res.status(404).json({
        msg: "No existe un rol con el id" + id,
      });
    }

    //Obtener la dependencia MONGODB
    const roleMDB = await RoleM.findOne({ idMYSQL: id });
    const { id: idMongo } = roleMDB;

    //Eliminar en MYSQL
    await roleMYSQL.destroy();
    //Eliminar MONGODB
    const roleMongo = await RoleM.findByIdAndDelete(idMongo);

    res.status(200).json({
      msg: "Rol borrado",
      roleMYSQL,
      roleMongo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      //
    });
  }
};
