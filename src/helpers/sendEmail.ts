import nodemailer from "nodemailer";

import { Request, Response } from "express";

export const enviarMensajeReq = async (req: Request, res: Response) => {
  const { usuario, incidente, asunto } = req.body;
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE,
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define the email options
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: usuario.correo,
    subject: "Incidente registro",
    text: "This is a test email sent from Node.js with NodeMailer and TypeScript.",
    html: " ",
  };
  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({
      msg: `Incidente ${incidente.id}Registrado,por favor revise su correo ${usuario.correo} para hacer seguimiento al incidente`,
      usuario,
      info,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      BDStatus: {
        MYSQL_ON: process.env.MYSQLDB_ON,
        MONGODB_ON: process.env.MONGODB_ON,
      },
    });
  }
};

export const enviarMensajeInsideServer = async (
  usuarioDestino: any,
  asunto: string,
  incidente: any
) => {
  let mailOptions, info;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE,
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define the email options

  try {
    // Send the email
    switch (asunto) {
      case "Registro de Incidente":
        mailOptions = {
          from: process.env.EMAIL_USERNAME,
          to: usuarioDestino.correo,
          subject: asunto,
          html: `<html>
          <head>
            <meta charset="utf-8">
            <title>${asunto} </title>
          </head>
          <body>
            <h1>Nuevo Incidente Registrado.</h1>
            <p>Asunto Incidente,Ticket${incidente.id}, ${incidente.inc_nombre},revisar en cuanto pueda la plataforma.</p>
            <p>Ir a plataforma: <a href="http://localhost:3001/auth/login">Plataforma de Gestor de Incidentes</a></p>
            
          </body>
        </html>`,
        };
        info = await transporter.sendMail(mailOptions);
        break;
      case "Actualizacion de Incidente":
        mailOptions = {
          from: process.env.EMAIL_USERNAME,
          to: usuarioDestino.correo,
          subject: asunto,
          // text: `Tu Incidente ${incidente.inc_nombre} ha sido actualizado por un Administrador. text`,
          html: `<html>
            <head>
              <meta charset="utf-8">
              <title>${asunto} titulo</title>
            </head>
            <body>
              <h1>¡Hola, ${usuarioDestino.nombre}!</h1>
              <p>Tu Incidente con Ticket #${incidente.id}, ${incidente.inc_nombre} ha sido actualizado por un Administrador.</p>
              <p>Se te ha asignado un tecnico que te asistira en tu incidente.</p>
              
              <p>Ingresa a la plataforma para ver su estado: <a href="http://localhost:3001/auth/login">Plataforma de Gestor de Incidentes</a></p>
             </body>
          </html>`,
        };
        info = await transporter.sendMail(mailOptions);
        break;
      case "Asignacion de Incidente":
        mailOptions = {
          from: process.env.EMAIL_USERNAME,
          to: usuarioDestino.correo,
          subject: asunto,
          // text: `Tu Incidente ${incidente.inc_nombre} ha sido actualizado por un Administrador. text`,
          html: `<html>
              <head>
                <meta charset="utf-8">
                <title>${asunto} titulo</title>
              </head>
              <body>
                <h1>¡Hola, TECNICO ${usuarioDestino.nombre}!</h1>
    
                <p>Se le ha asignado un incidente para resolver,por favor revise la plataforma.</p>
                <p>Ingresa a la plataforma para ver su estado: <a href="http://localhost:3001/auth/login">Plataforma de Gestor de Incidentes</a></p>
                
              </body>
            </html>`,
        };
        info = await transporter.sendMail(mailOptions);
        break;
      case "Registro de Usuario":
        mailOptions = {
          from: process.env.EMAIL_USERNAME,
          to: usuarioDestino.correo,
          subject: asunto,
          // text: `Tu Incidente ${incidente.inc_nombre} ha sido actualizado por un Administrador. text`,
          html: `<html>
              <head>
                <meta charset="utf-8">
                <title>${asunto} titulo</title>
              </head>
              <body>
                <h1>¡Hola, ${usuarioDestino.nombre}!</h1>
                <p>Se te ha creado un usuario para ingresar a la plataforma Gestor de Incidentes, con tu correo ${usuarioDestino.correo} por un Administrador.</p>
                <p>Datos de Ingreso: 
                <br>
                <p>Usuario: ${usuarioDestino.username}</p>
                <br>
                <p>password: ${usuarioDestino.password}</p>
                
                <p>Ingresa a la plataforma para ver su estado: <a href="http://localhost:3001/auth/login">Plataforma de Gestor de Incidentes</a></p>
                
              </body>
            </html>`,
        };
        info = await transporter.sendMail(mailOptions);
        break;
      case "Restablecer Cuenta":
          mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: usuarioDestino.correo,
            subject: asunto,
            // text: `Tu Incidente ${incidente.inc_nombre} ha sido actualizado por un Administrador. text`,
            html: `<html>
                <head>
                  <meta charset="utf-8">
                  <title>${asunto} titulo</title>
                </head>
                <body>
                  <h1>¡Hola, ${usuarioDestino.nombre}!</h1>
                  <p>Has Solicitado el restablecimiento de tu cuenta,para ingresar a la plataforma Gestor de Incidentes,usa este codigo para restablecerla.</p>
                  <p>Datos de Ingreso: 
                  <br>
                  <p>USERNAME:${usuarioDestino.username}</p>
                  <p>CODIGO: ${usuarioDestino.codigoHex}</p>
                  <br>
                                  
                  <p>Ir a la plataforma:: <a href="http://localhost:3001/auth/login">Plataforma de Gestor de Incidentes</a></p>
                  
                </body>
              </html>`,
          };
          info = await transporter.sendMail(mailOptions);
          break;
      default:
        break;
    }

    // console.log(info);
  } catch (error) {
    console.log(error);
  }
};
