
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

/**
 * Schema definition
 */

var Message = new Schema();
Message.add({
    date_added : Date
  , author     : String 
  , text       : String
});
 
var Thread = new Schema();
Thread.add({
    title      : String
  , messages   : [Message]
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

