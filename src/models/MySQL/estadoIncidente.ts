
import { DataTypes } from "sequelize";
import dbMySQL from "../../db/connectionMySql";

const EstadoIncidente = dbMySQL.define("EstadoIncidente", {
  est_nombre: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  est_descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  est_estado:{
    type:DataTypes.BOOLEAN,
    defaultValue:true
  }
});

export default EstadoIncidente;
