import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "nozomi.proxy.rlwy.net",
  port: 28470,
  user: "root",
  password: "mAbJqgZUdakCTLdDDVwXxTzmpxumcQLk",
  database: "railway",
  waitForConnections: true,
  connectionLimit: 10,

});


export default pool;
