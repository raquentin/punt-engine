var request = require('request')
  , _ = require('underscore');

function Quartz() {}

Quartz.prototype.connect = function(options, callback) {
  var defaults = {
      url: "http://localhost:9091/transmission/rpc"
    , auth_required: false
    , username: "admin"
    , password: "password"
  };

  var opts = _.extend(defaults, options);

  this.url = opts.url;
  this.auth_required = opts.auth_required;
  this.username = opts.username;
  this.password = opts.password;

  // connect and get the authorisation key
  this.query("torrent-get", {
    fields: [
      "id"
    , "name"
    , "status"
    ]
  }, function(err, res, body) {
    if (err) {
      callback(err);
    } else {
      if (body.result == "success") {
        callback(null);
      } else {
        callback(err);
      }
    }
  });
}

Quartz.prototype.query = function(method, args, callback) {
  var self = this;

  var data = {
    'method': method,
    'arguments': args
  };

  var json = JSON.stringify(data);

  var headers = {
    'Content-Type': 'application/json',
    'x-transmission-session-id': this.session_id
  };

  if (this.auth_required) {
    var auth = new Buffer(this.username + this.password).toString('base64');
    headers['Authorization'] = 'Basic ' + auth;
  }

  var req = {uri: this.url, method: 'POST', body: json, headers: headers};

  request(req, function(err, res, body) {
    if (res.headers['x-transmission-session-id']) self.session_id = res.headers['x-transmission-session-id'];

    switch (res.statusCode) {
      case 409:
        self.query(method, args, callback);
      break;
      case 401:
        throw new Error("Invalid username / password");
      break;
      default:
        try {
          var json_body = JSON.parse(body);
        } catch (e) {
          callback.call(this, e, null, null);
        }

        if (typeof json_body != "undefined") {
          callback.call(this, err, res, json_body);
        } else {
          callback.call(this, "unable to parse JSON", null, null);
        }
      break;
    }
  });
};

module.exports = new Quartz();