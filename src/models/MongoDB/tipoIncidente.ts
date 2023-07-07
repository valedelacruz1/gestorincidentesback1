const { Schema, model } = require("mongoose");

export const TipoIncidente = Schema({
  tinc_nombre: {
    type: String,
    required: [true, "El nombre de documento es requerido"],
    unique: true,
    
  },
  tinc_descripcion: {
    type: String,
    required: [true, "La descripcion de documento es requerida"],
  },
  tinc_estado: {
    type: Boolean,
    default: true,
    required: true,
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



//desestructuracion para enviar solo las propiedades del tipoIncidente en un nuevo json
TipoIncidente.methods.toJSON = function () {
  const { __v, _id, ...tipoIncidente } = this.toObject();
  tipoIncidente.id = _id;
  return tipoIncidente;
};


module.exports = model("TipoIncidente", TipoIncidente);
