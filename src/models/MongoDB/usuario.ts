const { Schema, model } = require("mongoose");
export const Usuario = Schema({
  username: {
    type: String,
    allowNull: false,
    unique: true,
  },
  correo: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique:true
  },
  password: {
    type: String,
    allowNull: false,
    required: [true, "La contraseña es requerida"],
  },
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  apellido: {
    type: String,
    required: [true, "El apellido es obligatorio"],
  },
  numDocumento: {
    type: String,
    unique: true,
    required: [true, "El numero de documento es obligatorio"],
  },
  telefono: {
    type: String,
    unique: true,
    required: [true, "El numero de telefono es requerido"],
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
  },
  dependencia: {
    type: Schema.Types.ObjectId,
    ref: "Dependencia",
  },
  tipoDocumento: {
    type: Schema.Types.ObjectId,
    ref: "TipoDocumento",
    required: true,
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
  estado: {
    type: Boolean,
    defaultValue: true,
  },

 
});
//desestructuracion para enviar solo las propiedas del usuario en un nuevo json
Usuario.methods.toJSON = function () {
  const { __v, password, _id, ...usuario } = this.toObject();
  usuario.id = _id;
  return usuario;
};

module.exports = model("Usuario", Usuario);
