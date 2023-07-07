const { Schema, model } = require("mongoose");
export const Incidente = Schema({
  inc_nombre: {
    type: String,
    required: [true, "Nombre de incidente obligatorio"],
   
  },
  inc_descripcion:{
    type: String,
    required: [true, "Descripcion de incidente obligatorio"],
  },
  inc_estado: {
    type: Boolean,
    default: true,
  },
  inc_tipoIncidente: {
    type: Schema.Types.ObjectId,
    ref: "TipoIncidente",
    required: [true, "Tipo de Solicitud de incidente obligatorio"],
  },
  inc_estadoIncidente: {
    type: Schema.Types.ObjectId,
    ref: "EstadoIncidente",
    required: [true, "Estado de incidente obligatorio"],
  },
 
  inc_usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  inc_usuarioRevision: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    
  },
  idMYSQL: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

//desestructuracion para enviar solo las propiedas del incidente en un nuevo json
Incidente.methods.toJSON = function () {
  const { __v, _id, ...incidente } = this.toObject();
  incidente.id = _id;
  return incidente;
};

module.exports = model("Incidente", Incidente);
