import { DataTypes } from "sequelize";
import dbMySQL from "../../db/connectionMySql";
import Role from "./role";
import TipoDocumento from "./tipoDocumento";
import Dependencia from "./dependencia";

const Usuario = dbMySQL.define("Usuario", {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numDocumento: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

export default Usuario;

// Define the associations
Usuario.belongsTo(Role, { foreignKey: "roleId", as: "role" });
Usuario.belongsTo(Dependencia, {
  foreignKey: "dependenciaId",
  as: "dependencia",
});
Usuario.belongsTo(TipoDocumento, {
  foreignKey: "tipoDocumentoId",
  as: "tipoDocumento",
});
