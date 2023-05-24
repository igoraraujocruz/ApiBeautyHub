import { createPool } from 'mysql2/promise';

export const connection = createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'beautydb',
  port: 3306,
  waitForConnections: true,
});