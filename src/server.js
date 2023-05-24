import 'dotenv/config';
import express from 'express';
import routes from './routes.js'
import './connection.js'

const app = express();

app.use(express.json());

app.use(routes);

app.listen(3333, () => console.log("Server running"))