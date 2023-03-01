const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');


// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err);
    } else {
      var filepath = path.join(exports.dataDir, (id + '.txt'));
      fs.writeFile(filepath, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    } else {
      var data = _.map(files, (fileName) => {
        return new Promise((resolve, reject) => {
          var id = path.basename(fileName, '.txt');
          var filepath = path.join(exports.dataDir, (id + '.txt'));
          fs.readFile(filepath, 'utf8', (err, content) => {
            if (err) {
              reject(err);
            } else {
              var todoItem = {
                'id': id,
                'text': content
              };
              resolve(todoItem);
            }
          });
        });
      });
      Promise.all(data)
        .then((todo) => {
          callback(null, todo);
        })
        .catch((err) => {
          callback(err);
        });
    }
  });
};

exports.readOne = (id, callback) => {
  var filepath = path.join(exports.dataDir, (id + '.txt'));

  fs.readFile(filepath, (err, text) => {
    if (err) {
      callback(err);
    } else {
      callback(null, { 'id': id, 'text': text.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  var filepath = path.join(exports.dataDir, (id + '.txt'));

  fs.readFile(filepath, (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(filepath, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var filepath = path.join(exports.dataDir, (id + '.txt'));
  fs.rm(filepath, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
