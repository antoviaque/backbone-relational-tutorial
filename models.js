
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

/**
 * Schema definition
 */

var Thread = new Schema({
    title      : String
  , messages   : [Message]
});

var Message = new Schema({
    date_added : Date
  , author     : String 
  , text       : String
});


/**
 * Models
 */

mongoose.model('Thread', Thread);
exports.Thread = function(db) {
  return db.model('Thread');
};

mongoose.model('Message', Message);
exports.Message = function(db) {
    return db.model('Message');
};

