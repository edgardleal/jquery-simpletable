var Db = require('mongodb').Db,
  MongoClient = require('mongodb').MongoClient,
  Server = require('mongodb').Server,
  ReplSetServers = require('mongodb').ReplSetServers,
  ObjectID = require('mongodb').ObjectID,
  Binary = require('mongodb').Binary,
  GridStore = require('mongodb').GridStore,
  Grid = require('mongodb').Grid,
  Code = require('mongodb').Code,
  BSON = require('mongodb').pure().BSON,
  url = require('url'),
  assert = require('assert');

var bodyParser = require('body-parser');

var express = require('express'),
    app = express();

//app.use(express.compress());

app.use(bodyParser());
var oneDay = 86400000;

app.use(express.static(__dirname , { maxAge: oneDay }));

//app.use(express.bodyParser());
app.use(function(request, response, next){
    var keys = Object.keys(request.body);
    for(var i in keys){
      if(keys[i] == '_id'){
        request.body[keys[i]] = ObjectID(request.body[keys[i]]);
      }
    }
    next();
  });


var dbname = 'lg';

  save = function(req, res, collection){
    var obj = req.body;
    var mongoclient = new MongoClient(new Server("localhost", 27017), {native_parser: true});
    mongoclient.open(function(err, mongoclient) {

    var db = mongoclient.db(dbname);
    db.collection(collection, function(err, collection) {
      obj = JSON.stringify( obj).toString().replace(/\\/g, '');
      console.log('Request body: ' + req.body.length);
      obj = obj.substring(2,obj.length - 5); 
      console.log('try save :0 ' + obj.toString());
        collection.save(req.body, function(){
            console.log('Data was saved in collection');
          });
        res.send('Ok');
      });
    db.close();
    });
  };

 list  = function(request, response, collection){
    // Set up the connection to the local db
    var mongoclient = new MongoClient(new Server("localhost", 27017), {native_parser: true});
    // Open the connection to the server
    mongoclient.open(function(err, mongoclient) {

    // Get the first db and do an update document on it
    var db = mongoclient.db(dbname);
    db.collection(collection, function(err, collection) {
      collection.find({}).toArray(function(err, list){
        db.close();
        var result = list.map(function(data){
          return data.total * (Math.random() + 0.5);
        });
        response.json(list);  
      });
    });
    });
  };

    app.get('/ocorrencia', function(req, res){
       list(req, res, 'ocorrencia'); 
    });

    app.post('/ocorrencia', function(request, response){
        save(request, response, 'ocorrencia');
      });

    app.listen(8080, function(){
        console.log('Server started');
      });
