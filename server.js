//Initiallising node modules
var express = require("express");
 var http = require('http');
var bodyParser = require("body-parser");
var sql = require("mssql");
var app = express();
// Body Parser Middleware
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});




//Setting up server
 // var server = app.listen(process.env.PORT || 8080, function () {
 //    var port = server.address().port;
 //    console.log("App now running on port", port);
 // });
var port = process.env.PORT || 8080;
var server = http.createServer(app);

  app.use(bodyParser.json());
 server.listen(port, function () { // fifth and final change
 });

//Initiallising connection string
var dbConfig = {
    user:  'matin',
    password: 'A123456*',
    server: 'nuffielddb.database.windows.net',
    options: {encrypt: true, database: 'nuffield'}
};

var connection = new sql.Connection(dbConfig);
connection.connect();
//Function to connect to database and execute query
var  executeQuery = function(query, res){
       //if (err) {
           // console.log("Error while connecting database :- " + err);
           // return res.send(err);
       // }
        //else {
           // create Request object
           var request = new sql.Request(connection);
           // query to the database
           request.query(query, function (err, result) {
               if (err) {
                  console.log("Error while querying database :- " + err);
                  return res.send(err);
               }
               else {
                  console.log(result);
                  sql.close();
                  res.send(result)
               }
           });
        //}

}


app.get('/classes', function (req, res) {
  var query = "SELECT * FROM classes";
  executeQuery(query, res);
  //res.send("yoga");
});

app.post('/book_class', function (req, res) {
  console.log(req.body);
  var query = "INSERT INTO booked_classes (user_id, class_id, class_name, class_date) VALUES (" + req.body.userID + "," + req.body.classID+ ","+ req.body.class_name+ ","+ req.body.classDate + ")";
  executeQuery(query, res);
});

app.post('/activeBookings', function (req, res) {
  //console.log("this is the body "+ req.params.userID);
  var query = "SELECT * FROM booked_classes WHERE user_id ="+ req.body.userID;
  executeQuery(query, res);
});

app.get('/class',function(req, res) {

  var query = "SELECT * FROM classes WHERE ClassName=" + req.body.class_title + "AND classDays=" + req.body.class_date[0] + "/" + req.body.class_date[1];
  executeQuery(query, res);
});

app.post('/classAvailable', function (req, res) {
  var query = "SELECT * FROM classes WHERE ClassName=" + req.body.class_title + "AND classDays=" + req.body.class_date;
  executeQuery(query, res);
});

app.post('/login', function (req, res) {
  var query = "UPDATE user_session SET user_id =" + req.body.user_id + "WHERE user_session=" + req.body.user_session;
  executeQuery(query, res);
});

app.post('/addSession', function (req, res) {
  var query = "INSERT INTO user_session (user_id, user_session) VALUES (NULL," + req.body.user_session + ")";
  executeQuery(query, res);
});

app.post('/isLoggedin',function(req, res) {
  var query = "SELECT * FROM user_session WHERE user_session=" + req.body.user_session;
  executeQuery(query, res);
});

app.post('/cancelBooking',function(req, res) {
  var query = "DELETE FROM booked_classes WHERE class_name=" + req.body.class_name + "AND class_date=" + req.body.class_date;
  executeQuery(query, res);
});

//GET API
// app.get('/classes', function(req , res){

//                 // console.log("i cameeee");
//                 // var query = "select * from users";
//                 // executeQuery (res, query);
// });

// // //POST API
// app.post('/book_class', function(req , res){
//     var query = "INSERT INTO booked_classes (user_id, class_id) VALUES (req.body.userID,req.body.classID)";
//     executeQuery (res, query);
// });

// //PUT API
//  app.put("/api/user/:id", function(req , res){
//                 var query = "UPDATE [user] SET Name= " + req.body.Name  +  " , Email=  " + req.body.Email + "  WHERE Id= " + req.params.id;
//                 executeQuery (res, query);
// });

// // DELETE API
//  app.delete("/api/user /:id", function(req , res){
//                 var query = "DELETE FROM [user] WHERE Id=" + req.params.id;
//                 executeQuery (res, query);
// });
