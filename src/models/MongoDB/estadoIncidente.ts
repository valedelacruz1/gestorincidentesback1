const { Schema, model } = require("mongoose");
export const EstadoIncidente = Schema({
  est_nombre: {
    type: String,
    require: [true, "El Estado de Incidente es Obligatorio"],
  },
  est_descripcion: {
    type: String,
    require: [true, "La Descripcion de estado de incidente es requerida"],
  },
  est_estado:{
    type: Boolean,
    default: true,
  },
  idMYSQL:{
    type:Number,
    required:true
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
//desestructuracion para enviar solo las propiedas del estadoIncidente en un nuevo json
EstadoIncidente.methods.toJSON = function () {
  const { __v, _id, ...estadoIncidente } = this.toObject();
  estadoIncidente.id = _id;
  return estadoIncidente;
};

module.exports = model("EstadoIncidente", EstadoIncidente);
