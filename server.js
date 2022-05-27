var mysql = require("mysql2");
const express = require("express");
const app = express();
app.set("view engine", "ejs");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password:)",
  database: "world",
});

app.listen(3000, function () {
  console.log("listening on 3000");
});

var sql = "SELECT * FROM city";

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(sql, function (err, result) {
    if (err) throw err;

    console.log("Result: " + result);
  });
});

app.get("/", (req, res) => {
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(sql, function (err, result) {
      if (err) throw err;
      res.render("index.ejs", { query: result });
      console.log("Result: " + result);
    });
  });
});
