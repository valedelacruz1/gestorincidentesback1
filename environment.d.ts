declare global {
    namespace NodeJS {
      interface ProcessEnv {

        
        PORT: string ;
        SECRET_KEY:string ;
        MONGODB_CNN:string ;
        MYSQLDB_ON:string; 
        MONGODB_ON: string;
        
        

        EMAIL_SERVICE: string;
        EMAIL_PORT:string;
        EMAIL_USERNAME:string;
        EMAIL_PASSWORD: string;
        EMAIL_FROM:string;



      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}