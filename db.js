const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'containers-us-west-101.railway.app',
  user: 'root',
  password: 'vFN6hbTYRIBbVfaqOK7V',
  database: 'railway',
  port: '7797',
  waitForConnections: true,
});

module.exports = pool;