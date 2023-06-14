var express = require('express')
var cors = require('cors')
var app = express()

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const secret = 'react-app-kongza'

app.use(cors())

// get the client
const mysql = require('mysql2');
// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456' ,
  database: 'kongza'
});

app.post('/register',jsonParser, function(req,res,next){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    connection.execute(
      'INSERT INTO Students (firstname, lastname, email, password, image) VALUES (?,?,?,?,?)',
      [ req.body.firstname, req.body.lastname, req.body.email, hash, req.body.image],
      function(err,results,fields) {
          if(err){
              res.json({status: 'error',message: err})
              return
          }
          res.json({status: 'ok'})
      }
   );
});
})


app.post('/updateusers',jsonParser, function(req,res,next){
    connection.execute(
      'UPDATE Students SET firstname = ? ,lastname = ? ,email = ? ,password = ? WHERE id = ? ',
      [ req.body.firstname, req.body.lastname, req.body.email, req.body.password,req.body.id],
      function(err,results,fields) {
          if(err){
              res.json({status: 'error',message: err})
              return
          }
          res.json({status: 'ok'})
      }
   );
});


app.post('/login',jsonParser, function(req,res,next){
  connection.execute(
     'SELECT * FROM Students WHERE email=?',
     [ req.body.email],
     function(err,users,fields) {
         if(err){res.json({status: 'error',message: err}); return}
         if(users.length == 0){res.json ({status: 'error',message: 'on user found'}); return}
         bcrypt.compare(req.body.password, users[0].password, function(err, isLogin) {
          if (isLogin){
            var token = jwt.sign({ email: users[0].email}, secret, {expiresIn: '1h'});
            res.json({status: 'ok',message: 'login success',token})
          }else{
            res.json({status: 'fail',message: 'login fail'})
          }
      });
     }
  );
 })

 app.get('/getuserlist', function(req,res,next){
  connection.execute(
     'SELECT * FROM Students ',
     function(err,users,fields) {
        if(err){res.json({status: 'error',message: err}); return}
        if(users.length == 0){res.json ({status: 'error',message: 'on user found'}); return}
      //   bcrypt.compare(req.body.password, users.password, function(err, isLogin) {
      //     if (isLogin){
      //       var token = jwt.sign({ email: users[0].email}, secret, {expiresIn: '1h'});
      //       res.json({status: 'ok',message: 'login success',token})
      //     }else{
      //       res.json({status: 'fail',message: 'login fail'})
      //     }
      // });
        res.json (users); 
        }
  );
 })

 app.post('/getuserupdate/:id', function(req, res, next) {
  const id = req.params.id;
  connection.execute(
    'SELECT * FROM Students WHERE id = ?',
    [id],
    function(err, users, fields) {
      if (err) {
        res.json({ status: 'error', message: err });
        return;
      }
      if (users.length === 0) {
        res.json({ status: 'error', message: 'No user found' });
        return;
      }
      res.json(users);
    }
  );
});

app.post('/deleteuser/:id', function(req, res, next) {
  const id = req.params.id;
  connection.execute(
    'DELETE FROM Students WHERE id = ?',
    [id],
    function(err, users, fields) {
      if (err) {
        res.json({ status: 'error', message: err });
        return;
      }
      if (users.length === 0) {
        res.json({ status: 'error', message: 'No user found' });
        return;
      }
      res.json( {status: 'ok',users,message: 'delete forever'});
    }
  );
});

 app.post('/authen',jsonParser, function(req,res,next){
  try{
    const token = req.headers.authorization.split(' ')[1]
    var decoded = jwt.verify(token, secret)
    res.json({status: 'ok', decoded})
  } catch(err){
    res.json({status: 'error', message: err.message })
  }
 
 })
app.listen(3334, function () {
    console.log('CORS-enabled web server listening It work now port 3334')
  })
