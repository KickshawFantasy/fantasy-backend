const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

const connectDB = (callback) => {
  connection.connect((err) => {
    if (err) callback(err);
    else callback(null);
  });
};

module.exports = { connectDB, connection };
