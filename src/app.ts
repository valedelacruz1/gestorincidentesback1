// Configuramos dotenv
import dotenv from 'dotenv';
import Server from './models/server';

// configurar dotenv.env
dotenv.config();

const server = new Server();

server.listen();





