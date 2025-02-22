var quartz = require('./quartz');

quartz.connect({
  auth_required: true
}, function(err) {
  if (!err) {
    quartz.query('torrent-get', {
      fields: [
        "id"
      , "name"
      , "status"
      ]
    }, function(err, res, body) {
      if (err) {
        console.log('Error: ' + err);
      } else {
        console.log(require('util').inspect(body, false, 50));
      }
    });
  } else {
    console.log('Error: ' + err);
  }
});