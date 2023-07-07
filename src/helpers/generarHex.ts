import crypto from "crypto";


export const generarCodigoHex = (length: number) => {
  const tiempoExpiracion = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos a partir de ahora
  let codigo = crypto.randomBytes(length).toString("hex"); // Genera un código hexadecimal aleatorio de 4 bytes
  codigo +="GIB.j"
  codigo=codigo.toUpperCase();
  

  let payloadCodigo = {
    codigo,
    tiempoExpiracion,
  };

  return payloadCodigo;
};

export const validarCodigoHex = (codigo: string) => {
  if (codigo.includes("GIB.J")) {
    return true;
  } else {
    return false;
  }
};
