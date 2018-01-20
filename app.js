var express=require('express');
var nodemailer = require('nodemailer');
var firebase = require('firebase');
var app = firebase.initializeApp({ 
  apiKey: "AIzaSyAeFB6v4sdJpdnvHM6xIIiJz4Us5XibKIA",
  authDomain: "gi-website-36c02.firebaseapp.com",
  databaseURL: "https://gi-website-36c02.firebaseio.com",
  projectId: "gi-website-36c02",
  storageBucket: "gi-website-36c02.appspot.com",
  messagingSenderId: "1092547245593"});

  var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "gi.cipam@gmail.com",
        pass: "cipam@123"
    }
});

var home = require('./routes/home');
var signin = require('./routes/sign_in');
var signup=require('./routes/sign_up');

//App setup
var port = process.env.PORT || 4000;
var app=express();
var server=app.listen(port,function(){
    console.log('listening to request on port 4000')
});

//set view engine to EJS
app.set('view engine', 'ejs');

app.use('/', home);
app.use('/signIn',signin);
app.use('/signUp',signup);

//serve quiz
app.get('/allGI', function(req, res){
	res.render('allGI');
});

app.get('/send',function(req,res){
  var mailOptions={
      to : req.query.to,
      subject : req.query.subject,
      text : req.query.text
  }
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, response){
   if(error){
          console.log(error);
      res.end("error");
   }else{
          console.log("Message sent: " + response.message);
      res.end("sent");
       }
});
});


// serve static files
app.use(express.static('public'));