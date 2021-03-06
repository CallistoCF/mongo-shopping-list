var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var config = require('./config');

var app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

var Item = require('./models/item');

app.get('/items', function(req, res) {
  console.log("server: get request started!");
    Item.find(function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        //console.log("Server: items are: ");
        //console.log(items);
        res.status(201).json(items);
    });
});

app.post('/items', function(req, res) {
  console.log("Server: post request started!");
    Item.create({
        name: req.body.name
    }, function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(item);
    });
});

app.put('/items/:id', function(req, res) {
  var update = String(req.body.name);
  var query = req.body.id;
  var options = {new:true};
  var a = String(update);
  Item.findOneAndUpdate(query, a, options,
    function(err, item) {
    if (!err) {
      item.name = req.body.name;
      item.save();
      res.status(201).json(item);
    }
    else
    {
      return res.status(500).json({
        message: "Incorrect put request"
      });
    }
  });
});

app.delete('/items/:item_id', function(req, res) {
  Item.findOneAndRemove({
    id: req.body.id
  }, function(err, item) {
    if (err) {
      return res.status(500).json({
        message: "Incorrect delete request"
      });
    }
    res.status(201).json(item);
  });
});

app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});

var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            if (callback) {
                callback();
            }
        });
    });
};

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
}

exports.app = app;
exports.runServer = runServer;
