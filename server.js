var fs = require('fs')
var express = require('express')
var app = express()

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var ejs = require('ejs');
app.set('view engine', 'ejs');

var mongoose = require("mongoose");
var myschema = new mongoose.Schema({ username:String,psd:String});
var users = mongoose.model("users",myschema);
var url = "localhost:8000/users";
mongoose.connect(url);

app.get('/' , function(req,res){
    res.redirect("/login");
})

app.get('/home' , function(req,res){
    res.redirect("/login");
})

app.get('/login' , function(req,res){
    res.render('login' , {err : ""});
})

app.post('/login',function(req,res){
    var username = req.body.username;
    var psd = req.body.psd;

    users.count({username : username,psd : psd},function(err,count){
        if(count != 1){
            var err = "username or password has wrong";
            res.render('login' , {err})
            return;
        }
        res.render('home' , {username : username})
    })
    
})

app.get('/signup' , function(req,res){
    res.render('signup',{err : ""})
})
app.post('/signup',function(req,res){
    var username = req.body.username;
    var psd = req.body.psd;
    var cpsd = req.body.cpsd;
    var err = undefined;

    if(psd != cpsd){
        err = "password and confirm password is different"
        res.render("signup",{err});
        return;
    }
    users.count({username : username},function(err,count){
        if(count != 0) {
            var err = "username has been used"
            res.render("signup",{err});
            return;
        }
        var savedata = new users({
            username : username,
            psd : psd,
        })
        savedata.save(function(err){
            res.redirect("/login");
        })
    })
})

app.listen(3000)