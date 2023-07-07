import { DataTypes } from "sequelize";
import dbMySQL from "../../db/connectionMySql";

const Dependencia = dbMySQL.define("Dependencia", {
  dep_nombre: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  dep_descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dep_estado:{
    type:DataTypes.BOOLEAN,
    defaultValue:true
  }
});

export default Dependencia;


