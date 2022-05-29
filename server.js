var mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

_dirname = "C:/Users/Shree/Desktop/Library_System";
app.use(express.static("public"));
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password:)",
  database: "library",
});

app.listen(3000, function () {
  console.log("listening on 3000");
});

var sql = "SELECT * FROM Books WHERE Availability=1";
var cid = 101;
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/login", (req, res) => {
  con.connect(function (err) {
    if (err) throw err;
    console.log(req.body);
    con.query(
      "SELECT * FROM Authentication_System WHERE Login_ID=" + req.body.uid,
      function (err, result) {
        if (err) throw err;
        console.log(result[0].password + " " + req.body.pwd);

        if (
          req.body.slct == "1" &&
          result[0].Role == "Account" &&
          result[0].password == req.body.pwd
        )
          res.redirect("/reader");

        if (
          req.body.slct == "2" &&
          result[0].Role == "Organizer" &&
          result[0].password == req.body.pwd
        )
          res.redirect("/staff");

        if (
          req.body.slct == "3" &&
          result[0].Role == "Admin" &&
          result[0].password == req.body.pwd
        )
          res.redirect("/admin");
        res.render("index.ejs", { query: result });
        console.log("Result: " + result);
      }
    );
  });
});

app.post("/issue", (req, res) => {
  con.connect(function (err) {
    if (err) throw err;
    console.log(req.body);

    con.query(
      "UPDATE Books SET Availability = 0 WHERE Availability=1 AND ISBN=" +
        req.body.ISBN,
      function (err, result) {
        if (err) throw err;

        res.redirect("/reader");
        console.log("Result: " + result);
      }
    );
  });
});

app.get("/reader", (req, res) => {
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(
      "SELECT * FROM Books WHERE Availability=1",
      function (err, result) {
        if (err) throw err;
        res.render("reader.ejs", { query: result });
      }
    );
  });
});

var finedPeople =
  " SELECT * FROM Authentication_System INNER JOIN reports NATURAL JOIN Readers NATURAL JOIN member_type WHERE role='Account';";
app.get("/admin", (req, res) => {
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(finedPeople, function (err, result) {
      if (err) throw err;
      var i = 0;
      while (i < result.length) {
        let date1 = new Date("05/30/2022");
        let date2 = result[i].due_date;

        let difference = date1.getTime() - date2.getTime();
        let Totaldays = Math.ceil((3 * difference) / (1000 * 3600 * 24));

        console.log(Totaldays);
        if (Totaldays < 0) Totaldays = 0;
        result[i].fine = Totaldays;
        i++;
      }
      res.render("admin.ejs", { query: result });
    });
  });
});
var a = 2;
app.get("/staff", (req, res) => {
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!" + req.body.uid);
    con.query(
      "SELECT * FROM Authentication_System INNER JOIN reports NATURAL JOIN Readers WHERE role='Account' AND User_ID=" +
        cid,
      function (err, result) {
        if (err) throw err;
        let date_1 = new Date("05/30/2022");
        let date_2 = result[0].due_date;

        let difference = date_1.getTime() - date_2.getTime();
        let TotalDays = Math.ceil((3 * difference) / (1000 * 3600 * 24));

        console.log(TotalDays);
        if (TotalDays < 0) TotalDays = 0;
        res.render("staff.ejs", { query: result, fine: TotalDays });
        console.log("Result: " + result);
      }
    );
  });
});

app.post("/ban", (req, res) => {
  con.connect(function (err) {
    if (err) throw err;
    console.log(req.body);
    con.query(
      "DELETE FROM member_type WHERE User_ID=" + req.body.toban,
      function (err, result) {
        res.redirect("/admin");

        console.log("Result: " + result);
      }
    );
  });
});

app.post("/getReader", (req, res) => {
  cid = req.body.uid;
  console.log(req.body);
  res.redirect("/staff");
});
