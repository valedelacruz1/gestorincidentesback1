import { Sequelize } from "sequelize";

const dbMySQL:Sequelize = new Sequelize("rrhh", "root", "vale1234", {
  host: "localhost",
  dialect: "mysql",
  
});

export default dbMySQL;
