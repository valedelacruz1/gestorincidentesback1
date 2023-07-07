const { Schema, model } = require("mongoose");

export const TipoDocumento = Schema({
  tdoc_nombre: {
    type: String,
    required: [true, "El nombre de documento es requerido"],
    unique: true,
    enum: ["CC", "CE", "TI", "PA"],
  },
  tdoc_descripcion: {
    type: String,
    required: [true, "La descripcion de documento es requerida"],
  },
  tdoc_estado: {
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



//desestructuracion para enviar solo las propiedas del Tipo documento en un nuevo json
TipoDocumento.methods.toJSON = function () {
  const { __v, _id, ...tipoDocumento } = this.toObject();
  tipoDocumento.id = _id;
  return tipoDocumento;
};


module.exports = model("TipoDocumento", TipoDocumento);
