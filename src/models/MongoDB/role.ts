const { Schema, model } = require("mongoose");
export const Role = Schema({
  rol_nombre: {
    type: String,
    enum: ["ADMIN_ROLE", "USER_ROLE","TECNICO"],
    require: [true, "El Rol es Obligatorio"],
  },
  rol_descripcion: {
    type: String,
    require: [true, "Descripcion de Rol es Requerido"],
  },
  rol_estado:{
    type: Boolean,
    default: true,
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
//desestructuracion para enviar solo las propiedas del role en un nuevo json
Role.methods.toJSON = function () {
  const { __v, _id, ...role } = this.toObject();
  role.id = _id;
  return role;
};

module.exports = model("Role", Role);
