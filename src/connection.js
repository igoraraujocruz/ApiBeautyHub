import { createPool } from 'mysql2/promise';

export const connection = createPool({
  host: 'containers-us-west-59.railway.app',
  user: 'root',
  password: 'raPQPHx09aDIg1uXhox4',
  database: 'railway',
  port: 8051,
  waitForConnections: true,
});