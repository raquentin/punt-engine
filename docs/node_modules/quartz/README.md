# Quartz
A module to interface with Transmission's RPC

# How to install
`npm install quartz`

# Functions

## quartz.connect(options, callback)
    var quartz = require('quartz');

    quartz.connect({
      url: "http://localhost:9091/transmission/rpc"
      , auth_required: false
      , username: "admin"
      , password: "password"
    }, function(err) {
      if (err) { console.log(err); } else {
        // Connected!
      }
    });

## quartz.query(method, args, callback)
    // after connect

    quartz.query(
      'torrent-get',
      {fields: ['id', 'name']},
      function(err, res, body) {
        if (err) {
          console.log(err);
        } else {
          // do stuff
        }
      }
    );

# Features
* Auth based login support

# Todo
* Functions for each RPC call

# Author
* Robin Duckett <[robin.duckett@gmail.com](mailto:robin.duckett@gmail.com)>