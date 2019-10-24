var http = require('http');
var path = require('path');
const express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");
var port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ encoded: false}));
const Todo = require("./models/todo.model");
const mongoDB = "mongodb+srv://test:test123@cluster0-usd62.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB connection error"));


var task = [];
var complete = [];

app.get('/', function(req, res){
    Todo.find(function(err, todo){
        if(err){
            console.log(err);
        }else{
            task = [];
            for(i = 0; i <todo.length; i++){
                task.push(todo[i].item);
            }
        }
    });

    res.render("index", {task: task, complete: complete});
});

app.post('/addtask', function(req, res){
    let newTodo = new Todo({
        item: req.body.newtask,
        done: false
    });
    newTodo.save(function(err){
        if (err){
            console.log(err);
        }
         res.redirect('/');
    });

});

app.post('/removetask', function(req, res){
 var completeTask = req.body.check;
    if(typeof completeTask === "string"){
        Todo.updateOne({item: completeTask},{done: true}, function(err){
            console.log(err);
        });
    }else if (typeof completeTask === "object"){
        for(var i = 0; i < completeTask.length; i++){
            Todo.updateOne({item: completeTask[i]},{done: true}, function(err){
            console.log(err);
        });
        }
    }
    res.redirect('/');
});

http.createServer(app).listen(port, function(){

});