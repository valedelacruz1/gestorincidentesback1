import express, { Application } from "express";
import cors from "cors";
import path from "path";

import dbMySQL from "../db/connectionMySql";
import dbConnectionMongoDB from "../db/connectionMongo";



import {
  Dependencia,
  EstadoIncidente,
  Incidente,
  Role,
  TipoDocumento,
  TipoIncidente,
  Usuario,
} from "./MySQL/index";

import {
  authRoutes,
  dependenciaRoutes,
  estadoIncidenteRoutes,
  incidenteRoutes,
  roleRoutes,
  tipoDocumentoRoutes,
  tipoIncidenteRoutes,
  usuarioRoutes,
  buscarRoutes,
} from "../routes/index.routes";

import { sincronizarTablaDependencia } from "../controllers/dependencia.controller";

class Server {
  private app: Application;
  private port: string;
  private apiPaths: {
    auth: string;
    dependencias: string;
    estadoIncidencias: string;
    incidentes: string;
    roles: string;
    tipoDocumentos: string;
    tipoIncidentes: string;
    usuarios: string;
    buscar: string;
  };

  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.apiPaths = {
      auth: "/api/auth",
      dependencias: "/api/dependencias",
      estadoIncidencias: "/api/estadoIncidentes",
      incidentes: "/api/incidentes",
      roles: "/api/roles",
      tipoDocumentos: "/api/tipoDocumentos",
      tipoIncidentes: "/api/tipoIncidentes",
      usuarios: "/api/usuarios",
      buscar: "/api/buscar",
    };

    //conectar las bases de datos
    this.conectarDbMongo();
    this.conectarDBMySql();

    //MiddleWares
    this.middlewares();

    //Rutas de mi aplicacion
    this.routes();

    this.app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../public.index.html"));
    });
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Aplicacion corriendo en el puerto " + this.port);
    });
  }

  routes() {
    this.app.use(this.apiPaths.auth, authRoutes);
    this.app.use(this.apiPaths.dependencias, dependenciaRoutes);
    this.app.use(this.apiPaths.estadoIncidencias, estadoIncidenteRoutes);
    this.app.use(this.apiPaths.incidentes, incidenteRoutes);
    this.app.use(this.apiPaths.roles, roleRoutes);
    this.app.use(this.apiPaths.tipoDocumentos, tipoDocumentoRoutes);
    this.app.use(this.apiPaths.tipoIncidentes, tipoIncidenteRoutes);
    this.app.use(this.apiPaths.usuarios, usuarioRoutes);
    this.app.use(this.apiPaths.buscar, buscarRoutes);
  }

  middlewares() {
    // Cors
    this.app.use(cors());

    //Lectura y parseo del body
    this.app.use(express.json());

    //Directorio publico
    this.app.use(express.static("public"));
  }

  async conectarDBMySql() {
    try {
      //MYSQL
      await dbMySQL.authenticate();
      console.log("<-----Base de datos MYSQL Online-----> ");
      this.sincronizarMySQL();
      process.env.MYSQLDB_ON = "true";
    } catch (error) {
      process.env.MYSQLDB_ON = "false";
      process.env.MAINDB_ON= "MONGO";
      
      console.error("No se pudo conectar a la base de datos MYSQL,se usara como respaldo MONGODB", error);

    }
  }

  async conectarDbMongo() {
    //MONGODB
    try {
      await dbConnectionMongoDB();
      process.env.MONGODB_ON = "true";
    } catch (error) {
      process.env.MONGODB_ON = "false";
      process.env.MAINDB_ON= "MYSQL";
      // console.error("No se pudo conectar a la base de datos MONGODB:", error);
      console.error("No se pudo conectar a la base de datos MONGODB ,se usara como principal MYSQL");
    }
  }

  async sincronizarMySQL() {
    try {
      await Dependencia.sync();
      await EstadoIncidente.sync();
      await TipoIncidente.sync();
      await Role.sync();
      await TipoDocumento.sync();
      await Usuario.sync();
      await Incidente.sync();
    } catch (error) {
      console.log("No se pudo sincronizar la base de datos");
    }
  }

  async sincronizarBDs() {
    // TODO: TERMINAR LAS SINCRONIZACIONES
    try {
      await sincronizarTablaDependencia();
    } catch (error) {
      console.log("No se pudo sincronizar la base de datos en paralelo");
    }
  }
}

export default Server;
