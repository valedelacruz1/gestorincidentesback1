const { Schema, model } = require("mongoose");

export const Dependencia = Schema({
  dep_nombre: {
    type: String,
    required: true,
    unique:true
  },
  dep_descripcion: {
    type: String,
    required: true,
  },
  dep_estado: {
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
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
 
});

//desestructuracion para enviar solo las propiedas de la dependencia en un nuevo json
Dependencia.methods.toJSON = function () {
  const { __v, _id, ...dependencia } = this.toObject();
  dependencia.id = _id;
  return dependencia;
};


module.exports = model("Dependencia", Dependencia);

