import { DataTypes } from "sequelize";
import dbMySQL from "../../db/connectionMySql";

const TipoIncidente = dbMySQL.define("TipoIncidente", {
  tinc_nombre: {
    type: DataTypes.STRING,
    unique:true,
    allowNull: false,
  },
  tinc_descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tinc_estado: {
    type: DataTypes.BOOLEAN,
    defaultValue:true
  },
});

export default TipoIncidente;
