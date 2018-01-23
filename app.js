var express=require('express');
var nodemailer = require('nodemailer');
var firebase = require('firebase');
var app = firebase.initializeApp({ 
    apiKey: "AIzaSyCFS8wmVg-qy3VEXPCr2wooxKPNrZgBG4M",
    authDomain: "gi-india.firebaseapp.com",
    databaseURL: "https://gi-india.firebaseio.com",
    projectId: "gi-india",
    storageBucket: "gi-india.appspot.com",
    messagingSenderId: "901822549863"});

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

var gisArray;
//serve quiz
app.get('/allGI', function(req, res){
    var allGisRef = firebase.database().ref('Giproducts');
    allGisRef.on('value',function(snapshot){
    gisArray=snapshot.val();
    //console.log(typeof(gisArray));
 	});
	res.render('allGI',{gisArray:gisArray});
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

var giDetails;
app.get('/gi/:id',function(req,res){
    var giQuery=firebase.database().ref('Giproducts');
	const query=giQuery.orderByKey().equalTo(req.params.id);
	query.on('value',snap=>{
        //console.log(snap.val());
        giDetails=snap.val();
        res.render('gi',{giDetails:giDetails})
    });	
    //console.log(req.params.id)
});

var statesArray;
app.get('/states', function(req, res){
    var statesRef = firebase.database().ref('States');
    statesRef.on('value',function(snapshot){
    statesArray=snapshot.val();
    //console.log(typeof(gisArray));
 	});
	res.render('states',{statesArray:statesArray});
});

var categoryArray;
app.get('/categories', function(req, res){
    var categoryRef = firebase.database().ref('Categories');
    categoryRef.on('value',function(snapshot){
    categoryArray=snapshot.val();
    //console.log(typeof(gisArray));
 	});
	res.render('categories',{categoryArray:categoryArray});
});

app.get('/category/:id',function(req,res){
    var giQuery=firebase.database().ref('Giproducts');
    var cat=req.params.id.charAt(0).toUpperCase()+req.params.id.slice(1);
    console.log(cat)
	const query=giQuery.orderByChild('category').equalTo(cat);
	query.on('value',snap=>{
        //console.log(snap.val());
        giDetails=snap.val();
        res.render('gi',{giDetails:giDetails})
    });	
    //console.log(req.params.id)
});

var searched;
app.get('/search/:id',function(req,res){
    var giQuery=firebase.database().ref('Giproducts');
	const query=giQuery.orderByChild('name').equalTo(req.params.id);
	query.on('value',snap=>{
        console.log(snap.val());
        searched=snap.val();
        res.render('gi',{giDetails:searched})
    });	
});

// serve static files
app.use(express.static('public'));