import { DataTypes } from "sequelize";
import dbMySQL from "../../db/connectionMySql";
import Usuario from "./usuario";
import TipoIncidente from "./tipoIncidente";
import EstadoIncidente from "./estadoIncidente";

const Incidente = dbMySQL.define("Incidente", {
  inc_nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  inc_descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  inc_estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
 
});
export default Incidente;

// Define the associations
Incidente.belongsTo(Usuario, {
  foreignKey: "inc_usuarioId",
  as: "inc_usuario",
});
Incidente.belongsTo(Usuario, {
  foreignKey: "inc_usuarioRevisionId",
  as: "inc_usuarioRevision",
  
});
Incidente.belongsTo(TipoIncidente, {
  foreignKey: "inc_tipoIncidenteId",
  as: "inc_tipoIncidente",
});
Incidente.belongsTo(EstadoIncidente, {
  foreignKey: "inc_estadoIncidenteId",
  as: "inc_estadoIncidente",
});
