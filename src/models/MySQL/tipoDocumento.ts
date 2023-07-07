import { DataTypes } from "sequelize";
import dbMySQL from "../../db/connectionMySql";

const TipoDocumento = dbMySQL.define("TipoDocumento", {
  tdoc_nombre: {
    type: DataTypes.STRING,
    unique:true,
    allowNull: false,
  },
  tdoc_descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tdoc_estado: {
    type: DataTypes.BOOLEAN,
    defaultValue:true
  },
});

export default TipoDocumento;
