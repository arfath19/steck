var express = require('express');
var router = express.Router();
//var mongo = require('mongodb').MongoClient;
//var objectId = require('mongodb').ObjectID;
//var assert = require('assert');
//var url = 'mongodb://localhost:27017/test';
var db = require('monk')('localhost:27017/test');
var userData =  db.get('users');
var Response = require('../routes/response');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "Steck"});
});
router.get('/get-data', function(req, res, next){
  //var resulArray = [];
  var data = userData.find({});
  data.then(function(docs){
    res.render('index',{items: docs});
  });
  /*mongo.connect(url, function(err, db){
    assert.equal(null, err);
    var cursor = db.db('test').collection('user-data').find();
    cursor.forEach(function(doc, err){
      assert.equal(null, err);
      resulArray.push(doc);
    }, function(){
      db.close();
      res.render('index', {items: resulArray});
    });
  })*/
});
router.post('/insert', function(req, res, next){
    var item = {
      email: req.body.email,
      pwd: req.body.pwd
    };
  console.log(item.email, item.pwd);
 
  userData.findOne({user: item.email, pwd: item.pwd}, function(err, docs){
    if(err){
      console.log(err);
    }
    if(docs){
      if(!req.expressSession.user){
        Response.unauthorizedRequest('You are not logged in', res);
      }else{
        Response.successResponse('Welcome to dashboard!', res, req.expressSession.user);
        res.render('overview', {name: item.email});
      }
     
     // res.sendfile('.//overview.html');
    }
    else{
      console.log("User not found");
    }
  });
  router.get('/devices', function(req, res, next){
    if(!req.session.user){
      Response.unauthorizedRequest('You are not logged in', res);
    }else{
      Response.successResponse('Welcome to dashboard!', res, req.expressSession.user);
      res.render('devices');

    }
  });
  // GET /logout
router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});
  /*mongo.connect(url, function(err, db){
    assert.equal(null, err);
    db.db('test').collection('user-data').insertOne(item, function(err, result){
      assert.equal(null, err);
      console.log("Item Inserted");
      db.close();
    });
  });*/
});
router.post('/update', function(req, res, next) {
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };
  var id = req.body.id;
  //userData.update({"_id": db.id(id)}, item);
  userData.update(id, item);
  /*mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.db('test').collection('user-data').updateOne({"_id": objectId(id)}, {$set: item}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });*/
    res.redirect('/');
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;
  //userData.remove({"_id": db.id(id)}, item);
  userData.remove(id);
  /*mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.db('test').collection('user-data').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      console.log('Item deleted');
      db.close();
    });
  });*/
  res.redirect('/');
});
module.exports = router;
