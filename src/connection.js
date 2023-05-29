import { createPool } from 'mysql2/promise';

export const connection = createPool({
  host: 'localhost',
  user: 'beautyHubUser',
  password: 'beautyHub123',
  database: 'beautyHubDb',
  port: 3306,
  waitForConnections: true,
});