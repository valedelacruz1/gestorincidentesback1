import { DataTypes } from "sequelize";
import dbMySQL from "../../db/connectionMySql";

const Role = dbMySQL.define("Role", {
  rol_nombre: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  rol_descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol_estado: {
    type: DataTypes.BOOLEAN,
    defaultValue:true
  },
});

export default Role;
