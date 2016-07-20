/*
 * Copyright (C) 2012 Xavier Antoviaque <xavier@antoviaque.org>
 *
 * This software's license gives you freedom; you can copy, convey,
 * propagate, redistribute and/or modify this program under the terms of
 * the GNU Affero Gereral Public License (AGPL) as published by the Free
 * Software Foundation (FSF), either version 3 of the License, or (at your
 * option) any later version of the AGPL published by the FSF.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero
 * General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program in a file in the toplevel directory called
 * "AGPLv3".  If not, see <http://www.gnu.org/licenses/>.
*/

// Imports /////////////////////////////////////////////////////

var restify = require('restify')
  , Logger = require('bunyan')
  , mime = require('mime')
  , path = require('path')
  , filed = require('filed');


// Database ////////////////////////////////////////////////////

var mongoose = require('mongoose')
  , db = mongoose.connect('mongodb://localhost/forum')
  , Thread = require('./models.js').Thread(db)
  , Message = require('./models.js').Message(db);

// Views ///////////////////////////////////////////////////////

function get_thread(req, res, next) {
    var send_result = function(err, thread_list) {
        if (err) {
            return next(err);
        }
        
        if(thread_list) {
            if(thread_list.messages) {
                thread_list.messages.sort(function(a, b) {
                    return ((a.date_added < b.date_added) ? -1 : (a.date_added > b.date_added) ? 1 : 0); 
                });
            }
            res.send(thread_list);
            return next();
        } else {
            return next(new restify.ResourceNotFoundError("Could not find any such thread"));
        }
    };
    
    if('_id' in req.params) {
        Thread.findOne({'_id': req.params._id}, send_result);
    } else {
        Thread.find({}, send_result);        
    }
}

function post_thread(req, res, next) {
    if(!req.body.title) {
        return next(new restify.MissingParameterError("Missing required thread or message attribute in request body"));
    }
    
    new_thread = new Thread({title: req.body.title});
    new_thread.save();
    res.send(new_thread);
    
    return next();
}

function post_message(req, res, next) {
    if(!req.body.author || !req.body.text || !req.body.thread) {
        return next(new restify.MissingParameterError("Missing required message attribute in request body"));
    }
    
    Thread.findOne({_id: req.body.thread}, function(err, thread) {
        if (err) {
            return next(err);
        } else if(!thread) {
            return next(new restify.ResourceNotFoundError("Could not find thread with id="+req.body.thread));
        }
        
        new_message = new Message({author: req.body.author,
                                   text: req.body.text,
                                   date_added: new Date()});
        new_message.save();
        thread.messages.push(new_message);
        thread.save();
        
        res.send(new_message);
        return next();
    })
}


// Server /////////////////////////////////////////////////////

var server = restify.createServer();

server.use(restify.acceptParser(server.acceptable))
  .use(restify.authorizationParser())
  .use(restify.dateParser())
  .use(restify.queryParser({ mapParams: false }))
  .use(restify.bodyParser({ mapParams: false }))
  .use(restify.throttle({
    burst: 10,
    rate: 1,
    ip: false,
    xff: true,
  }));

// Logging
server.on('after', restify.auditLogger({
    log: new Logger({
        name: 'mok',
        streams: [{ level: "info", stream: process.stdout }, 
                  { level: "info", path: 'log/server.log' }],
    })
}));


// Routes /////////////////////////////////////////////////////

// Thread
server.get('/api/thread/', get_thread);
server.get('/api/thread/:_id', get_thread);
server.post('/api/thread/', post_thread);

// Message
server.post('/api/message/', post_message);

// Static Content /////////////////////////////////////////////

server.get(/\/(css|img|js)?.*/, restify.serveStatic({
  directory: './static',
  default: 'index.html'
}));

server.get('/', restify.serveStatic({
  directory: './static',
  default: 'index.html'
}));

server.listen(3001, function() {
    console.log('%s listening at %s', server.name, server.url);
});

