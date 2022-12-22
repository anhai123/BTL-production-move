const mysql2 = require("mysql2");
const config = require("../config/db.config.js");

const connection = mysql2.createConnection({
  host: config.HOST,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DB,
  port: config.PORT,
});

connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

const db = {};
db.TYPES = ["parentDirectory", "brotherDirectory", "childDirectory"];
db.connection = connection;

module.exports = db;