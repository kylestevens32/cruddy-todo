const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};



const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

// readCounter will take a callback that accepts (err and the data from readFile) Ex: callback(null, Number(fileData));

// use writeCounter to update the count to be + 1

exports.getNextUniqueId = (callback) => {
  readCounter((err, counter) => {
    if (err) {
      callback(err);
    } else {
      writeCounter(counter + 1, (err, counterString) => {
        if (err) {
          callback(err);
        } else {
          callback(null, counterString); //counterString = 00001
        }
      });
    }
  });
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

// __dirname will be file path up until rfp2302-cruddy-todo/datastore/ joined with 'counter.txt'

exports.counterFile = path.join(__dirname, 'counter.txt');
